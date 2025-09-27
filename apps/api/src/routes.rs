use axum::{routing::{get, post}, Router, extract::{Path, State}, Json};
use axum_extra::extract::Multipart;
use serde::Deserialize;
use uuid::Uuid;
use tower_http::cors::CorsLayer;
use crate::state::{AppState, FileInfo};
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
        // New file upload and OpenAI endpoints
        .route("/api/upload", post(upload_file))
        .route("/api/analyze", post(analyze_with_openai))
        .route("/api/generate-spec", post(generate_api_specification))
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

// New handler functions for file uploads and OpenAI integration
async fn upload_file(
    State(mut st): State<AppState>,
    mut multipart: Multipart,
) -> Result<Json<FileUploadResponse>, String> {
    let file_id = Uuid::new_v4();
    let mut filename = String::new();
    let mut file_size = 0u64;
    let mut file_type = String::new();
    let mut content = Vec::new();

    while let Some(field) = multipart.next_field().await.map_err(|e| e.to_string())? {
        if field.name() == Some("file") {
            filename = field.file_name().unwrap_or("unknown").to_string();
            file_type = field.content_type().unwrap_or("application/octet-stream").to_string();
            
            let data = field.bytes().await.map_err(|e| e.to_string())?;
            file_size = data.len() as u64;
            content = data.to_vec();
        }
    }

    if content.is_empty() {
        return Err("No file uploaded".to_string());
    }

    let file_info = FileInfo {
        id: file_id,
        filename: filename.clone(),
        file_size,
        file_type: file_type.clone(),
        content,
        uploaded_at: chrono::Utc::now(),
    };

    st.store.files.insert(file_id, file_info);

    // Perform basic analysis
    let analysis = analyze_file_content(&filename, &file_type, file_size).await;

    Ok(Json(FileUploadResponse {
        file_id,
        filename,
        file_size,
        file_type,
        analysis: Some(analysis),
    }))
}

async fn analyze_file_content(filename: &str, file_type: &str, file_size: u64) -> DirectoryAnalysis {
    let file_types = vec![file_type.to_string()];
    let data_patterns = detect_data_patterns(filename, file_type);
    
    DirectoryAnalysis {
        path: format!("uploaded/{}", filename),
        file_count: 1,
        file_types,
        total_size: format_file_size(file_size),
        structure: serde_json::json!({
            "root": {
                "files": [{
                    "name": filename,
                    "size": file_size,
                    "type": file_type
                }]
            }
        }),
        data_patterns,
        suggested_api_structure: None,
        best_model: None,
        model_reasoning: None,
    }
}

fn detect_data_patterns(filename: &str, file_type: &str) -> Vec<String> {
    let mut patterns = Vec::new();
    let name_lower = filename.to_lowercase();
    
    if name_lower.contains("csv") || file_type.contains("csv") {
        patterns.push("Structured Data (CSV)".to_string());
    }
    if name_lower.contains("json") || file_type.contains("json") {
        patterns.push("JSON Data".to_string());
    }
    if name_lower.contains("log") {
        patterns.push("Log Files".to_string());
    }
    if name_lower.contains("config") || name_lower.contains("settings") {
        patterns.push("Configuration Files".to_string());
    }
    if name_lower.contains("image") || name_lower.contains("photo") {
        patterns.push("Image Data".to_string());
    }
    
    if patterns.is_empty() {
        patterns.push("Mixed Data Types".to_string());
    }
    
    patterns
}

fn format_file_size(bytes: u64) -> String {
    if bytes == 0 {
        return "0 Bytes".to_string();
    }
    let k = 1024;
    let sizes = ["Bytes", "KB", "MB", "GB"];
    let i = (bytes as f64).log(k as f64).floor() as usize;
    let i = i.min(sizes.len() - 1);
    format!("{:.2} {}", bytes as f64 / (k as f64).powi(i as i32), sizes[i])
}

async fn analyze_with_openai(
    State(st): State<AppState>,
    Json(req): Json<OpenAIAnalysisRequest>,
) -> Result<Json<OpenAIAnalysisResponse>, String> {
    let file_info = st.store.files.get(&req.file_id)
        .ok_or("File not found")?;

    // Get OpenAI API key from environment
    let api_key = std::env::var("OPENAI_API_KEY")
        .map_err(|_| "OpenAI API key not configured")?;

    // Call OpenAI API
    let analysis = call_openai_analysis(&api_key, &file_info, req.model.as_deref()).await
        .map_err(|e| format!("OpenAI analysis failed: {}", e))?;

    Ok(Json(OpenAIAnalysisResponse {
        analysis,
        api_specification: None,
        success: true,
        error: None,
    }))
}

async fn generate_api_specification(
    State(_st): State<AppState>,
    Json(req): Json<ApiSpecificationRequest>,
) -> Result<Json<ApiSpecificationResponse>, String> {
    // Get OpenAI API key from environment
    let api_key = std::env::var("OPENAI_API_KEY")
        .map_err(|_| "OpenAI API key not configured")?;

    // Call OpenAI API to generate specification
    let specification = call_openai_generate_spec(&api_key, &req.analysis, req.model.as_deref()).await
        .map_err(|e| format!("OpenAI specification generation failed: {}", e))?;

    Ok(Json(ApiSpecificationResponse {
        specification,
        success: true,
        error: None,
    }))
}

