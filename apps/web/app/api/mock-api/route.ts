import { NextRequest, NextResponse } from 'next/server';

// Mock data for demonstration
const mockData = {
  trading_data: [
    { timestamp: '2024-01-01T00:00:00Z', symbol: 'BTC', price: 42000, volume: 1500000000, sentiment: 0.75 },
    { timestamp: '2024-01-01T01:00:00Z', symbol: 'BTC', price: 42150, volume: 1200000000, sentiment: 0.78 },
    { timestamp: '2024-01-01T02:00:00Z', symbol: 'BTC', price: 41900, volume: 1800000000, sentiment: 0.72 },
    { timestamp: '2024-01-01T03:00:00Z', symbol: 'BTC', price: 42200, volume: 1100000000, sentiment: 0.80 },
    { timestamp: '2024-01-01T04:00:00Z', symbol: 'BTC', price: 41800, volume: 2000000000, sentiment: 0.70 },
  ],
  insights: [
    'Bitcoin shows strong bullish momentum with increasing volume',
    'Price consolidation pattern suggests potential breakout',
    'Sentiment analysis indicates positive market outlook',
    'Technical indicators point to continued upward trend'
  ]
};

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Simple mock RAG response based on query
    let response = {
      query: query,
      answer: '',
      confidence: 0.85,
      sources: [] as string[],
      timestamp: new Date().toISOString()
    };

    const queryLower = query.toLowerCase();

    if (queryLower.includes('price') || queryLower.includes('bitcoin') || queryLower.includes('btc')) {
      const latestPrice = mockData.trading_data[mockData.trading_data.length - 1];
      response.answer = `Based on the latest data, Bitcoin is currently trading at $${latestPrice.price.toLocaleString()} with a volume of ${(latestPrice.volume / 1000000).toFixed(1)}M. The sentiment score is ${latestPrice.sentiment}, indicating ${latestPrice.sentiment > 0.75 ? 'positive' : 'neutral'} market sentiment.`;
      response.sources = ['trading_data', 'price_analysis'];
    } else if (queryLower.includes('trend') || queryLower.includes('analysis')) {
      response.answer = mockData.insights.join(' ');
      response.sources = ['technical_analysis', 'sentiment_analysis'];
    } else if (queryLower.includes('volume')) {
      const avgVolume = mockData.trading_data.reduce((sum, item) => sum + item.volume, 0) / mockData.trading_data.length;
      response.answer = `The average trading volume over the analyzed period is ${(avgVolume / 1000000).toFixed(1)}M. Volume patterns show ${avgVolume > 1500000000 ? 'high' : 'moderate'} activity, suggesting ${avgVolume > 1500000000 ? 'strong' : 'steady'} market interest.`;
      response.sources = ['volume_analysis', 'market_metrics'];
    } else {
      response.answer = `I found relevant information about your query: "${query}". Based on the available data, I can provide insights about Bitcoin trading patterns, price movements, and market sentiment. Would you like me to elaborate on any specific aspect?`;
      response.sources = ['general_analysis'];
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    return NextResponse.json({
      data: mockData.trading_data.slice(0, limit),
      total: mockData.trading_data.length,
      timestamp: new Date().toISOString(),
      source: 'minam_mock_api'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
