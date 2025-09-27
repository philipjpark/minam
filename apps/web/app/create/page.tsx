'use client';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const API = process.env.NEXT_PUBLIC_MINAM_API || 'http://localhost:8787';

export default function CreateFlow() {
  const [providers, setProviders] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [providerId, setProviderId] = useState<string>('');
  const [modelId, setModelId] = useState<string>('');
  const [proposal, setProposal] = useState<any>(null);
  const [datasetId, setDatasetId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/providers`).then(r=>r.json()).then(setProviders);
    fetch(`${API}/api/models`).then(r=>r.json()).then(setModels);
  }, []);

  async function seedExamples() {
    setIsLoading(true);
    try {
      // create provider, model, dataset using examples folder assumptions
      const prov = await fetch(`${API}/api/providers`, {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({name:'Acme Retail', contact_email:'ops@acme.test'})}).then(r=>r.json());
      setProviderId(prov.id);
      const model = await fetch(`${API}/api/models`, {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({
        name:'gpt5-trade-signal', version:'1', description:'Example features for GPT‑5 signals',
        features:[{name:'symbol',dtype:'string'},{name:'ts',dtype:'datetime'},{name:'price',dtype:'number'},{name:'rvol_5m',dtype:'number'},{name:'funding_1h',dtype:'number'}]
      })}).then(r=>r.json());
      setModelId(model.id);
      const ds = await fetch(`${API}/api/datasets`, {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({
        provider_id: prov.id, name:'Acme Crypto Ticks', description:'Sample 1‑min bars',
        rows:[
          {"symbol":"SOL","ts":"2025-09-26T09:00:00Z","price":150.12,"rvol_5m":3.1,"funding_1h":-0.01},
          {"symbol":"SOL","ts":"2025-09-26T09:01:00Z","price":150.33,"rvol_5m":3.3,"funding_1h":-0.012},
          {"symbol":"ETH","ts":"2025-09-26T09:00:00Z","price":3200.5,"rvol_5m":1.8,"funding_1h":0.002}
        ]
      })}).then(r=>r.json());
      setDatasetId(ds.id);
    } finally {
      setIsLoading(false);
    }
  }

  async function runPipeline() {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/api/pipelines`, {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({
        dataset_id: datasetId, model_profile_id: modelId, min_coverage: 0.8
      })}).then(r=>r.json());
      setProposal(res);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl shadow-glow mb-6">
                <span className="text-3xl">✨</span>
              </div>
              <h1 className="text-5xl font-bold text-glow mb-6">
                Create Your 
                <span className="text-primary-gold"> API Empire</span>
              </h1>
              <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
                Upload your data and watch our AI transform it into a money-making API in minutes
              </p>
            </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="card group">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-primary-gold mb-2">Configuration</h2>
                <p className="text-text-secondary">Set up your data pipeline</p>
              </div>
              <button 
                onClick={seedExamples} 
                disabled={isLoading}
                className="btn btn-secondary group-hover:scale-105 transition-transform duration-300"
              >
                {isLoading ? '⏳' : '🌱'} Seed Examples
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-lg font-semibold text-white mb-3">Data Provider</label>
                <select 
                  className="input" 
                  value={providerId} 
                  onChange={e=>setProviderId(e.target.value)}
                >
                  <option value="">Choose your data provider...</option>
                  {providers.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold text-white mb-3">AI Model Profile</label>
                <select 
                  className="input" 
                  value={modelId} 
                  onChange={e=>setModelId(e.target.value)}
                >
                  <option value="">Select the perfect AI model...</option>
                  {models.map(m=><option key={m.id} value={m.id}>{m.name}@{m.version}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold text-white mb-3">Dataset ID</label>
                <input 
                  className="input" 
                  value={datasetId} 
                  onChange={e=>setDatasetId(e.target.value)} 
                  placeholder="Enter your dataset ID or use seed examples" 
                />
              </div>

              <button 
                onClick={runPipeline} 
                disabled={!providerId || !modelId || !datasetId || isLoading}
                className="btn btn-primary w-full text-xl py-4 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isLoading ? '⏳ Processing...' : '🚀 Generate My API'}
                </span>
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="card group">
            <h3 className="text-3xl font-bold text-accent-blue mb-6">Your API Results</h3>
            
            {proposal?.result ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-success/20 to-success/10 border border-success/30 rounded-xl p-6">
                  <h4 className="font-bold text-success text-xl mb-3 flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    API Generated Successfully!
                  </h4>
                  <p className="text-text-secondary">Proposal ID: <span className="text-primary-gold font-mono">{proposal.proposal_id}</span></p>
                </div>
                
                <div className="bg-background-elevated rounded-xl p-6 border border-divider">
                  <h4 className="font-bold text-white text-lg mb-4">API Output Preview</h4>
                  <pre className="bg-background-dark text-accent-blue p-4 rounded-lg overflow-auto text-sm border border-divider">
                    {JSON.stringify(proposal.result, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-3xl">📊</span>
                </div>
                <h4 className="text-xl font-semibold text-white mb-3">Ready to Generate Your API</h4>
                <p className="text-text-secondary">
                  Configure your pipeline and click "Generate My API" to see your money-making API here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🔍</span>
            </div>
            <h4 className="text-xl font-bold text-primary-gold mb-3">AI Validation</h4>
            <p className="text-text-secondary leading-relaxed">
              Our AI automatically checks data quality and validates schemas to ensure maximum profitability
            </p>
          </div>

          <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🧠</span>
            </div>
            <h4 className="text-xl font-bold text-accent-blue mb-3">Smart Profiling</h4>
            <p className="text-text-secondary leading-relaxed">
              Advanced AI finds the perfect model for your data and creates the most profitable API structure
            </p>
          </div>

          <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">💰</span>
            </div>
            <h4 className="text-xl font-bold text-primary-gold mb-3">Instant Revenue</h4>
            <p className="text-text-secondary leading-relaxed">
              Deploy your API immediately and start earning money from every single API call
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
