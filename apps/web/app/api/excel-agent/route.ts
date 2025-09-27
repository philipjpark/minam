import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { query, fileContent, fileName } = await request.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    if (!fileContent) {
      return NextResponse.json({ error: 'File content is required' }, { status: 400 });
    }

    // Create a comprehensive prompt for Excel file analysis
    const systemPrompt = `You are an expert Excel data analyst and AI agent. You can analyze Excel files, answer questions about the data, perform calculations, identify patterns, and provide insights.

Your capabilities include:
- Analyzing spreadsheet data structure and content
- Answering questions about specific data points
- Performing calculations and aggregations
- Identifying trends and patterns
- Providing data visualizations suggestions
- Explaining data relationships
- Suggesting data cleaning or transformation steps

When analyzing Excel data, always:
1. Provide clear, actionable insights
2. Include specific data references when possible
3. Suggest follow-up questions or analyses
4. Be precise with numbers and calculations
5. Explain your reasoning clearly

File: ${fileName || 'Unknown'}`;

    const userPrompt = `Please analyze this Excel file data and answer the following question: "${query}"

Excel File Content:
${fileContent}

Please provide a comprehensive analysis that includes:
1. Direct answer to the question
2. Relevant data points and calculations
3. Key insights and patterns
4. Any recommendations or follow-up suggestions`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 2000,
      temperature: 0.1,
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({
      success: true,
      response: response,
      query: query,
      fileName: fileName,
      timestamp: new Date().toISOString(),
      model: 'gpt-4o'
    });

  } catch (error: any) {
    console.error('Excel Agent Error:', error);
    return NextResponse.json({ 
      error: 'Failed to process Excel file with AI agent',
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Excel AI Agent is ready',
    capabilities: [
      'Excel file analysis',
      'Data pattern recognition',
      'Statistical calculations',
      'Trend identification',
      'Data visualization suggestions',
      'Query answering'
    ],
    supportedFormats: ['xlsx', 'xls', 'csv'],
    model: 'gpt-4o'
  });
}
