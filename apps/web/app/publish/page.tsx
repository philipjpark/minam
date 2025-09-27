'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const API = process.env.NEXT_PUBLIC_MINAM_API || 'http://localhost:8787';

export default function Publish() {
  const [providers, setProviders] = useState<any[]>([]);
  const [apis, setApis] = useState<any[]>([]);
  const [proposalId, setProposalId] = useState<string>('');
  const [providerId, setProviderId] = useState<string>('');
  const [name, setName] = useState('Acme Crypto Signal API');
  const [pricing, setPricing] = useState('paygo:$0.002/call');
  const [note, setNote] = useState('Reviewed 3 samples; OK to publish.');
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/providers`).then(r=>r.json()).then(setProviders);
    fetch(`${API}/api/apis`).then(r=>r.json()).then(setApis);
  }, []);

  async function publish() {
    setIsPublishing(true);
    try {
      const res = await fetch(`${API}/api/apis`, {
        method:'POST', headers:{'content-type':'application/json'},
        body: JSON.stringify({ proposal_id: proposalId, provider_id: providerId, name, pricing, human_approval_note: note })
      }).then(r=>r.json());
      setApis(a=>[res, ...a]);
      
      // Reset form
      setProposalId('');
      setProviderId('');
      setName('Acme Crypto Signal API');
      setPricing('paygo:$0.002/call');
      setNote('Reviewed 3 samples; OK to publish.');
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl shadow-glow mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <h1 className="text-5xl font-bold text-glow mb-6">
                Publish & 
                <span className="text-primary-gold"> Start Earning</span>
              </h1>
              <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
                Launch your API to our marketplace and watch the money roll in with every call
              </p>
            </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Publish Form */}
          <div className="card group">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-primary-gold mb-3">API Publication Details</h2>
              <p className="text-text-secondary text-lg">
                Set your pricing and launch your money-making API
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-lg font-semibold text-white mb-3">Proposal ID</label>
                <input 
                  className="input" 
                  value={proposalId} 
                  onChange={e=>setProposalId(e.target.value)} 
                  placeholder="Enter your proposal UUID..." 
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-white mb-3">Data Provider</label>
                <select 
                  className="input" 
                  value={providerId} 
                  onChange={e=>setProviderId(e.target.value)}
                >
                  <option value="">Choose your provider...</option>
                  {providers.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold text-white mb-3">API Name</label>
                <input 
                  className="input" 
                  value={name} 
                  onChange={e=>setName(e.target.value)} 
                  placeholder="Give your API a catchy name..."
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-white mb-3">Pricing Model</label>
                <input 
                  className="input" 
                  value={pricing} 
                  onChange={e=>setPricing(e.target.value)} 
                  placeholder="e.g., paygo:$0.002/call"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-white mb-3">Approval Note</label>
                <textarea 
                  className="input" 
                  rows={4} 
                  value={note} 
                  onChange={e=>setNote(e.target.value)}
                  placeholder="Why should customers trust your API?"
                />
              </div>

              <button 
                className="btn btn-primary w-full text-xl py-4 group relative overflow-hidden"
                onClick={publish}
                disabled={!proposalId || !providerId || !name || !pricing || !note || isPublishing}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isPublishing ? '⏳ Publishing...' : '🚀 Launch & Start Earning'}
                </span>
              </button>
            </div>
          </div>

          {/* My APIs Section */}
          <div className="card group">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-accent-blue mb-2">Your API Empire</h2>
                <p className="text-text-secondary">Track your money-making machines</p>
              </div>
              <div className="bg-gradient-primary text-background-dark px-4 py-2 rounded-full text-sm font-bold shadow-glow">
                {apis.length} Active API{apis.length !== 1 ? 's' : ''}
              </div>
            </div>

            {apis.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-3xl">📡</span>
                </div>
                <h3 className="text-2xl font-bold text-accent-blue mb-3">No APIs Published Yet</h3>
                <p className="text-text-secondary mb-8 text-lg">
                  Launch your first money-making API and watch the revenue flow in
                </p>
                <Link href="/create" className="btn btn-outline text-lg px-8 py-3">
                  Create Your First API
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {apis.map(api => (
                  <div key={api.id} className="bg-background-elevated border border-divider rounded-xl p-6 hover:border-primary-gold/30 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-primary-gold">
                            {api.name}
                          </h3>
                          <span className="bg-gradient-primary text-background-dark px-3 py-1 rounded-full text-sm font-bold">
                            Live
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-text-secondary">
                          <span className="flex items-center gap-2">
                            <span className="text-primary-gold">💰</span>
                            {api.pricing}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="text-accent-blue">📊</span>
                            {api.status}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="text-primary-gold">🏷️</span>
                            v{api.version}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <button className="text-primary-gold hover:text-primary-gold-light text-sm font-semibold transition-colors">
                            View Analytics
                          </button>
                          <button className="text-accent-blue hover:text-accent-blue-light text-sm font-semibold transition-colors">
                            Edit API
                          </button>
                          <button className="text-error hover:text-error/80 text-sm font-semibold transition-colors">
                            Unpublish
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-text-muted mb-2">API Endpoint</div>
                        <code className="text-sm text-accent-blue bg-background-dark px-3 py-2 rounded-lg border border-divider font-mono">
                          POST /v1/data/{api.id}/query
                        </code>
                        <div className="mt-2 text-xs text-text-muted">
                          Last updated: {new Date().toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">👥</span>
            </div>
            <h4 className="text-xl font-bold text-primary-gold mb-3">Human Approval</h4>
            <p className="text-text-secondary leading-relaxed">
              Our expert team validates every API to ensure maximum quality and profitability
            </p>
          </div>

          <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">💰</span>
            </div>
            <h4 className="text-xl font-bold text-accent-blue mb-3">Flexible Pricing</h4>
            <p className="text-text-secondary leading-relaxed">
              Set your own prices and watch the money roll in with every API call
            </p>
          </div>

          <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">📊</span>
            </div>
            <h4 className="text-xl font-bold text-primary-gold mb-3">Real-Time Analytics</h4>
            <p className="text-text-secondary leading-relaxed">
              Track every dollar earned with detailed analytics and performance insights
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
