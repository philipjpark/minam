// OpenAI Service for model comparison and API generation
export interface OpenAIModel {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  costPer1kTokens: number;
  capabilities: string[];
}

export interface ModelAnalysis {
  model: OpenAIModel;
  score: number;
  reasoning: string;
  strengths: string[];
  weaknesses: string[];
  recommended: boolean;
  suggestedApiStructure?: any;
}

export interface DirectoryAnalysis {
  path: string;
  fileCount: number;
  fileTypes: string[];
  totalSize: string;
  structure: any;
  dataPatterns: string[];
  suggestedApiStructure: any;
  bestModel: OpenAIModel;
  modelReasoning: string;
}

class OpenAIService {
  private apiKey: string;
  private baseURL: string = 'https://api.openai.com/v1';

  constructor() {
    // Try to get API key from different sources
    this.apiKey = process.env.OPENAI_API_KEY || 
                  process.env.NEXT_PUBLIC_OPENAI_API_KEY || 
                  '';
    
    if (!this.apiKey) {
      console.error('OPENAI_API_KEY environment variable is not set');
      console.error('Please set your OpenAI API key in .env.local file');
    }
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  // Available OpenAI models for comparison
  getAvailableModels(): OpenAIModel[] {
    return [
      {
        id: 'gpt-5',
        name: 'ChatGPT-5',
        description: 'Latest and most advanced model with superior reasoning and analysis capabilities',
        maxTokens: 200000,
        costPer1kTokens: 0.01,
        capabilities: ['advanced-reasoning', 'complex-data-analysis', 'code-generation', 'natural-language', 'multi-modal', 'real-time-optimization']
      },
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: 'Most capable model for complex reasoning and analysis',
        maxTokens: 128000,
        costPer1kTokens: 0.005,
        capabilities: ['complex-reasoning', 'data-analysis', 'code-generation', 'natural-language']
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        description: 'Faster and cheaper than GPT-4o, good for most tasks',
        maxTokens: 128000,
        costPer1kTokens: 0.00015,
        capabilities: ['data-analysis', 'code-generation', 'natural-language', 'fast-processing']
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Fast and efficient for simple to moderate tasks',
        maxTokens: 16385,
        costPer1kTokens: 0.0005,
        capabilities: ['natural-language', 'basic-analysis', 'fast-processing']
      }
    ];
  }

  // Analyze directory structure and data patterns
  async analyzeDirectory(directoryData: any): Promise<DirectoryAnalysis> {
    // Check if API key is available
    if (!this.apiKey) {
      console.warn('OpenAI API key not configured, returning mock analysis');
      return this.getMockAnalysis(directoryData);
    }

    const models = this.getAvailableModels();
    
    // Test each model with the directory data
    const modelAnalyses = await Promise.all(
      models.map(model => this.analyzeWithModel(model, directoryData))
    );

    // Find the best model based on analysis scores
    const bestModelAnalysis = modelAnalyses.reduce((best, current) => 
      current.score > best.score ? current : best
    );

    return {
      path: directoryData.path,
      fileCount: directoryData.fileCount,
      fileTypes: directoryData.fileTypes,
      totalSize: directoryData.totalSize,
      structure: directoryData.structure,
      dataPatterns: directoryData.dataPatterns,
      suggestedApiStructure: bestModelAnalysis.suggestedApiStructure,
      bestModel: bestModelAnalysis.model,
      modelReasoning: bestModelAnalysis.reasoning
    };
  }

  // Mock analysis for when API key is not available
  private getMockAnalysis(directoryData: any): DirectoryAnalysis {
    const mockModel = this.getAvailableModels()[0]; // Use first model as default
    
    return {
      path: directoryData.path,
      fileCount: directoryData.fileCount,
      fileTypes: directoryData.fileTypes,
      totalSize: directoryData.totalSize,
      structure: directoryData.structure,
      dataPatterns: directoryData.dataPatterns,
      suggestedApiStructure: {
        endpoints: [
          {
            path: '/data',
            method: 'GET',
            description: 'Retrieve processed data',
            parameters: [
              { name: 'format', type: 'string', required: false, default: 'json' },
              { name: 'limit', type: 'number', required: false, default: 100 }
            ]
          }
        ],
        authentication: { type: 'api_key', required: true },
        rateLimits: { requests_per_minute: 100, requests_per_hour: 1000 }
      },
      bestModel: mockModel,
      modelReasoning: 'Mock analysis - OpenAI API key not configured. Please set OPENAI_API_KEY in your .env.local file to enable AI-powered analysis.'
    };
  }

