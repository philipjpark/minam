// Model Toggle Agent - Automatically selects the best model for each dataset
export interface ModelPerformanceMetrics {
  modelId: string;
  accuracy: number;
  speed: number;
  cost: number;
  reliability: number;
  overallScore: number;
}

export interface DatasetCharacteristics {
  dataType: string;
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
  size: 'small' | 'medium' | 'large' | 'massive';
  patterns: string[];
  realTimeRequired: boolean;
  costSensitivity: 'low' | 'medium' | 'high';
}

export interface ModelRecommendation {
  recommendedModel: string;
  confidence: number;
  reasoning: string;
  alternativeModels: string[];
  performancePrediction: ModelPerformanceMetrics;
}

class ModelToggleAgent {
  private modelPerformanceHistory: Map<string, ModelPerformanceMetrics[]> = new Map();
  private datasetPatterns: Map<string, string> = new Map();

  // Analyze dataset characteristics to determine optimal model
  analyzeDataset(directoryData: any): DatasetCharacteristics {
    const fileCount = directoryData.fileCount;
    const fileTypes = directoryData.fileTypes;
    const totalSize = this.parseFileSize(directoryData.totalSize);
    const patterns = directoryData.dataPatterns;

    // Determine complexity based on file types and patterns
    let complexity: 'simple' | 'moderate' | 'complex' | 'enterprise' = 'simple';
    if (patterns.includes('Structured Data (CSV)') && fileTypes.length <= 2) {
      complexity = 'simple';
    } else if (patterns.includes('JSON Data') || patterns.includes('Configuration Files')) {
      complexity = 'moderate';
    } else if (patterns.includes('Log Files') || fileTypes.length > 3) {
      complexity = 'complex';
    } else if (patterns.includes('Mixed Data Types') || fileCount > 100) {
      complexity = 'enterprise';
    }

    // Determine size category
    let size: 'small' | 'medium' | 'large' | 'massive' = 'small';
    if (totalSize < 1024 * 1024) { // < 1MB
      size = 'small';
    } else if (totalSize < 100 * 1024 * 1024) { // < 100MB
      size = 'medium';
    } else if (totalSize < 1024 * 1024 * 1024) { // < 1GB
      size = 'large';
    } else {
      size = 'massive';
    }

    // Determine if real-time is required
    const realTimeRequired = patterns.includes('Real-time Data') || 
                           patterns.includes('Live Updates') ||
                           fileTypes.includes('stream');

    // Determine cost sensitivity based on data characteristics
    let costSensitivity: 'low' | 'medium' | 'high' = 'medium';
    if (complexity === 'enterprise' || size === 'massive') {
      costSensitivity = 'high';
    } else if (complexity === 'simple' && size === 'small') {
      costSensitivity = 'low';
    }

    return {
      dataType: fileTypes.join(','),
      complexity,
      size,
      patterns,
      realTimeRequired,
      costSensitivity
    };
  }

