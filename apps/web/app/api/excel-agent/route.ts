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

    // Create a comprehensive prompt for file analysis
    const systemPrompt = `You are an expert data analyst and AI agent. You can analyze various file types including Excel files, CSV files, and PDF documents. You can answer questions about the data, perform calculations, identify patterns, and provide insights.

Your capabilities include:
- Analyzing spreadsheet data structure and content (Excel, CSV)
- Analyzing PDF document content and structure
- Answering questions about specific data points
- Performing calculations and aggregations
- Identifying trends and patterns
- Providing data visualizations suggestions
- Explaining data relationships
- Suggesting data cleaning or transformation steps
- Extracting key information from documents

When analyzing data, always:
1. Provide clear, actionable insights
2. Include specific data references when possible
3. Suggest follow-up questions or analyses
4. Be precise with numbers and calculations
5. Explain your reasoning clearly
6. For PDFs, focus on content analysis and key information extraction

File: ${fileName || 'Unknown'}`;

    const userPrompt = `Please analyze this file data and answer the following question: "${query}"

File Content:
${fileContent}

Please provide a comprehensive analysis that includes:
1. Direct answer to the question
2. Relevant data points and calculations
3. Key insights and patterns
4. Any recommendations or follow-up suggestions

Note: If this is a PDF file, focus on extracting and analyzing the textual content and key information.`;

    // Model selection logic - Default to GPT-5 for API Builder final stage
    const queryLength = query.length;
    const hasComplexAnalysis = query.toLowerCase().includes('calculate') || 
                              query.toLowerCase().includes('analyze') || 
                              query.toLowerCase().includes('trend') ||
                              query.toLowerCase().includes('pattern') ||
                              query.toLowerCase().includes('poem') ||
                              query.toLowerCase().includes('creative') ||
                              query.toLowerCase().includes('write');
    
    let selectedModel = 'gpt-4o'; // Default fallback
    let modelReasoning = 'GPT-4o selected for standard analysis';
    
    // Default to GPT-5 for API Builder final stage (all queries)
    selectedModel = 'gpt-5'; // Using GPT-5 for all API Builder final stage queries
    if (hasComplexAnalysis || queryLength > 50) {
      modelReasoning = 'GPT-5 selected for advanced analysis and creative tasks in API Builder final stage';
    } else {
      modelReasoning = 'GPT-5 selected for efficient processing in API Builder final stage';
    }

    const completion = await openai.chat.completions.create({
      model: selectedModel,
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
      model: selectedModel, // Use the actual selected model (gpt-5)
      modelReasoning: modelReasoning
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
    supportedFormats: ['xlsx', 'xls', 'csv', 'pdf'],
    model: 'gpt-5'
  });
}