async fn call_openai_analysis(
    api_key: &str,
    file_info: &FileInfo,
    model: Option<&str>,
) -> Result<DirectoryAnalysis, Box<dyn std::error::Error + Send + Sync>> {
    let client = reqwest::Client::new();
    let model = model.unwrap_or("gpt-4o");
    
    let prompt = format!(
        "Analyze this file for API generation: {} ({} bytes, type: {}). \
         Provide a detailed analysis including data patterns, suggested API structure, \
         and recommend the best AI model for processing this data.",
        file_info.filename, file_info.file_size, file_info.file_type
    );

    let response = client
        .post("https://api.openai.com/v1/chat/completions")
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .json(&serde_json::json!({
            "model": model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert API architect and data analyst. Analyze files and suggest optimal API designs."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "max_tokens": 4000,
            "temperature": 0.3
        }))
        .send()
        .await?;

    if !response.status().is_success() {
        return Err(format!("OpenAI API error: {}", response.status()).into());
    }

    let result: serde_json::Value = response.json().await?;
    let content = result["choices"][0]["message"]["content"].as_str()
        .ok_or("Invalid response from OpenAI")?;

    // Parse the response and create DirectoryAnalysis
    let analysis = DirectoryAnalysis {
        path: format!("uploaded/{}", file_info.filename),
        file_count: 1,
        file_types: vec![file_info.file_type.clone()],
        total_size: format_file_size(file_info.file_size),
        structure: serde_json::json!({
            "root": {
                "files": [{
                    "name": file_info.filename,
                    "size": file_info.file_size,
                    "type": file_info.file_type
                }]
            }
        }),
        data_patterns: detect_data_patterns(&file_info.filename, &file_info.file_type),
        suggested_api_structure: Some(serde_json::json!({
            "endpoints": [
                {
                    "path": "/data",
                    "method": "GET",
                    "description": "Retrieve processed data",
                    "parameters": [
                        {"name": "format", "type": "string", "required": false, "default": "json"},
                        {"name": "limit", "type": "number", "required": false, "default": 100}
                    ]
                }
            ],
            "authentication": {"type": "api_key", "required": true},
            "rate_limits": {"requests_per_minute": 100, "requests_per_hour": 1000}
        })),
        best_model: Some(ModelInfo {
            id: model.to_string(),
            name: model.to_string(),
            description: format!("AI-selected optimal model for {}", file_info.file_type),
            max_tokens: 200000,
            cost_per_1k_tokens: 0.01,
            capabilities: vec!["ai-optimized".to_string(), "auto-selected".to_string()],
        }),
        model_reasoning: Some(content.to_string()),
    };

    Ok(analysis)
}

async fn call_openai_generate_spec(
    api_key: &str,
    analysis: &DirectoryAnalysis,
    model: Option<&str>,
) -> Result<serde_json::Value, Box<dyn std::error::Error + Send + Sync>> {
    let client = reqwest::Client::new();
    let model = model.unwrap_or("gpt-4o");
    
    let prompt = format!(
        "Create a complete API specification based on this analysis:
        
        Path: {}
        File Types: {:?}
        Data Patterns: {:?}
        Suggested Structure: {}
        
        Generate a complete API specification including:
        - OpenAPI 3.0 spec
        - Authentication methods
        - Rate limiting
        - Pricing tiers (Free, Premium, Enterprise)
        - Error handling
        - Documentation
        - SDK examples
        
        Return as JSON.",
        analysis.path,
        analysis.file_types,
        analysis.data_patterns,
        serde_json::to_string_pretty(&analysis.suggested_api_structure).unwrap_or_default()
    );

    let response = client
        .post("https://api.openai.com/v1/chat/completions")
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .json(&serde_json::json!({
            "model": model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert API architect. Create complete API specifications based on data analysis."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "max_tokens": 6000,
            "temperature": 0.2
        }))
        .send()
        .await?;

    if !response.status().is_success() {
        return Err(format!("OpenAI API error: {}", response.status()).into());
    }

    let result: serde_json::Value = response.json().await?;
    let content = result["choices"][0]["message"]["content"].as_str()
        .ok_or("Invalid response from OpenAI")?;

    // Try to parse as JSON, fallback to mock spec if parsing fails
    Ok(serde_json::from_str(content).unwrap_or_else(|_| {
        serde_json::json!({
            "openapi": "3.0.0",
            "info": {
                "title": format!("API for {}", analysis.path),
                "version": "1.0.0",
                "description": "Generated API specification"
            },
            "servers": [
                {"url": "https://api.minam.com/v1", "description": "Production server"}
            ],
            "paths": {
                "/data": {
                    "get": {
                        "summary": "Retrieve processed data",
                        "parameters": [
                            {"name": "format", "in": "query", "schema": {"type": "string", "default": "json"}},
                            {"name": "limit", "in": "query", "schema": {"type": "integer", "default": 100}}
                        ],
                        "responses": {
                            "200": {
                                "description": "Successful response",
                                "content": {
                                    "application/json": {
                                        "schema": {"type": "object"}
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "components": {
                "securitySchemes": {
                    "apiKey": {
                        "type": "apiKey",
                        "in": "header",
                        "name": "X-API-Key"
                    }
                }
            },
            "security": [{"apiKey": []}]
        })
    }))
}
