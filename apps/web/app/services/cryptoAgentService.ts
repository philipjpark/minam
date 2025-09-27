// Using built-in fetch instead of axios to avoid dependency issues

// Core agent types for crypto trading API generation
export interface CryptoAgent {
  id: string;
  name: string;
  type: 'data_validator' | 'model_profiler' | 'api_architect' | 'security_auditor' | 'deployment_engineer' | 'orchestrator';
  status: 'idle' | 'running' | 'completed' | 'failed';
  description: string;
  confidence: number;
  lastUpdate: string;
  performance: {
    accuracy: number;
    speed: number;
    efficiency: number;
  };
  config: {
    model: string;
    temperature: number;
    maxTokens: number;
  };
  crypto_specialization?: {
    blockchain: string[];
    trading_pairs: string[];
    analysis_types: string[];
  };
}

export interface CryptoDataset {
  id: string;
  name: string;
  type: 'historical_prices' | 'on_chain_metrics' | 'sentiment_data' | 'order_book';
  symbols: string[];
  timeframe: string;
  file: File | null;
  size: number;
  uploaded_at: string;
  validation_status: 'pending' | 'valid' | 'invalid';
  data_quality_score: number;
  crypto_metadata?: {
    blockchain: string;
    exchange: string;
    data_freshness: string;
    price_range: { min: number; max: number };
    volume_range: { min: number; max: number };
  };
}

export interface APISpecification {
  id: string;
  name: string;
  version: string;
  description: string;
  base_url: string;
  endpoints: APIEndpoint[];
  authentication: {
    type: 'api_key' | 'oauth2' | 'jwt';
    required: boolean;
  };
  rate_limits: {
    requests_per_minute: number;
    requests_per_hour: number;
    requests_per_day: number;
  };
  pricing: {
    free_tier: {
      requests_per_month: number;
      features: string[];
    };
    paid_tiers: {
      name: string;
      price_per_month: number;
      requests_per_month: number;
      features: string[];
    }[];
  };
  crypto_specific: {
    real_time_capable: boolean;
    blockchain_support: string[];
    trading_pairs: string[];
    data_freshness_guarantee: string;
    latency_guarantee_ms: number;
  };
  documentation: {
    openapi_spec: string;
    examples: string[];
    sdk_languages: string[];
  };
  deployment: {
    status: 'development' | 'staging' | 'production';
    url: string;
    health_check: string;
    monitoring: {
      uptime: number;
      response_time_avg: number;
      error_rate: number;
    };
  };
}

export interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  parameters: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  responses: {
    status_code: number;
    description: string;
    schema: any;
  }[];
  crypto_context?: {
    real_time: boolean;
    blockchain_verification: boolean;
    trading_pair_required: boolean;
  };
}

export interface CryptoAgentMessage {
  agentId: string;
  messageType: 'start' | 'stop' | 'configure' | 'analyze' | 'generate' | 'audit' | 'deploy';
  data?: any;
  parameters?: Record<string, any>;
  crypto_context?: {
    blockchain: string;
    trading_pair?: string;
    timeframe?: string;
    data_freshness_required: boolean;
  };
}

export interface CryptoAgentResponse {
  agentId: string;
  responseType: string;
  data: any;
  confidence: number;
  timestamp: string;
  status: 'success' | 'error' | 'processing';
  crypto_metrics?: {
    data_accuracy: number;
    latency_ms: number;
    blockchain_verification: boolean;
    real_time_capable: boolean;
  };
}

class CryptoAgentService {
  private baseURL: string;
  private apiKey: string | null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    this.apiKey = typeof window !== 'undefined' ? localStorage.getItem('minam_api_key') : null;
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  private async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Agent management
  async getAgents(): Promise<CryptoAgent[]> {
    try {
      return await this.makeRequest(`${this.baseURL}/api/crypto-agents`);
    } catch (error) {
      console.error('Error fetching crypto agents:', error);
      return [];
    }
  }

  async startAgent(agentId: string, parameters?: Record<string, any>): Promise<CryptoAgentResponse> {
    try {
      return await this.makeRequest(`${this.baseURL}/api/crypto-agents/${agentId}/start`, {
        method: 'POST',
        body: JSON.stringify({ parameters }),
      });
    } catch (error) {
      console.error(`Error starting agent ${agentId}:`, error);
      throw error;
    }
  }

  async stopAgent(agentId: string): Promise<CryptoAgentResponse> {
    try {
      return await this.makeRequest(`${this.baseURL}/api/crypto-agents/${agentId}/stop`, {
        method: 'POST',
      });
    } catch (error) {
      console.error(`Error stopping agent ${agentId}:`, error);
      throw error;
    }
  }

  async configureAgent(agentId: string, config: Partial<CryptoAgent>): Promise<CryptoAgentResponse> {
    try {
      return await this.makeRequest(`${this.baseURL}/api/crypto-agents/${agentId}/configure`, {
        method: 'PUT',
        body: JSON.stringify(config),
      });
    } catch (error) {
      console.error(`Error configuring agent ${agentId}:`, error);
      throw error;
    }
  }

