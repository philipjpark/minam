'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SampleAPIDisplayProps {
  onClose: () => void;
}

const SampleAPIDisplay: React.FC<SampleAPIDisplayProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'endpoints' | 'pricing' | 'docs' | 'processing'>('overview');
  const [selectedEndpoint, setSelectedEndpoint] = useState(0);

  const baseUrl = "https://api.minam.com/v2/crypto-intel";
  
  const sampleAPI = {
    name: "Crypto Market Intelligence API",
    version: "2.1.0",
    description: "Real-time cryptocurrency market data with advanced analytics and sentiment analysis",
    baseUrl: baseUrl,
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
          request: `GET ${baseUrl}/market-data?symbols=BTC,ETH&interval=1h&limit=24`,
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
          request: `GET ${baseUrl}/sentiment-analysis?symbol=BTC&sources=twitter,reddit`,
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
          request: `GET ${baseUrl}/portfolio-optimization?holdings={"BTC":0.6,"ETH":0.4}&risk_tolerance=7`,
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
    },
    dataProcessing: {
      dataType: "Unstructured",
      originalData: {
        sources: [
          "Raw Twitter API feeds (JSON)",
          "Reddit posts and comments (text)",
          "News articles (HTML/XML)",
          "Trading logs (CSV)",
          "Social media mentions (JSON streams)"
        ],
        sampleRawData: {
          twitter: {
            "id": "1745234567890",
            "text": "BTC just hit $43K! 🚀 This is just the beginning. #Bitcoin #Crypto",
            "created_at": "2024-01-15T10:30:00Z",
            "user": {
              "screen_name": "crypto_trader_99",
              "followers_count": 15420
            },
            "entities": {
              "hashtags": [{"text": "Bitcoin"}, {"text": "Crypto"}],
              "symbols": [{"text": "BTC"}]
            }
          },
          reddit: {
            "title": "Why I'm bullish on ETH after the recent dip",
            "selftext": "Been following ETH for 3 years now. The recent correction is just noise...",
            "score": 127,
            "num_comments": 89,
            "created_utc": 1705312200,
            "subreddit": "ethereum"
          },
          news: {
            "headline": "Bitcoin Surges Past $43,000 as Institutional Adoption Accelerates",
            "content": "Bitcoin reached a new milestone today as institutional investors...",
            "source": "CryptoNews",
            "published_at": "2024-01-15T10:00:00Z",
            "sentiment": "positive"
          }
        }
      },
      modelSelection: {
        selectedModel: "ChatGPT-5",
        confidence: 0.94,
        reasoning: [
          "Large-scale unstructured data from multiple sources requires advanced reasoning capabilities",
          "Real-time sentiment analysis needs sophisticated natural language understanding",
          "Complex pattern recognition across different data formats (JSON, text, HTML)",
          "High-volume data processing with 99.9% accuracy requirements",
          "Multi-modal data handling (text, structured data, metadata)"
        ],
        modelComparison: [
          {
            model: "ChatGPT-5",
            score: 9.4,
            reasoning: "Optimal for complex, multi-source unstructured data with advanced reasoning"
          },
          {
            model: "GPT-4o",
            score: 8.2,
            reasoning: "Good for structured data but struggles with real-time unstructured processing"
          },
          {
            model: "GPT-4o Mini",
            score: 6.8,
            reasoning: "Cost-effective but limited context window for large datasets"
          },
          {
            model: "GPT-3.5 Turbo",
            score: 5.1,
            reasoning: "Too basic for complex sentiment analysis and pattern recognition"
          }
        ]
      },
      transformationProcess: {
        steps: [
          {
            step: 1,
            name: "Data Ingestion",
            description: "Collect raw data from multiple sources",
            duration: "2.3s",
            status: "completed"
          },
          {
            step: 2,
            name: "Data Cleaning",
            description: "Remove noise, normalize formats, handle missing values",
            duration: "4.1s",
            status: "completed"
          },
          {
            step: 3,
            name: "Feature Extraction",
            description: "Extract sentiment, entities, and market indicators",
            duration: "8.7s",
            status: "completed"
          },
          {
            step: 4,
            name: "Model Processing",
            description: "Apply ChatGPT-5 for analysis and pattern recognition",
            duration: "12.4s",
            status: "completed"
          },
          {
            step: 5,
            name: "API Structuring",
            description: "Format data into clean, consistent API responses",
            duration: "1.2s",
            status: "completed"
          }
        ],
        totalProcessingTime: "28.7s",
        dataReduction: "87%",
        accuracyImprovement: "+23%"
      }
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'endpoints', label: 'Endpoints', icon: '🔗' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'processing', label: 'Data Processing', icon: '⚙️' },
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

          {activeTab === 'processing' && (
            <div className="space-y-6">
              {/* Data Type Badge */}
              <div className="flex justify-center mb-6">
                <div className={`px-6 py-3 rounded-full text-lg font-bold ${
                  sampleAPI.dataProcessing.dataType === 'Unstructured' 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                    : 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                }`}>
                  {sampleAPI.dataProcessing.dataType} Data
                </div>
              </div>

              {/* Original Data Sources */}
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">📥 Original Data Sources</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {sampleAPI.dataProcessing.originalData.sources.map((source, index) => (
                      <div key={index} className="bg-background-dark p-4 rounded-lg border border-divider">
                        <div className="flex items-center gap-3">
                          <span className="text-primary-gold text-xl">
                            {source.includes('Twitter') ? '🐦' : 
                             source.includes('Reddit') ? '🔴' : 
                             source.includes('News') ? '📰' : 
                             source.includes('Trading') ? '📈' : '💬'}
                          </span>
                          <span className="text-white font-medium">{source}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Raw Data Preview */}
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">🔍 Raw Data Preview</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(sampleAPI.dataProcessing.originalData.sampleRawData).map(([source, data]) => (
                      <div key={source} className="bg-background-dark p-4 rounded-lg border border-divider">
                        <h4 className="text-lg font-semibold text-primary-gold mb-3 capitalize">{source}</h4>
                        <pre className="text-xs text-text-secondary overflow-x-auto">
                          <code>{JSON.stringify(data, null, 2)}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Model Selection */}
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">🧠 AI Model Selection</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-primary rounded-lg">
                    <div>
                      <h4 className="text-lg font-bold text-white">Selected Model: {sampleAPI.dataProcessing.modelSelection.selectedModel}</h4>
                      <p className="text-sm text-white opacity-90">Confidence: {Math.round(sampleAPI.dataProcessing.modelSelection.confidence * 100)}%</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">9.4/10</div>
                      <div className="text-sm text-white opacity-90">AI Score</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Why This Model?</h4>
                    <ul className="space-y-2">
                      {sampleAPI.dataProcessing.modelSelection.reasoning.map((reason, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-primary-gold text-sm mt-1">•</span>
                          <span className="text-text-secondary text-sm">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Model Comparison</h4>
                    <div className="space-y-3">
                      {sampleAPI.dataProcessing.modelSelection.modelComparison.map((model, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-background-dark rounded-lg border border-divider">
                          <div className="flex items-center gap-3">
                            <span className={`w-3 h-3 rounded-full ${
                              model.score >= 9 ? 'bg-green-500' : 
                              model.score >= 7 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></span>
                            <span className="text-white font-medium">{model.model}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-white">{model.score}/10</div>
                            <div className="text-xs text-text-muted">{model.reasoning}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transformation Process */}
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">⚡ Data Transformation Process</h3>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gradient-primary rounded-lg">
                      <div className="text-2xl font-bold text-white">{sampleAPI.dataProcessing.transformationProcess.totalProcessingTime}</div>
                      <div className="text-sm text-white opacity-90">Total Processing Time</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-secondary rounded-lg">
                      <div className="text-2xl font-bold text-white">{sampleAPI.dataProcessing.transformationProcess.dataReduction}</div>
                      <div className="text-sm text-white opacity-90">Data Size Reduction</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-primary rounded-lg">
                      <div className="text-2xl font-bold text-white">{sampleAPI.dataProcessing.transformationProcess.accuracyImprovement}</div>
                      <div className="text-sm text-white opacity-90">Accuracy Improvement</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {sampleAPI.dataProcessing.transformationProcess.steps.map((step, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-background-dark rounded-lg border border-divider">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary-gold rounded-full flex items-center justify-center text-black font-bold text-sm">
                            {step.step}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-lg font-semibold text-white">{step.name}</h4>
                          <p className="text-text-secondary text-sm">{step.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-primary-gold">{step.duration}</div>
                          <div className="text-xs text-green-400 capitalize">{step.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                        curl -X GET "{baseUrl}/market-data?symbols=BTC,ETH" \
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
