use dashmap::DashMap;
use uuid::Uuid;
use std::sync::Arc;
use crate::models::*;

#[derive(Clone)]
pub struct Store {
    pub providers: Arc<DashMap<Uuid, Provider>>,
    pub models: Arc<DashMap<Uuid, ModelProfile>>,
    pub datasets: Arc<DashMap<Uuid, Dataset>>,
    pub proposals: Arc<DashMap<Uuid, ApiProposal>>,
    pub apis: Arc<DashMap<Uuid, ApiProduct>>,
}

impl Default for Store {
    fn default() -> Self {
        Self {
            providers: Arc::new(DashMap::new()),
            models: Arc::new(DashMap::new()),
            datasets: Arc::new(DashMap::new()),
            proposals: Arc::new(DashMap::new()),
            apis: Arc::new(DashMap::new()),
        }
    }
}

#[derive(Clone)]
pub struct AppState {
    pub store: Store,
}

impl Default for AppState {
    fn default() -> Self { Self { store: Store::default() } }
}