  // Specific agent actions
  async dataValidate(dataset: CryptoDataset): Promise<CryptoAgentResponse> {
    try {
      return await this.makeRequest(`${this.baseURL}/api/crypto-agents/data-validator/validate`, {
        method: 'POST',
        body: JSON.stringify(dataset),
      });
    } catch (error) {
      console.error('Error validating data:', error);
      throw error;
    }
  }

  async modelProfile(datasetAnalysis: any, userRequirements: any): Promise<CryptoAgentResponse> {
    try {
      return await this.makeRequest(`${this.baseURL}/api/crypto-agents/model-profiler/profile`, {
        method: 'POST',
        body: JSON.stringify({ datasetAnalysis, userRequirements }),
      });
    } catch (error) {
      console.error('Error profiling model:', error);
      throw error;
    }
  }

  async apiArchitect(apiProposalRequest: any): Promise<CryptoAgentResponse> {
    try {
      return await this.makeRequest(`${this.baseURL}/api/crypto-agents/api-architect/design`, {
        method: 'POST',
        body: JSON.stringify(apiProposalRequest),
      });
    } catch (error) {
      console.error('Error designing API:', error);
      throw error;
    }
  }

  async securityAudit(auditRequest: any): Promise<CryptoAgentResponse> {
    try {
      return await this.makeRequest(`${this.baseURL}/api/crypto-agents/security-auditor/audit`, {
        method: 'POST',
        body: JSON.stringify(auditRequest),
      });
    } catch (error) {
      console.error('Error auditing security:', error);
      throw error;
    }
  }

  async deploymentEngineer(deploymentRequest: any): Promise<CryptoAgentResponse> {
    try {
      return await this.makeRequest(`${this.baseURL}/api/crypto-agents/deployment-engineer/deploy`, {
        method: 'POST',
        body: JSON.stringify(deploymentRequest),
      });
    } catch (error) {
      console.error('Error deploying API:', error);
      throw error;
    }
  }

  async orchestrate(agentResults: CryptoAgentResponse[]): Promise<CryptoAgentResponse> {
    try {
      return await this.makeRequest(`${this.baseURL}/api/crypto-agents/orchestrator/coordinate`, {
        method: 'POST',
        body: JSON.stringify({ agentResults }),
      });
    } catch (error) {
      console.error('Error orchestrating agents:', error);
      throw error;
    }
  }

  // API management
  async getAPIs(): Promise<APISpecification[]> {
    try {
      return await this.makeRequest(`${this.baseURL}/api/apis`);
    } catch (error) {
      console.error('Error fetching APIs:', error);
      return [];
    }
  }

  async createAPI(apiSpec: APISpecification): Promise<APISpecification> {
    try {
      return await this.makeRequest(`${this.baseURL}/api/apis`, {
        method: 'POST',
        body: JSON.stringify(apiSpec),
      });
    } catch (error) {
      console.error('Error creating API:', error);
      throw error;
    }
  }

  async updateAPI(apiId: string, apiSpec: Partial<APISpecification>): Promise<APISpecification> {
    try {
      return await this.makeRequest(`${this.baseURL}/api/apis/${apiId}`, {
        method: 'PUT',
        body: JSON.stringify(apiSpec),
      });
    } catch (error) {
      console.error('Error updating API:', error);
      throw error;
    }
  }

  async deleteAPI(apiId: string): Promise<void> {
    try {
      await this.makeRequest(`${this.baseURL}/api/apis/${apiId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting API:', error);
      throw error;
    }
  }

  // Authentication
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    if (typeof window !== 'undefined') {
      localStorage.setItem('minam_api_key', apiKey);
    }
  }

  removeApiKey() {
    this.apiKey = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('minam_api_key');
    }
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  // Utility methods
  async healthCheck(): Promise<boolean> {
    try {
      await this.makeRequest(`${this.baseURL}/health`);
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Crypto-specific methods
  async getSupportedBlockchains(): Promise<string[]> {
    try {
      return await this.makeRequest(`${this.baseURL}/api/crypto/blockchains`);
    } catch (error) {
      console.error('Error fetching supported blockchains:', error);
      return ['ethereum', 'bitcoin', 'solana', 'polygon'];
    }
  }

  async getTradingPairs(blockchain: string): Promise<string[]> {
    try {
      return await this.makeRequest(`${this.baseURL}/api/crypto/trading-pairs?blockchain=${blockchain}`);
    } catch (error) {
      console.error('Error fetching trading pairs:', error);
      return ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'];
    }
  }

  async getRealTimeData(tradingPair: string): Promise<any> {
    try {
      return await this.makeRequest(`${this.baseURL}/api/crypto/realtime?pair=${tradingPair}`);
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      return null;
    }
  }
}

export default new CryptoAgentService();
