mod routes;
mod state;
mod models;

use axum::serve;
use std::net::SocketAddr;
use routes::app;
use state::AppState;

#[tokio::main]
async fn main() {
    let state = AppState::default();
    let app = app(state);
    let addr = SocketAddr::from(([0,0,0,0], 8787));
    println!("Minam API running on http://{}/", addr);
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    serve(listener, app.into_make_service())
        .await
        .unwrap();
}
