import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface FileData {
  id: string;
  fileName: string;
  fileType: string;
  data: any;
  uploadTime: string;
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  fileReferences?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { 
      query, 
      files, 
      conversationHistory = [],
      selectedFileId 
    }: {
      query: string;
      files: FileData[];
      conversationHistory?: ConversationMessage[];
      selectedFileId?: string;
    } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Build context from uploaded files
    const fileContext = files.map(file => {
      const fileInfo = {
        id: file.id,
        name: file.fileName,
        type: file.fileType,
        size: file.data?.fileSize || 0,
        rows: file.data?.totalRows || 0,
        columns: file.data?.totalColumns || 0,
        sheets: file.data?.sheets?.length || 0,
        uploadTime: file.uploadTime
      };

      // Include sample data from the file
      const sampleData = file.data?.sheets?.[0]?.data?.slice(0, 5) || [];
      
      return {
        ...fileInfo,
        sampleData: sampleData
      };
    });

    // Find connections between files
    const connections = findFileConnections(files);

    // Create comprehensive system prompt
    const systemPrompt = `You are an advanced AI assistant with access to multiple uploaded files and extensive general knowledge. You can:

1. **Analyze individual files** - Deep dive into specific files
2. **Cross-file analysis** - Find patterns and connections between files
3. **General knowledge integration** - Use your training data to provide context, insights, and answer questions about topics outside the uploaded files
4. **Conversation memory** - Remember previous questions and build on them
5. **File recommendations** - Suggest which files to focus on for specific questions

**IMPORTANT**: You can answer questions about ANY topic, not just the uploaded files. Use your general knowledge to provide comprehensive answers while also referencing uploaded file data when relevant.

**PRIORITY SYSTEM:**
- **HIGHEST**: Direct answers to user questions using your general knowledge
- **HIGH**: Data from uploaded files when directly relevant to the question
- **MEDIUM**: Connections and patterns between uploaded files
- **LOW**: General knowledge for additional context

**CURRENT FILES:**
${fileContext.map(file => `
- **${file.name}** (${file.type.toUpperCase()})
  - Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
  - Data: ${file.rows} rows × ${file.columns} columns
  - Sheets: ${file.sheets}
  - Sample: ${JSON.stringify(file.sampleData.slice(0, 3))}
`).join('')}

**FILE CONNECTIONS:**
${connections.map(conn => `- ${conn.file1} ↔ ${conn.file2}: ${conn.connectionType}`).join('\n')}

**CONVERSATION HISTORY:**
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Always:
1. Answer the user's question directly using your general knowledge
2. Reference uploaded file data when it's relevant to the question
3. Explain connections between files when applicable
4. Provide actionable insights and suggestions
5. Be conversational, helpful, and comprehensive
6. Don't limit yourself to just the uploaded files - use your full knowledge base`;

    // Create user prompt with context
    const userPrompt = `User Query: "${query}"

Please provide a comprehensive answer to this question. You can:
1. Use your general knowledge to answer the question directly
2. Reference uploaded file data if it's relevant to the question
3. Consider any connections between files if applicable
4. Build on previous conversation context
5. Provide additional insights and suggestions

Don't limit yourself to just the uploaded files - use your full knowledge base to give the best possible answer.`;

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

    if (!response) {
      throw new Error('No response from OpenAI API');
    }

    // Extract file references from the response
    const fileReferences = extractFileReferences(response, files);

    return NextResponse.json({
      success: true,
      response: response,
      query: query,
      fileReferences: fileReferences,
      connections: connections,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in multi-file-agent API:', error);
    return NextResponse.json({ 
      error: 'Failed to process multi-file query',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function findFileConnections(files: FileData[]): Array<{file1: string, file2: string, connectionType: string}> {
  const connections = [];
  
  for (let i = 0; i < files.length; i++) {
    for (let j = i + 1; j < files.length; j++) {
      const file1 = files[i];
      const file2 = files[j];
      
      // Check for common data patterns
      const commonColumns = findCommonColumns(file1, file2);
      const commonData = findCommonData(file1, file2);
      const similarStructure = checkSimilarStructure(file1, file2);
      
      if (commonColumns.length > 0) {
        connections.push({
          file1: file1.fileName,
          file2: file2.fileName,
          connectionType: `Common columns: ${commonColumns.join(', ')}`
        });
      }
      
      if (commonData.length > 0) {
        connections.push({
          file1: file1.fileName,
          file2: file2.fileName,
          connectionType: `Common data patterns: ${commonData.join(', ')}`
        });
      }
      
      if (similarStructure) {
        connections.push({
          file1: file1.fileName,
          file2: file2.fileName,
          connectionType: 'Similar data structure'
        });
      }
    }
  }
  
  return connections;
}

function findCommonColumns(file1: FileData, file2: FileData): string[] {
  const columns1 = file1.data?.sheets?.[0]?.data?.[0] || [];
  const columns2 = file2.data?.sheets?.[0]?.data?.[0] || [];
  
  return columns1.filter(col => columns2.includes(col));
}

function findCommonData(file1: FileData, file2: FileData): string[] {
  // Simple implementation - look for common values in the first few rows
  const data1 = file1.data?.sheets?.[0]?.data?.slice(1, 5) || [];
  const data2 = file2.data?.sheets?.[0]?.data?.slice(1, 5) || [];
  
  const values1 = data1.flat();
  const values2 = data2.flat();
  
  return values1.filter(val => values2.includes(val)).slice(0, 5);
}

function checkSimilarStructure(file1: FileData, file2: FileData): boolean {
  const rows1 = file1.data?.totalRows || 0;
  const rows2 = file2.data?.totalRows || 0;
  const cols1 = file1.data?.totalColumns || 0;
  const cols2 = file2.data?.totalColumns || 0;
  
  // Consider similar if row/column counts are within 20% of each other
  const rowDiff = Math.abs(rows1 - rows2) / Math.max(rows1, rows2);
  const colDiff = Math.abs(cols1 - cols2) / Math.max(cols1, cols2);
  
  return rowDiff < 0.2 && colDiff < 0.2;
}

function extractFileReferences(response: string, files: FileData[]): string[] {
  const references = [];
  
  for (const file of files) {
    if (response.toLowerCase().includes(file.fileName.toLowerCase())) {
      references.push(file.id);
    }
  }
  
  return references;
}

export async function GET() {
  return NextResponse.json({
    message: 'Multi-File AI Agent is ready',
    capabilities: [
      'Multi-file analysis',
      'Cross-file connections',
      'General knowledge integration',
      'Conversation memory',
      'File relationship detection',
      'Pattern recognition across files'
    ],
    supportedFormats: ['xlsx', 'xls', 'csv', 'pdf'],
    model: 'gpt-4o'
  });
}