  // Analyze data with a specific model
  private async analyzeWithModel(model: OpenAIModel, directoryData: any): Promise<ModelAnalysis> {
    try {
      // Check if API key is available
      if (!this.apiKey) {
        throw new Error('OpenAI API key is not configured');
      }
      
      const prompt = this.createAnalysisPrompt(directoryData);
      
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: model.id,
          messages: [
            {
              role: 'system',
              content: `You are an expert API architect and data analyst. Analyze the provided directory structure and data to determine the best API design and explain why this model is suitable for this specific dataset.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.3
        })
      });

      const result = await response.json();
      
      // Check if the API call was successful
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }
      
      // Check if the response has the expected structure
      if (!result.choices || !result.choices[0] || !result.choices[0].message) {
        throw new Error('Invalid response structure from OpenAI API');
      }
      
      const analysis = this.parseModelResponse(result.choices[0].message.content, model);
      
      return analysis;
    } catch (error) {
      console.error(`Error analyzing with ${model.name}:`, error);
      return {
        model,
        score: 0,
        reasoning: `Error analyzing with ${model.name}: ${error}`,
        strengths: [],
        weaknesses: ['API Error'],
        recommended: false,
        suggestedApiStructure: null
      };
    }
  }

  // Create analysis prompt for the model
  private createAnalysisPrompt(directoryData: any): string {
    return `
Analyze this directory structure and data to design the optimal API:

Directory Path: ${directoryData.path}
File Count: ${directoryData.fileCount}
File Types: ${directoryData.fileTypes.join(', ')}
Total Size: ${directoryData.totalSize}

Directory Structure:
${JSON.stringify(directoryData.structure, null, 2)}

Data Patterns Found:
${directoryData.dataPatterns.join(', ')}

Please provide:
1. A score from 1-10 for how well this model handles this type of data
2. Reasoning for why this model is suitable/unsuitable
3. Strengths of this model for this dataset
4. Weaknesses of this model for this dataset
5. Suggested API structure with endpoints, parameters, and response schemas
6. Whether this model is recommended for this dataset

Format your response as JSON with these fields:
{
  "score": number,
  "reasoning": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "suggestedApiStructure": {
    "endpoints": [...],
    "authentication": {...},
    "rateLimits": {...}
  },
  "recommended": boolean
}
    `;
  }

  // Parse model response into structured format
  private parseModelResponse(response: string, model: OpenAIModel): ModelAnalysis {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        model,
        score: parsed.score || 0,
        reasoning: parsed.reasoning || 'No reasoning provided',
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || [],
        recommended: parsed.recommended || false,
        suggestedApiStructure: parsed.suggestedApiStructure || null
      };
    } catch (error) {
      console.error('Error parsing model response:', error);
      return {
        model,
        score: 0,
        reasoning: `Error parsing response: ${error}`,
        strengths: [],
        weaknesses: ['Response parsing error'],
        recommended: false,
        suggestedApiStructure: null
      };
    }
  }

  // Mock API specification for when API key is not available
  private getMockApiSpecification(analysis: DirectoryAnalysis): any {
    return {
      openapi: '3.0.0',
      info: {
        title: `API for ${analysis.path}`,
        version: '1.0.0',
        description: 'Mock API specification - OpenAI API key not configured'
      },
      servers: [
        { url: 'https://api.minam.com/v1', description: 'Production server' }
      ],
      paths: {
        '/data': {
          get: {
            summary: 'Retrieve processed data',
            parameters: [
              { name: 'format', in: 'query', schema: { type: 'string', default: 'json' } },
              { name: 'limit', in: 'query', schema: { type: 'integer', default: 100 } }
            ],
            responses: {
              '200': {
                description: 'Successful response',
                content: {
                  'application/json': {
                    schema: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      },
      components: {
        securitySchemes: {
          apiKey: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-Key'
          }
        }
      },
      security: [{ apiKey: [] }]
    };
  }

  // Generate API specification using the best model
  async generateApiSpecification(analysis: DirectoryAnalysis): Promise<any> {
    try {
      // Check if API key is available
      if (!this.apiKey) {
        console.warn('OpenAI API key not configured, returning mock API specification');
        return this.getMockApiSpecification(analysis);
      }
      
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: analysis.bestModel.id,
          messages: [
            {
              role: 'system',
              content: `You are an expert API architect. Create a complete API specification based on the directory analysis. Include OpenAPI 3.0 specification, authentication, rate limiting, pricing tiers, and deployment configuration.`
            },
            {
              role: 'user',
              content: `Create a complete API specification for this directory analysis:

Path: ${analysis.path}
File Types: ${analysis.fileTypes.join(', ')}
Data Patterns: ${analysis.dataPatterns.join(', ')}
Suggested Structure: ${JSON.stringify(analysis.suggestedApiStructure, null, 2)}

Generate a complete API specification including:
- OpenAPI 3.0 spec
- Authentication methods
- Rate limiting
- Pricing tiers (Free, Premium, Enterprise)
- Error handling
- Documentation
- SDK examples

Return as JSON.`
            }
          ],
          max_tokens: 6000,
          temperature: 0.2
        })
      });

      const result = await response.json();
      
      // Check if the API call was successful
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }
      
      // Check if the response has the expected structure
      if (!result.choices || !result.choices[0] || !result.choices[0].message) {
        throw new Error('Invalid response structure from OpenAI API');
      }
      
      return JSON.parse(result.choices[0].message.content);
    } catch (error) {
      console.error('Error generating API specification:', error);
      throw error;
    }
  }

  // Test API endpoint with sample data
  async testApiEndpoint(endpoint: string, sampleData: any): Promise<any> {
    try {
      // Check if API key is available
      if (!this.apiKey) {
        throw new Error('OpenAI API key is not configured');
      }
      
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are an API testing expert. Generate realistic test responses for API endpoints.'
            },
            {
              role: 'user',
              content: `Generate a test response for this API endpoint: ${endpoint}

Sample data: ${JSON.stringify(sampleData, null, 2)}

Return a realistic JSON response that would be returned by this endpoint.`
            }
          ],
          max_tokens: 2000,
          temperature: 0.1
        })
      });

      const result = await response.json();
      
      // Check if the API call was successful
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }
      
      // Check if the response has the expected structure
      if (!result.choices || !result.choices[0] || !result.choices[0].message) {
        throw new Error('Invalid response structure from OpenAI API');
      }
      
      return JSON.parse(result.choices[0].message.content);
    } catch (error) {
      console.error('Error testing API endpoint:', error);
      throw error;
    }
  }
}

export default new OpenAIService();