  // Select the best model based on dataset characteristics
  selectOptimalModel(characteristics: DatasetCharacteristics): ModelRecommendation {
    const models = [
      {
        id: 'gpt-5',
        name: 'ChatGPT-5',
        capabilities: ['advanced-reasoning', 'complex-data-analysis', 'real-time-optimization'],
        costPer1kTokens: 0.01,
        maxTokens: 200000,
        speed: 0.8,
        accuracy: 0.95
      },
      {
        id: 'codex',
        name: 'Codex',
        capabilities: ['code-generation', 'technical-analysis', 'data-structures'],
        costPer1kTokens: 0.008,
        maxTokens: 128000,
        speed: 0.85,
        accuracy: 0.90
      },
      {
        id: 'gpt-4-omega',
        name: 'GPT-4 Omega',
        capabilities: ['ultra-reasoning', 'enterprise-analysis', 'complex-problem-solving'],
        costPer1kTokens: 0.015,
        maxTokens: 256000,
        speed: 0.75,
        accuracy: 0.98
      }
    ];

    // Score each model based on characteristics
    const scoredModels = models.map(model => {
      let score = 0;
      let reasoning = '';

      // Complexity scoring
      if (characteristics.complexity === 'enterprise' && model.id === 'gpt-4-omega') {
        score += 40;
        reasoning += 'GPT-4 Omega excels at enterprise-level complex data analysis. ';
      } else if (characteristics.complexity === 'complex' && (model.id === 'gpt-5' || model.id === 'gpt-4-omega')) {
        score += 35;
        reasoning += `${model.name} handles complex data patterns well. `;
      } else if (characteristics.complexity === 'moderate' && model.id === 'codex') {
        score += 30;
        reasoning += 'Codex provides excellent technical analysis for moderate complexity. ';
      } else if (characteristics.complexity === 'simple' && model.id === 'gpt-5') {
        score += 25;
        reasoning += 'ChatGPT-5 is efficient for simple tasks with advanced capabilities. ';
      }

      // Size scoring
      if (characteristics.size === 'massive' && model.id === 'gpt-4-omega') {
        score += 25;
        reasoning += 'GPT-4 Omega handles massive datasets with ultra-large context window. ';
      } else if (characteristics.size === 'large' && (model.id === 'gpt-5' || model.id === 'gpt-4-omega')) {
        score += 20;
        reasoning += `${model.name} suitable for large data processing. `;
      } else if (characteristics.size === 'medium' && model.id === 'codex') {
        score += 15;
        reasoning += 'Codex efficient for medium-sized technical datasets. ';
      } else if (characteristics.size === 'small' && model.id === 'gpt-5') {
        score += 10;
        reasoning += 'ChatGPT-5 cost-effective for small datasets with advanced capabilities. ';
      }

      // Real-time requirements
      if (characteristics.realTimeRequired && model.id === 'gpt-5') {
        score += 20;
        reasoning += 'ChatGPT-5 optimized for real-time processing. ';
      } else if (characteristics.realTimeRequired && model.id === 'codex') {
        score += 15;
        reasoning += 'Codex provides fast real-time technical processing. ';
      }

      // Cost sensitivity
      if (characteristics.costSensitivity === 'high' && model.id === 'gpt-5') {
        score += 15;
        reasoning += 'Cost-effective choice for high-volume processing. ';
      } else if (characteristics.costSensitivity === 'low' && model.id === 'gpt-4-omega') {
        score += 10;
        reasoning += 'Premium model justified for high-value datasets. ';
      }

      // Pattern-specific scoring
      if (characteristics.patterns.includes('Structured Data (CSV)') && model.id === 'codex') {
        score += 10;
        reasoning += 'Excellent for structured data analysis and processing. ';
      }
      if (characteristics.patterns.includes('JSON Data') && model.id === 'gpt-5') {
        score += 10;
        reasoning += 'Strong JSON processing capabilities. ';
      }
      if (characteristics.patterns.includes('Log Files') && model.id === 'gpt-4-omega') {
        score += 15;
        reasoning += 'Advanced pattern recognition for log analysis. ';
      }

      return {
        model,
        score,
        reasoning: reasoning.trim()
      };
    });

    // Sort by score and get the best model
    scoredModels.sort((a, b) => b.score - a.score);
    
    // Add safety check for empty array
    if (scoredModels.length === 0) {
      throw new Error('No models available for scoring');
    }
    
    const bestModel = scoredModels[0];
    const alternatives = scoredModels.slice(1, 3).map(m => m.model.id);

    // Calculate confidence based on score difference
    const maxScore = Math.max(...scoredModels.map(m => m.score));
    const confidence = bestModel.score / maxScore;

    return {
      recommendedModel: bestModel.model.id,
      confidence,
      reasoning: bestModel.reasoning,
      alternativeModels: alternatives,
      performancePrediction: {
        modelId: bestModel.model.id,
        accuracy: bestModel.model.accuracy,
        speed: bestModel.model.speed,
        cost: bestModel.model.costPer1kTokens,
        reliability: 0.95,
        overallScore: bestModel.score
      }
    };
  }

  // Learn from model performance to improve future selections
  recordModelPerformance(modelId: string, metrics: ModelPerformanceMetrics) {
    if (!this.modelPerformanceHistory.has(modelId)) {
      this.modelPerformanceHistory.set(modelId, []);
    }
    
    const history = this.modelPerformanceHistory.get(modelId)!;
    history.push(metrics);
    
    // Keep only last 100 performance records
    if (history.length > 100) {
      history.shift();
    }
  }

  // Get performance insights for a model
  getModelInsights(modelId: string): ModelPerformanceMetrics | null {
    const history = this.modelPerformanceHistory.get(modelId);
    if (!history || history.length === 0) return null;

    // Calculate average performance
    const avgMetrics = history.reduce((acc, curr) => ({
      modelId: curr.modelId,
      accuracy: acc.accuracy + curr.accuracy,
      speed: acc.speed + curr.speed,
      cost: acc.cost + curr.cost,
      reliability: acc.reliability + curr.reliability,
      overallScore: acc.overallScore + curr.overallScore
    }), {
      modelId,
      accuracy: 0,
      speed: 0,
      cost: 0,
      reliability: 0,
      overallScore: 0
    });

    const count = history.length;
    return {
      modelId,
      accuracy: avgMetrics.accuracy / count,
      speed: avgMetrics.speed / count,
      cost: avgMetrics.cost / count,
      reliability: avgMetrics.reliability / count,
      overallScore: avgMetrics.overallScore / count
    };
  }

  // Parse file size string to bytes
  private parseFileSize(sizeStr: string): number {
    const units: { [key: string]: number } = {
      'Bytes': 1,
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024
    };

    const match = sizeStr.match(/(\d+\.?\d*)\s*(\w+)/);
    if (!match) return 0;

    const value = parseFloat(match[1]);
    const unit = match[2];
    return value * (units[unit] || 1);
  }

  // Get recommendation with detailed analysis
  async getDetailedRecommendation(directoryData: any): Promise<{
    characteristics: DatasetCharacteristics;
    recommendation: ModelRecommendation;
    allModelScores: Array<{ model: string; score: number; reasoning: string }>;
  }> {
    const characteristics = this.analyzeDataset(directoryData);
    const recommendation = this.selectOptimalModel(characteristics);
    
    // Get scores for all models
    const allModelScores = [
      { model: 'ChatGPT-5', score: 0, reasoning: '' },
      { model: 'Codex', score: 0, reasoning: '' },
      { model: 'GPT-4 Omega', score: 0, reasoning: '' }
    ];

    // This would be populated with actual scoring logic
    // For now, return the recommendation structure
    return {
      characteristics,
      recommendation,
      allModelScores
    };
  }
}

export default new ModelToggleAgent();
