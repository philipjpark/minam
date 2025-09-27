'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import CryptoDatasetUploader from '../components/crypto/CryptoDatasetUploader';
import RealTimeAPIDashboard from '../components/crypto/RealTimeAPIDashboard';
import CryptoAgentService, { CryptoDataset, APISpecification } from '../services/cryptoAgentService';

export default function Create() {
  const [showUploader, setShowUploader] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [generatedAPI, setGeneratedAPI] = useState<APISpecification | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<CryptoDataset | null>(null);

  const handleDatasetComplete = (dataset: CryptoDataset, requirements: any) => {
    // Generate API specification
    const apiSpec: APISpecification = {
      endpoints: [
        {
          path: '/price',
          method: 'GET',
          description: 'Get real-time crypto prices',
          parameters: [
            { name: 'symbol', type: 'string', required: true, description: 'Trading pair symbol (e.g., BTC/USD)' },
            { name: 'timeframe', type: 'string', required: false, description: 'Timeframe for price data' }
          ],
          response_schema: {},
          example_response: {
            symbol: 'BTC/USD',
            price: 45000.50,
            change_24h: 2.5,
            volume_24h: 1500000000,
            timestamp: new Date().toISOString()
          },
          crypto_specific: {
            data_freshness: '2.3s',
            blockchain_verified: true,
            real_time: true
          }
        },
        {
          path: '/sentiment',
          method: 'GET',
          description: 'Get market sentiment analysis',
          parameters: [
            { name: 'symbol', type: 'string', required: true, description: 'Trading pair symbol' },
            { name: 'source', type: 'string', required: false, description: 'Data source (twitter, reddit, news)' }
          ],
          response_schema: {},
          example_response: {
            symbol: 'BTC/USD',
            sentiment_score: 0.75,
            confidence: 0.89,
            sources: ['twitter', 'reddit', 'news'],
            timestamp: new Date().toISOString()
          },
          crypto_specific: {
            data_freshness: '5.2s',
            blockchain_verified: false,
            real_time: true
          }
        },
        {
          path: '/risk',
          method: 'GET',
          description: 'Get risk assessment for trading pair',
          parameters: [
            { name: 'symbol', type: 'string', required: true, description: 'Trading pair symbol' },
            { name: 'timeframe', type: 'string', required: false, description: 'Risk assessment timeframe' }
          ],
          response_schema: {},
          example_response: {
            symbol: 'BTC/USD',
            risk_score: 0.3,
            volatility: 0.15,
            liquidity_score: 0.95,
            recommendation: 'LOW_RISK',
            timestamp: new Date().toISOString()
          },
          crypto_specific: {
            data_freshness: '1.8s',
            blockchain_verified: true,
            real_time: true
          }
        }
      ],
      authentication: {
        type: 'api_key',
        requirements: ['API key required'],
        crypto_wallet_support: true
      },
      rate_limits: [
        {
          requests_per_minute: 1000,
          requests_per_hour: 10000,
          requests_per_day: 100000,
          burst_limit: 100
        }
      ],
      pricing: [
        {
          name: 'Starter',
          price_per_request: 0.001,
          monthly_limit: 1000,
          crypto_payment_supported: true,
          features: ['Real-time data', 'Basic analytics', 'Email support']
        },
        {
          name: 'Pro',
          price_per_request: 0.0005,
          monthly_limit: 10000,
          crypto_payment_supported: true,
          features: ['Real-time data', 'WebSocket streaming', 'Advanced analytics', 'Priority support']
        },
        {
          name: 'Enterprise',
          price_per_request: 0.0001,
          monthly_limit: 100000,
          crypto_payment_supported: true,
          features: ['Real-time data', 'WebSocket streaming', 'Advanced analytics', 'Dedicated support', 'Custom endpoints']
        }
      ],
      documentation: 'https://docs.minam.com/api/crypto-trading',
      version: '1.0.0',
      status: 'deployed'
    };

    setGeneratedAPI(apiSpec);
    setSelectedDataset(dataset);
    setShowUploader(false);
    setShowDashboard(true);
  };

  const handleCloseUploader = () => {
    setShowUploader(false);
  };

  const handleCloseDashboard = () => {
    setShowDashboard(false);
  };

  if (showUploader) {
    return (
      <CryptoDatasetUploader
        onComplete={handleDatasetComplete}
        onClose={handleCloseUploader}
      />
    );
  }

  if (showDashboard && generatedAPI && selectedDataset) {
    return (
      <RealTimeAPIDashboard
        apiSpec={generatedAPI}
        dataset={selectedDataset}
        onClose={handleCloseDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl shadow-glow mb-6">
            <span className="text-3xl">⚡</span>
          </div>
          <h1 className="text-5xl font-bold text-glow mb-6">
            Monetize Your 
            <span className="text-primary-gold"> Knowledge</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Transform your data, insights, and expertise into tiered APIs that pay you every time someone accesses your knowledge
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Configuration Panel */}
          <div className="space-y-8">
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-6">🚀 AI-Powered API Generation</h2>
              
              <div className="space-y-6">
                <div className="bg-gradient-primary/10 border border-primary-gold/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-primary-gold mb-2">6 Role-Based AI Agents</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-white">Data Validator</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-white">Model Profiler</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      <span className="text-white">API Architect</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-white">Security Auditor</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span className="text-white">Deployment Engineer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                      <span className="text-white">Orchestrator</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Supported Data Types</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['Price Data', 'On-Chain Metrics', 'Market Sentiment', 'DeFi Protocols', 'NFT Metrics', 'Custom Data'].map((type) => (
                      <div key={type} className="flex items-center gap-2 p-2 bg-background-elevated rounded-lg">
                        <span className="text-primary-gold">✓</span>
                        <span className="text-white text-sm">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Blockchain Support</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Ethereum', 'Bitcoin', 'Solana', 'Polygon', 'Arbitrum', 'Optimism'].map((chain) => (
                      <span key={chain} className="px-3 py-1 bg-accent-blue/20 text-accent-blue rounded-full text-sm">
                        {chain}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-6">⚡ Real-Time Features</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔄</span>
                  <div>
                    <h3 className="text-white font-semibold">Live Data Streaming</h3>
                    <p className="text-text-secondary text-sm">WebSocket connections for real-time updates</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⛓️</span>
                  <div>
                    <h3 className="text-white font-semibold">Blockchain Verified</h3>
                    <p className="text-text-secondary text-sm">Data integrity verified on-chain</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <h3 className="text-white font-semibold">Ultra-Low Latency</h3>
                    <p className="text-text-secondary text-sm">Sub-50ms response times for trading</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔒</span>
          <div>
                    <h3 className="text-white font-semibold">Enterprise Security</h3>
                    <p className="text-text-secondary text-sm">Bank-grade encryption and compliance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-8">
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-6">API Preview</h2>
              
              <div className="space-y-4">
                <div className="bg-background-elevated rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-primary-gold mb-2">Endpoints</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <code className="text-accent-blue">GET /api/v1/price</code>
                      <span className="text-text-muted">Real-time prices</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-accent-blue">GET /api/v1/sentiment</code>
                      <span className="text-text-muted">Market sentiment</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-accent-blue">GET /api/v1/risk</code>
                      <span className="text-text-muted">Risk assessment</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-accent-blue">WS /api/v1/stream</code>
                      <span className="text-text-muted">Live data feed</span>
                    </div>
                  </div>
                </div>

                <div className="bg-background-elevated rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-primary-gold mb-2">Performance</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-text-muted">Response Time:</span>
                      <span className="text-white ml-2">12ms</span>
                    </div>
                    <div>
                      <span className="text-text-muted">Uptime:</span>
                      <span className="text-white ml-2">99.9%</span>
                    </div>
                    <div>
                      <span className="text-text-muted">Rate Limit:</span>
                      <span className="text-white ml-2">1000/min</span>
          </div>
          <div>
                      <span className="text-text-muted">Data Freshness:</span>
                      <span className="text-white ml-2">2.3s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-6">Pricing Tiers</h2>
              
              <div className="space-y-4">
                <div className="border border-primary-gold/30 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white">Starter</h3>
                    <span className="text-2xl font-bold text-primary-gold">$29/mo</span>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">Perfect for individual traders</p>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• 1,000 requests/month</li>
                    <li>• Real-time data</li>
                    <li>• Basic analytics</li>
                    <li>• Crypto payments</li>
                  </ul>
                </div>

                <div className="border border-accent-blue/30 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white">Pro</h3>
                    <span className="text-2xl font-bold text-accent-blue">$99/mo</span>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">For serious traders and small teams</p>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• 10,000 requests/month</li>
                    <li>• WebSocket streaming</li>
                    <li>• Advanced analytics</li>
                    <li>• Priority support</li>
                    <li>• Blockchain verification</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => setShowUploader(true)}
                className="btn btn-primary w-full text-lg py-4"
              >
                🚀 Start Creating Your API
              </button>
              <button className="btn btn-outline w-full text-lg py-4">
                📊 View Sample APIs
              </button>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
            <p className="text-text-secondary">
              Sub-50ms response times for real-time trading decisions
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Secure & Reliable</h3>
            <p className="text-text-secondary">
              Enterprise-grade security with 99.9% uptime guarantee
            </p>
      </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Profitable</h3>
            <p className="text-text-secondary">
              Start earning from your crypto data immediately
            </p>
          </div>
        </div>
    </main>
    </div>
  );
}