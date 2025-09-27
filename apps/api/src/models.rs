use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Clone, Serialize, Deserialize)]
pub struct Provider {
    pub id: Uuid,
    pub name: String,
    pub contact_email: String,
}

#[derive(Deserialize)]
pub struct ProviderCreate {
    pub name: String,
    pub contact_email: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct ModelProfile {
    pub id: Uuid,
    pub name: String,
    pub version: String,
    pub description: String,
    pub features: Vec<FeatureSpec>,
}

#[derive(Deserialize)]
pub struct ModelProfileCreate {
    pub name: String,
    pub version: String,
    pub description: String,
    pub features: Vec<FeatureSpec>,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct FeatureSpec {
    pub name: String,
    pub dtype: String, // "string" | "number" | "datetime" | ...
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Dataset {
    pub id: Uuid,
    pub provider_id: Uuid,
    pub name: String,
    pub description: String,
    pub rows: Vec<serde_json::Value>,
}

#[derive(Deserialize)]
pub struct DatasetCreate {
    pub provider_id: Uuid,
    pub name: String,
    pub description: String,
    pub rows: Vec<serde_json::Value>,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct FeatureCoverage {
    pub name: String,
    pub coverage: f64,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct ApiProposal {
    pub dataset_id: Uuid,
    pub model_profile_id: Uuid,
    pub sample: Vec<serde_json::Value>,
    pub coverage: Vec<FeatureCoverage>,
    pub pass: bool,
    pub human_note_required: bool,
}

#[derive(Deserialize)]
pub struct PipelineRunRequest {
    pub dataset_id: Uuid,
    pub model_profile_id: Uuid,
    pub min_coverage: f64,
}

#[derive(Serialize, Deserialize)]
pub struct PipelineRunResult {
    pub proposal_id: Option<Uuid>,
    pub result: Option<ApiProposal>,
    pub error: Option<String>,
}

impl PipelineRunResult {
    pub fn ok(id: Uuid, prop: ApiProposal) -> Self {
        Self { proposal_id: Some(id), result: Some(prop), error: None }
    }
    pub fn error(e: &str) -> Self {
        Self { proposal_id: None, result: None, error: Some(e.to_string()) }
    }
}

#[derive(Clone, Serialize, Deserialize)]
pub struct ApiProduct {
    pub id: Uuid,
    pub name: String,
    pub pricing: String, // e.g. "paygo:$0.002/call"
    pub provider_id: Uuid,
    pub dataset_id: Uuid,
    pub model_profile_id: Uuid,
    pub version: String,
    pub status: String,
    pub human_approval_note: String,
}

impl ApiProduct {
    pub fn error(msg: &str) -> Self {
        Self {
            id: Uuid::nil(),
            name: "error".into(),
            pricing: "".into(),
            provider_id: Uuid::nil(),
            dataset_id: Uuid::nil(),
            model_profile_id: Uuid::nil(),
            version: "".into(),
            status: format!("error:{msg}"),
            human_approval_note: "".into(),
        }
    }
}

#[derive(Deserialize)]
pub struct ApiCreate {
    pub proposal_id: Uuid,
    pub provider_id: Uuid,
    pub name: String,
    pub pricing: String,
    pub human_approval_note: String,
}
