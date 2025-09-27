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
    this.apiKey = process.env.OPENAI_API_KEY || '';
    if (!this.apiKey) {
      console.error('OPENAI_API_KEY environment variable is not set');
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

  // Analyze data with a specific model
  private async analyzeWithModel(model: OpenAIModel, directoryData: any): Promise<ModelAnalysis> {
    try {
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

  // Generate API specification using the best model
  async generateApiSpecification(analysis: DirectoryAnalysis): Promise<any> {
    try {
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
      return JSON.parse(result.choices[0].message.content);
    } catch (error) {
      console.error('Error generating API specification:', error);
      throw error;
    }
  }

  // Test API endpoint with sample data
  async testApiEndpoint(endpoint: string, sampleData: any): Promise<any> {
    try {
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
      return JSON.parse(result.choices[0].message.content);
    } catch (error) {
      console.error('Error testing API endpoint:', error);
      throw error;
    }
  }
}

export default new OpenAIService();
