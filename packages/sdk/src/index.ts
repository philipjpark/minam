export class MinamClient {
  constructor(private cfg: { baseUrl: string }) {}
  private async req(path: string, init?: RequestInit) {
    const res = await fetch(new URL(path, this.cfg.baseUrl), {
      headers: { 'content-type': 'application/json' },
      ...init,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
  // Providers
  createProvider(body: any){ return this.req('/api/providers', { method:'POST', body: JSON.stringify(body)}); }
  listProviders(){ return this.req('/api/providers'); }
  // Models
  createModel(body: any){ return this.req('/api/models', { method:'POST', body: JSON.stringify(body)}); }
  listModels(){ return this.req('/api/models'); }
  // Datasets
  createDataset(body: any){ return this.req('/api/datasets', { method:'POST', body: JSON.stringify(body)}); }
  listDatasets(){ return this.req('/api/datasets'); }
  previewDataset(id: string){ return this.req(`/api/datasets/${id}/preview`); }
  // Pipeline
  runPipeline(body: any){ return this.req('/api/pipelines', { method:'POST', body: JSON.stringify(body)}); }
  // APIs
  createApi(body: any){ return this.req('/api/apis', { method:'POST', body: JSON.stringify(body)}); }
  listApis(){ return this.req('/api/apis'); }
  queryApi(apiId: string, body: any){ return this.req(`/v1/data/${apiId}/query`, { method:'POST', body: JSON.stringify(body)}); }
}
