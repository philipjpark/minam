use axum::{routing::{get, post}, Router, extract::{Path, State}, Json};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use std::net::SocketAddr;
use tower_http::cors::{CorsLayer, Any};
use crate::state::{AppState, Store};
use crate::models::*;

pub fn app(state: AppState) -> Router {
    Router::new()
        .route("/health", get(health))
        // Providers
        .route("/api/providers", post(create_provider).get(list_providers))
        // Model Profiles
        .route("/api/models", post(create_model).get(list_models))
        // Datasets
        .route("/api/datasets", post(create_dataset).get(list_datasets))
        .route("/api/datasets/:id/preview", get(preview_dataset))
        // Pipelines
        .route("/api/pipelines", post(run_pipeline))
        // APIs (published products)
        .route("/api/apis", get(list_apis).post(create_api))
        .route("/v1/data/:api_id/query", post(query_api))
        .with_state(state)
        .layer(CorsLayer::very_permissive())
}

async fn health() -> &'static str { "ok" }

async fn create_provider(
    State(mut st): State<AppState>,
    Json(req): Json<ProviderCreate>
) -> Json<Provider> {
    let provider = Provider {
        id: Uuid::new_v4(),
        name: req.name,
        contact_email: req.contact_email,
    };
    st.store.providers.insert(provider.id, provider.clone());
    Json(provider)
}

async fn list_providers(State(st): State<AppState>) -> Json<Vec<Provider>> {
    Json(st.store.providers.iter().map(|kv| kv.value().clone()).collect())
}

async fn create_model(
    State(mut st): State<AppState>,
    Json(req): Json<ModelProfileCreate>
) -> Json<ModelProfile> {
    let profile = ModelProfile {
        id: Uuid::new_v4(),
        name: req.name,
        version: req.version,
        description: req.description,
        // minimal feature schema: name + dtype
        features: req.features,
    };
    st.store.models.insert(profile.id, profile.clone());
    Json(profile)
}

async fn list_models(State(st): State<AppState>) -> Json<Vec<ModelProfile>> {
    Json(st.store.models.iter().map(|kv| kv.value().clone()).collect())
}

async fn create_dataset(
    State(mut st): State<AppState>,
    Json(req): Json<DatasetCreate>
) -> Json<Dataset> {
    let ds = Dataset {
        id: Uuid::new_v4(),
        provider_id: req.provider_id,
        name: req.name,
        description: req.description,
        rows: req.rows,
    };
    st.store.datasets.insert(ds.id, ds.clone());
    Json(ds)
}

async fn list_datasets(State(st): State<AppState>) -> Json<Vec<Dataset>> {
    Json(st.store.datasets.iter().map(|kv| kv.value().clone()).collect())
}

async fn preview_dataset(
    State(st): State<AppState>,
    Path(id): Path<Uuid>,
) -> Json<Vec<serde_json::Value>> {
    let Some(ds) = st.store.datasets.get(&id) else { return Json(vec![])};
    let preview: Vec<_> = ds.rows.iter().take(5).cloned().collect();
    Json(preview)
}

