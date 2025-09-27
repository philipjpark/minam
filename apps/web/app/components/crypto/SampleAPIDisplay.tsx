'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SampleAPIDisplayProps {
  onClose: () => void;
}

const SampleAPIDisplay: React.FC<SampleAPIDisplayProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'endpoints' | 'pricing' | 'docs'>('overview');
  const [selectedEndpoint, setSelectedEndpoint] = useState(0);

  const sampleAPI = {
    name: "Crypto Market Intelligence API",
    version: "2.1.0",
    description: "Real-time cryptocurrency market data with advanced analytics and sentiment analysis",
    baseUrl: "https://api.minam.com/v2/crypto-intel",
    status: "Live",
    uptime: "99.9%",
    responseTime: "45ms",
    totalRequests: "2.3M+",
    revenue: "$47,500",
    endpoints: [
      {
        method: "GET",
        path: "/market-data",
        description: "Get real-time market data for all supported cryptocurrencies",
        parameters: [
          { name: "symbols", type: "string[]", required: true, description: "Array of cryptocurrency symbols" },
          { name: "interval", type: "string", required: false, description: "Data interval (1m, 5m, 1h, 1d)" },
          { name: "limit", type: "number", required: false, description: "Number of data points to return" }
        ],
        example: {
          request: `GET ${sampleAPI.baseUrl}/market-data?symbols=BTC,ETH&interval=1h&limit=24`,
          response: {
            "data": [
              {
                "symbol": "BTC",
                "price": 43250.50,
                "change_24h": 2.34,
                "volume": 2850000000,
                "market_cap": 847000000000,
                "timestamp": "2024-01-15T10:30:00Z"
              }
            ],
            "meta": {
              "total_symbols": 1,
              "interval": "1h",
              "last_updated": "2024-01-15T10:30:00Z"
            }
          }
        }
      },
      {
        method: "GET",
        path: "/sentiment-analysis",
        description: "Get sentiment analysis for specific cryptocurrencies",
        parameters: [
          { name: "symbol", type: "string", required: true, description: "Cryptocurrency symbol" },
          { name: "sources", type: "string[]", required: false, description: "Data sources (twitter, reddit, news)" }
        ],
        example: {
          request: `GET ${sampleAPI.baseUrl}/sentiment-analysis?symbol=BTC&sources=twitter,reddit`,
          response: {
            "symbol": "BTC",
            "sentiment_score": 0.73,
            "sentiment_label": "Bullish",
            "confidence": 0.89,
            "sources": {
              "twitter": { "score": 0.78, "mentions": 15420 },
              "reddit": { "score": 0.68, "mentions": 8920 }
            },
            "timestamp": "2024-01-15T10:30:00Z"
          }
        }
      },
      {
        method: "GET",
        path: "/portfolio-optimization",
        description: "Get AI-powered portfolio optimization recommendations",
        parameters: [
          { name: "holdings", type: "object", required: true, description: "Current portfolio holdings" },
          { name: "risk_tolerance", type: "number", required: false, description: "Risk tolerance (1-10)" }
        ],
        example: {
          request: `GET ${sampleAPI.baseUrl}/portfolio-optimization?holdings={"BTC":0.6,"ETH":0.4}&risk_tolerance=7`,
          response: {
            "current_allocation": { "BTC": 0.6, "ETH": 0.4 },
            "recommended_allocation": { "BTC": 0.45, "ETH": 0.35, "SOL": 0.20 },
            "expected_return": 0.12,
            "risk_score": 0.65,
            "rebalancing_actions": [
              { "action": "reduce", "symbol": "BTC", "amount": 0.15 },
              { "action": "reduce", "symbol": "ETH", "amount": 0.05 },
              { "action": "add", "symbol": "SOL", "amount": 0.20 }
            ],
            "confidence": 0.87
          }
        }
      }
    ],
    pricing: {
      free: {
        requests_per_month: 1000,
        features: ["Basic market data", "Standard endpoints", "Community support"],
        price: 0
      },
      premium: {
        requests_per_month: 10000,
        features: ["All endpoints", "Real-time data", "Priority support", "Advanced analytics"],
        price: 29.99
      },
      enterprise: {
        requests_per_month: 100000,
        features: ["Unlimited access", "Custom endpoints", "Dedicated support", "White-label options"],
        price: 99.99
      }
    },
    stats: {
      total_requests: "2.3M+",
      active_users: "1,247",
      uptime: "99.9%",
      avg_response_time: "45ms",
      revenue: "$47,500",
      rating: 4.9
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'endpoints', label: 'Endpoints', icon: '🔗' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'docs', label: 'Documentation', icon: '📚' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-dark rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-primary p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">{sampleAPI.name}</h2>
              <p className="text-lg opacity-90 mb-4">{sampleAPI.description}</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium">{sampleAPI.status}</span>
                </div>
                <div className="text-sm">
                  <span className="opacity-70">Uptime:</span> {sampleAPI.uptime}
                </div>
                <div className="text-sm">
                  <span className="opacity-70">Response:</span> {sampleAPI.responseTime}
                </div>
                <div className="text-sm">
                  <span className="opacity-70">Revenue:</span> {sampleAPI.revenue}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-divider">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary-gold border-b-2 border-primary-gold'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card text-center">
                  <div className="text-2xl font-bold text-primary-gold mb-1">{sampleAPI.stats.total_requests}</div>
                  <div className="text-sm text-text-secondary">Total Requests</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-accent-blue mb-1">{sampleAPI.stats.active_users}</div>
                  <div className="text-sm text-text-secondary">Active Users</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-primary-gold mb-1">{sampleAPI.stats.uptime}</div>
                  <div className="text-sm text-text-secondary">Uptime</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-accent-blue mb-1">{sampleAPI.stats.avg_response_time}</div>
                  <div className="text-sm text-text-secondary">Avg Response</div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">API Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Base URL:</span>
                    <code className="text-primary-gold">{sampleAPI.baseUrl}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Version:</span>
                    <span className="text-white">{sampleAPI.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Status:</span>
                    <span className="text-green-400 font-medium">{sampleAPI.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Rating:</span>
                    <span className="text-primary-gold">⭐ {sampleAPI.stats.rating}/5.0</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'endpoints' && (
            <div className="space-y-6">
              <div className="flex gap-4 mb-6">
                {sampleAPI.endpoints.map((endpoint, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedEndpoint(index)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedEndpoint === index
                        ? 'bg-primary-gold text-black'
                        : 'bg-card text-text-secondary hover:text-white'
                    }`}
                  >
                    {endpoint.method} {endpoint.path}
                  </button>
                ))}
              </div>

              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">
                  {sampleAPI.endpoints[selectedEndpoint].method} {sampleAPI.endpoints[selectedEndpoint].path}
                </h3>
                <p className="text-text-secondary mb-6">{sampleAPI.endpoints[selectedEndpoint].description}</p>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Parameters</h4>
                    <div className="space-y-2">
                      {sampleAPI.endpoints[selectedEndpoint].parameters.map((param, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-divider">
                          <div>
                            <span className="text-primary-gold font-medium">{param.name}</span>
                            <span className="text-text-muted ml-2">({param.type})</span>
                            {param.required && <span className="text-red-400 ml-2">*</span>}
                          </div>
                          <span className="text-text-secondary text-sm">{param.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Example</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-text-secondary mb-2">Request:</div>
                        <pre className="bg-black bg-opacity-50 p-4 rounded-lg text-sm overflow-x-auto">
                          <code className="text-accent-blue">{sampleAPI.endpoints[selectedEndpoint].example.request}</code>
                        </pre>
                      </div>
                      <div>
                        <div className="text-sm text-text-secondary mb-2">Response:</div>
                        <pre className="bg-black bg-opacity-50 p-4 rounded-lg text-sm overflow-x-auto">
                          <code className="text-primary-gold">{JSON.stringify(sampleAPI.endpoints[selectedEndpoint].example.response, null, 2)}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(sampleAPI.pricing).map(([tier, details]) => (
                  <div key={tier} className={`card text-center ${tier === 'premium' ? 'ring-2 ring-primary-gold' : ''}`}>
                    <div className="text-2xl font-bold text-white mb-2 capitalize">{tier}</div>
                    <div className="text-4xl font-bold text-primary-gold mb-4">
                      ${details.price}
                      {details.price > 0 && <span className="text-lg text-text-secondary">/month</span>}
                    </div>
                    <div className="text-sm text-text-secondary mb-6">
                      {details.requests_per_month.toLocaleString()} requests/month
                    </div>
                    <ul className="space-y-2 text-sm text-left">
                      {details.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-primary-gold mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full mt-6 py-3 rounded-lg font-medium transition-colors ${
                      tier === 'premium' 
                        ? 'bg-primary-gold text-black hover:bg-yellow-400' 
                        : 'bg-card text-white hover:bg-card-hover'
                    }`}>
                      {tier === 'free' ? 'Get Started' : 'Choose Plan'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">Quick Start</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">1. Get Your API Key</h4>
                    <p className="text-text-secondary">Sign up and get your free API key to start making requests.</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">2. Make Your First Request</h4>
                    <pre className="bg-black bg-opacity-50 p-4 rounded-lg text-sm">
                      <code className="text-accent-blue">
                        curl -X GET "{sampleAPI.baseUrl}/market-data?symbols=BTC,ETH" \
                        -H "Authorization: Bearer YOUR_API_KEY"
                      </code>
                    </pre>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">3. Integrate with Your App</h4>
                    <p className="text-text-secondary">Use our SDKs for JavaScript, Python, or any language with HTTP support.</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">SDK Examples</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">JavaScript</h4>
                    <pre className="bg-black bg-opacity-50 p-4 rounded-lg text-sm">
                      <code className="text-primary-gold">
{`import { MinamAPI } from '@minam/sdk';

const api = new MinamAPI('YOUR_API_KEY');
const data = await api.getMarketData(['BTC', 'ETH']);`}
                      </code>
                    </pre>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Python</h4>
                    <pre className="bg-black bg-opacity-50 p-4 rounded-lg text-sm">
                      <code className="text-accent-blue">
{`from minam import MinamAPI

api = MinamAPI('YOUR_API_KEY')
data = api.get_market_data(['BTC', 'ETH'])`}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-divider p-6 bg-card">
          <div className="flex justify-between items-center">
            <div className="text-sm text-text-secondary">
              Ready to create your own API? <span className="text-primary-gold font-medium">Start building now!</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="btn btn-outline px-6 py-2"
              >
                Close
              </button>
              <button className="btn btn-primary px-6 py-2">
                Create My API
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SampleAPIDisplay;