// Run pipeline = validate → map → evaluate → publish proposal
async fn run_pipeline(
    State(mut st): State<AppState>,
    Json(req): Json<PipelineRunRequest>
) -> Json<PipelineRunResult> {
    // Fetch components
    let Some(ds) = st.store.datasets.get(&req.dataset_id) else {
        return Json(PipelineRunResult::error("DATASET_NOT_FOUND"))
    };
    let Some(mp) = st.store.models.get(&req.model_profile_id) else {
        return Json(PipelineRunResult::error("MODEL_PROFILE_NOT_FOUND"))
    };
    // Map: select features
    let mut mapped: Vec<serde_json::Value> = Vec::new();
    for row in ds.rows.iter() {
        let mut out = serde_json::Map::new();
        for feat in mp.features.iter() {
            if let Some(v) = row.get(&feat.name) {
                out.insert(feat.name.clone(), v.clone());
            } else {
                // simple impute: null
                out.insert(feat.name.clone(), serde_json::Value::Null);
            }
        }
        mapped.push(serde_json::Value::Object(out));
    }
    // Evaluate: basic coverage stats
    let total = mapped.len() as f64;
    let mut coverage: Vec<FeatureCoverage> = Vec::new();
    for feat in mp.features.iter() {
        let mut non_null = 0.0;
        for row in mapped.iter() {
            if row.get(&feat.name).and_then(|v| if v.is_null(){None}else{Some(v)}).is_some() {
                non_null += 1.0;
            }
        }
        coverage.push(FeatureCoverage { name: feat.name.clone(), coverage: if total>0.0 { non_null/total } else {0.0} });
    }
    let pass = coverage.iter().all(|c| c.coverage >= req.min_coverage);
    // Create proposal
    let prop = ApiProposal {
        dataset_id: ds.id,
        model_profile_id: mp.id,
        sample: mapped.iter().take(3).cloned().collect(),
        coverage,
        pass,
        human_note_required: true,
    };
    // Store temp proposal
    let prop_id = Uuid::new_v4();
    st.store.proposals.insert(prop_id, prop.clone());
    Json(PipelineRunResult::ok(prop_id, prop))
}

async fn create_api(
    State(mut st): State<AppState>,
    Json(req): Json<ApiCreate>
) -> Json<ApiProduct> {
    // requires an approved proposal
    let Some(prop) = st.store.proposals.get(&req.proposal_id) else {
        return Json(ApiProduct::error("PROPOSAL_NOT_FOUND"))
    };
    if req.human_approval_note.trim().is_empty() { 
        return Json(ApiProduct::error("HUMAN_NOTE_REQUIRED"))
    }
    if !prop.pass { 
        return Json(ApiProduct::error("EVALS_NOT_PASSED"))
    }
    let api = ApiProduct {
        id: Uuid::new_v4(),
        name: req.name,
        pricing: req.pricing,
        provider_id: req.provider_id,
        dataset_id: prop.dataset_id,
        model_profile_id: prop.model_profile_id,
        version: "v1".into(),
        status: "live".into(),
        human_approval_note: req.human_approval_note,
    };
    st.store.apis.insert(api.id, api.clone());
    Json(api)
}

async fn list_apis(State(st): State<AppState>) -> Json<Vec<ApiProduct>> {
    Json(st.store.apis.iter().map(|kv| kv.value().clone()).collect())
}

// Consumer query endpoint: filters mapped rows by simple params
#[derive(Deserialize)]
struct QueryReq {
    // optional filters
    symbol: Option<String>,
    start: Option<chrono::DateTime<chrono::Utc>>,
    end: Option<chrono::DateTime<chrono::Utc>>,
    limit: Option<usize>,
}

async fn query_api(
    State(st): State<AppState>,
    Path(api_id): Path<Uuid>,
    Json(req): Json<QueryReq>
) -> Json<Vec<serde_json::Value>> {
    let Some(api) = st.store.apis.get(&api_id) else { return Json(vec![]) };
    let Some(ds) = st.store.datasets.get(&api.dataset_id) else { return Json(vec![]) };
    // For demo: just filter symbol/time if fields exist
    let mut out = Vec::new();
    for row in ds.rows.iter() {
        if let Some(sym) = req.symbol.as_ref() {
            if let Some(v) = row.get("symbol") {
                if v != sym { continue; }
            }
        }
        // naive time filter (expects ISO in field "ts")
        if let (Some(start), Some(v)) = (req.start, row.get("ts")) {
            if let Some(ts) = v.as_str() {
                if let Ok(t) = ts.parse::<chrono::DateTime<chrono::Utc>>() {
                    if t < start { continue; }
                }
            }
        }
        if let (Some(end), Some(v)) = (req.end, row.get("ts")) {
            if let Some(ts) = v.as_str() {
                if let Ok(t) = ts.parse::<chrono::DateTime<chrono::Utc>>() {
                    if t > end { continue; }
                }
            }
        }
        out.append(&mut vec![row.clone()]);
        if let Some(lim) = req.limit { if out.len() >= lim { break; } }
    }
    Json(out)
}
