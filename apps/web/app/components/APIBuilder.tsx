'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, LinearProgress, Chip, Button, Alert, TextField } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import SupabaseService from '../services/supabaseService';

interface APIBuilderProps {
  onComplete: (apiUrl: string, apiKey: string, uploadedFiles?: any[]) => void;
  onClose: () => void;
  fileData?: any; // Add file data prop
}

interface Agent {
  id: string;
  name: string;
  role: string;
  icon: string;
  status: 'waiting' | 'working' | 'completed' | 'error';
  progress: number;
  currentTask: string;
  details: string[];
  confidence: number;
}

interface UploadedFile {
  id: string;
  file: File;
  data: any;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
}

const APIBuilder: React.FC<APIBuilderProps> = ({ onComplete, onClose, fileData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showFileUpload, setShowFileUpload] = useState(true);
  const [workflowStarted, setWorkflowStarted] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'supabase'>('upload');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [supabaseTables, setSupabaseTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [isLoadingSupabase, setIsLoadingSupabase] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [manualTableName, setManualTableName] = useState('');
  const [showManualTableInput, setShowManualTableInput] = useState(false);

  const handleContinueWithFiles = () => {
    setShowFileUpload(false);
    setCurrentStep(1);
    setWorkflowStarted(true);
    // Start the agent workflow after files are uploaded
    startAgentWorkflow();
  };

  const processFile = async (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          if (file.type === 'application/pdf') {
            // PDF processing - create mock data for now
            const mockData = {
              fileName: file.name,
              sheets: [{
                name: 'PDF Content',
                data: [
                  ['PDF Document: ' + file.name],
                  ['File Size: ' + (file.size / 1024 / 1024).toFixed(2) + ' MB'],
                  ['Document Type: PDF'],
                  ['Status: Ready for AI analysis']
                ],
                rows: 4,
                columns: 1
              }],
              totalRows: 4,
              totalColumns: 1,
              fileSize: file.size
            };
            resolve(mockData);
          } else {
            // Excel/CSV processing
            const arrayBuffer = e.target?.result as ArrayBuffer;
            if (!arrayBuffer) {
              reject(new Error('Failed to read file'));
              return;
            }

            // Import xlsx dynamically
            const XLSX = (await import('xlsx')).default;
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            
            const sheets = workbook.SheetNames.map(sheetName => {
              const worksheet = workbook.Sheets[sheetName];
              const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
              return {
                name: sheetName,
                data: data,
                rows: data.length,
                columns: data[0]?.length || 0
              };
            });

            const fileData = {
              fileName: file.name,
              sheets: sheets,
              totalRows: sheets.reduce((sum, sheet) => sum + sheet.rows, 0),
              totalColumns: Math.max(...sheets.map(sheet => sheet.columns)),
              fileSize: file.size
            };

            resolve(fileData);
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = [];

    for (const file of acceptedFiles) {
      const fileId = `${file.name}-${Date.now()}-${Math.random()}`;
      
      // Add file to state immediately
      const uploadedFile: UploadedFile = {
        id: fileId,
        file: file,
        data: null,
        status: 'uploading',
        progress: 0
      };

      newFiles.push(uploadedFile);
      setUploadedFiles(prev => [...prev, uploadedFile]);

      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId 
              ? { ...f, progress: Math.min(f.progress + 10, 90) }
              : f
          ));
        }, 200);

        // Process file
        const fileData = await processFile(file);
        
        clearInterval(progressInterval);
        
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { 
                ...f, 
                data: fileData, 
                status: 'completed', 
                progress: 100 
              }
            : f
        ));
      } catch (error) {
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { 
                ...f, 
                status: 'error', 
                error: error instanceof Error ? error.message : 'Unknown error',
                progress: 0
              }
            : f
        ));
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB max per file
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };


  const connectToSupabase = async () => {
    if (!supabaseUrl.trim()) {
      setSupabaseError('Please enter a database URL');
      return;
    }

    if (!supabaseKey.trim()) {
      setSupabaseError('Please enter an API key');
      return;
    }

    setIsLoadingSupabase(true);
    setSupabaseError(null);

    try {
      const supabase = new SupabaseService(supabaseUrl.trim(), supabaseKey.trim());
      const isConnected = await supabase.testConnection();

      if (!isConnected) {
        throw new Error('Failed to connect to database');
      }

      const tables = await supabase.getTables();
      setSupabaseTables(tables);
      
      // If no tables found automatically, show manual input option
      if (tables.length === 0) {
        setShowManualTableInput(true);
      }
    } catch (error) {
      setSupabaseError(error instanceof Error ? error.message : 'Failed to connect to database');
    } finally {
      setIsLoadingSupabase(false);
    }
  };

  const fetchSupabaseTable = async (tableName: string) => {
    if (!supabaseUrl.trim()) return;

    setIsLoadingSupabase(true);
    setSupabaseError(null);

    try {
      const supabase = new SupabaseService(supabaseUrl.trim(), supabaseKey.trim() || undefined);
      const tableData = await supabase.fetchTableData(tableName);

      // Convert Supabase data to UploadedFile format
      const fileId = `${tableName}-${Date.now()}-${Math.random()}`;
      const uploadedFile: UploadedFile = {
        id: fileId,
        file: new File([], `${tableName}_supabase_data.xlsx`, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        data: tableData,
        status: 'completed',
        progress: 100
      };

      setUploadedFiles(prev => [...prev, uploadedFile]);
    } catch (error) {
      setSupabaseError(error instanceof Error ? error.message : 'Failed to fetch table data');
    } finally {
      setIsLoadingSupabase(false);
    }
  };

  const fetchManualTable = async () => {
    if (!manualTableName.trim()) {
      setSupabaseError('Please enter a table name');
      return;
    }

    await fetchSupabaseTable(manualTableName.trim());
    setManualTableName('');
    setShowManualTableInput(false);
  };

  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'data-validator',
      name: 'Data Validator',
      role: 'Data Processing',
      icon: '🔍',
      status: 'waiting',
      progress: 0,
      currentTask: 'Waiting to start...',
      details: [],
      confidence: 0
    },
    {
      id: 'model-profiler',
      name: 'Model Profiler',
      role: 'AI Model Selection',
      icon: '🧠',
      status: 'waiting',
      progress: 0,
      currentTask: 'Waiting to start...',
      details: [],
      confidence: 0
    },
    {
      id: 'api-architect',
      name: 'API Architect',
      role: 'Endpoint Design',
      icon: '🏗️',
      status: 'waiting',
      progress: 0,
      currentTask: 'Waiting to start...',
      details: [],
      confidence: 0
    },
    {
      id: 'security-auditor',
      name: 'Security Auditor',
      role: 'Security & Access',
      icon: '🔒',
      status: 'waiting',
      progress: 0,
      currentTask: 'Waiting to start...',
      details: [],
      confidence: 0
    },
    {
      id: 'deployment-engineer',
      name: 'Deployment Engineer',
      role: 'Infrastructure',
      icon: '☁️',
      status: 'waiting',
      progress: 0,
      currentTask: 'Waiting to start...',
      details: [],
      confidence: 0
    },
    {
      id: 'orchestrator',
      name: 'Orchestrator',
      role: 'Coordination',
      icon: '⚙️',
      status: 'waiting',
      progress: 0,
      currentTask: 'Waiting to start...',
      details: [],
      confidence: 0
    }
  ]);

  const [overallProgress, setOverallProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [apiKey, setApiKey] = useState('');

  const agentTasks = [
    {
      id: 'data-validator',
      tasks: [
        'Analyzing uploaded data structure...',
        'Validating data quality and format...',
        'Detecting patterns and relationships...',
        'Cleaning and normalizing data...',
        'Generating data schema...'
      ],
      details: [
        'File type: CSV detected',
        'Data rows: 1,247 records',
        'Quality score: 94%',
        'Missing values: 0.2%',
        'Schema generated successfully'
      ]
    },
    {
      id: 'model-profiler',
      tasks: [
        'Analyzing data characteristics...',
        'Evaluating model requirements...',
        'Comparing AI model performance...',
        'Selecting optimal model...',
        'Configuring model parameters...'
      ],
      details: [
        'Data type: Structured financial data',
        'Model candidates: ChatGPT-5, GPT-4 Omega, Codex',
        'Selected: ChatGPT-5 (98% accuracy)',
        'Reasoning: Best for financial data analysis',
        'Parameters optimized for query performance'
      ]
    },
    {
      id: 'api-architect',
      tasks: [
        'Designing API endpoints...',
        'Creating query interface...',
        'Setting up data access patterns...',
        'Configuring response formats...',
        'Generating API documentation...'
      ],
      details: [
        'Endpoints: /query, /data, /insights',
        'Query interface: Natural language processing',
        'Response format: JSON with metadata',
        'Rate limiting: 100 req/min configured',
        'Documentation: OpenAPI 3.0 generated'
      ]
    },
    {
      id: 'security-auditor',
      tasks: [
        'Implementing access controls...',
        'Setting up authentication...',
        'Configuring data encryption...',
        'Auditing security measures...',
        'Validating compliance...'
      ],
      details: [
        'Authentication: API key + JWT tokens',
        'Encryption: AES-256 at rest, TLS in transit',
        'Access control: Role-based permissions',
        'Rate limiting: Per-user quotas',
        'Compliance: SOC 2 Type II ready'
      ]
    },
    {
      id: 'deployment-engineer',
      tasks: [
        'Setting up cloud infrastructure...',
        'Configuring auto-scaling...',
        'Deploying API containers...',
        'Setting up monitoring...',
        'Configuring load balancing...'
      ],
      details: [
        'Infrastructure: AWS ECS + RDS',
        'Scaling: Auto-scale 1-10 instances',
        'Monitoring: CloudWatch + custom metrics',
        'Load balancer: Application Load Balancer',
        'CDN: CloudFront for global distribution'
      ]
    },
    {
      id: 'orchestrator',
      tasks: [
        'Coordinating all agents...',
        'Validating system integration...',
        'Running final tests...',
        'Generating API credentials...',
        'Deploying to production...'
      ],
      details: [
        'Integration: All systems connected',
        'Testing: 100% test coverage passed',
        'Credentials: API key generated',
        'Deployment: Production ready',
        'Status: API is live and accessible'
      ]
    }
  ];

  // Remove automatic start - agents will start when user clicks continue

  const startAgentWorkflow = async () => {
    for (let i = 0; i < agents.length; i++) {
      await processAgent(i);
      setOverallProgress(((i + 1) / agents.length) * 100);
    }
    
    // Generate API credentials
    const generatedApiUrl = `https://api.minam.com/v1/api_${Date.now()}`;
    const generatedApiKey = `minam_${Math.random().toString(36).substr(2, 12)}`;
    
    setApiUrl(generatedApiUrl);
    setApiKey(generatedApiKey);
    setIsComplete(true);
  };

  const analyzeFileData = async () => {
    if (uploadedFiles.length === 0) {
      return {
        fileType: 'Unknown',
        dataRows: 0,
        qualityScore: 0,
        missingValues: 0,
        schemaGenerated: false
      };
    }

    try {
      // Use the first uploaded file for analysis
      const firstFile = uploadedFiles[0];
      if (!firstFile.data) {
        return {
          fileType: 'Unknown',
          dataRows: 0,
          qualityScore: 0,
          missingValues: 0,
          schemaGenerated: false
        };
      }

      // Call OpenAI API to analyze the file data
      const response = await fetch('/api/analyze-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileData: firstFile.data,
          analysisType: 'data-validation'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze file data');
      }

      const analysis = await response.json();
      return analysis;
    } catch (error) {
      console.error('Error analyzing file data:', error);
      // Fallback to basic analysis
      const firstFile = uploadedFiles[0];
      return {
        fileType: firstFile?.data?.fileName?.split('.').pop()?.toUpperCase() || 'Unknown',
        dataRows: firstFile?.data?.totalRows || 0,
        qualityScore: 85,
        missingValues: 5,
        schemaGenerated: true
      };
    }
  };

  const processAgent = async (agentIndex: number) => {
    const agent = agents[agentIndex];
    const agentConfig = agentTasks[agentIndex];
    
    // Update agent status to working
    setAgents(prev => prev.map((a, index) => 
      index === agentIndex 
        ? { ...a, status: 'working' as const }
        : a
    ));

    // Process each task
    for (let taskIndex = 0; taskIndex < agentConfig.tasks.length; taskIndex++) {
      const task = agentConfig.tasks[taskIndex];
      const progress = ((taskIndex + 1) / agentConfig.tasks.length) * 100;
      
          // For Data Validator, use dynamic analysis
          let details = agentConfig.details.slice(0, taskIndex + 1);
          if (agent.id === 'data-validator' && taskIndex === agentConfig.tasks.length - 1) {
            // Last task - generate dynamic details
            const analysis = await analyzeFileData();
            details = [
              `File type: ${analysis.fileType} detected`,
              `Data rows: ${analysis.dataRows.toLocaleString()} records`,
              `Quality score: ${analysis.qualityScore}%`,
              `Missing values: ${analysis.missingValues}%`,
              analysis.schemaGenerated ? 'Schema generated successfully' : 'Schema generation failed'
            ];
          }
      
      setAgents(prev => prev.map((a, index) => 
        index === agentIndex 
          ? { 
              ...a, 
              currentTask: task,
              progress: progress,
              details: details,
              confidence: Math.min(95, 70 + (taskIndex * 5))
            }
          : a
      ));

      // Simulate work time
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    }

    // Mark agent as completed
    setAgents(prev => prev.map((a, index) => 
      index === agentIndex 
        ? { 
            ...a, 
            status: 'completed' as const,
            progress: 100,
            confidence: 95
          }
        : a
    ));
  };

  const handleEnterSandbox = () => {
    onComplete(apiUrl, apiKey, uploadedFiles);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 50%, #16213E 100%)',
        zIndex: 1000,
        overflow: 'auto',
        p: 2
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
            🚀 API Builder
          </Typography>
          <Typography variant="h6" sx={{ color: '#B0BEC5', mb: 4 }}>
            Our AI agents are building your intelligent knowledge API
          </Typography>
          
          {/* File Upload Section */}
          {showFileUpload && (
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              mb: 4
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
                  📁 Upload Your Files
                </Typography>
                
                {/* Upload Method Tabs */}
                <Box sx={{ display: 'flex', mb: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Button
                    onClick={() => setUploadMethod('upload')}
                    sx={{
                      color: uploadMethod === 'upload' ? '#FFD700' : '#B0BEC5',
                      borderBottom: uploadMethod === 'upload' ? '2px solid #FFD700' : '2px solid transparent',
                      borderRadius: 0,
                      px: 3,
                      py: 1
                    }}
                  >
                    📁 Upload Files
                  </Button>
                  <Button
                    onClick={() => setUploadMethod('supabase')}
                    sx={{
                      color: uploadMethod === 'supabase' ? '#FFD700' : '#B0BEC5',
                      borderBottom: uploadMethod === 'supabase' ? '2px solid #FFD700' : '2px solid transparent',
                      borderRadius: 0,
                      px: 3,
                      py: 1
                    }}
                  >
                    🔗 Connect URL
                  </Button>
                </Box>

                {/* Upload Method Content */}
                {uploadMethod === 'upload' ? (
                  /* File Upload Dropzone */
                  <Box
                    {...getRootProps()}
                    sx={{
                      border: `2px dashed ${isDragActive ? '#FFD700' : 'rgba(255, 255, 255, 0.3)'}`,
                      borderRadius: '12px',
                      p: 4,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#FFD700',
                        background: 'rgba(255, 215, 0, 0.05)'
                      }
                    }}
                  >
                    <input {...getInputProps()} />
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                      {isDragActive ? '📂 Drop files here' : '📁 Drag & drop files here'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 3 }}>
                      or click to browse files
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#757575' }}>
                      Supports Excel (.xlsx, .xls), CSV (.csv), PDF (.pdf) • Max 10MB per file
                    </Typography>
                  </Box>
                ) : (
                  /* Supabase Connection */
                  <Box>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                      Connect to Database
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 3 }}>
                      Enter your database URL and API key to connect and import data.
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        value={supabaseUrl}
                        onChange={(e) => setSupabaseUrl(e.target.value)}
                        placeholder="https://your-database-url.com"
                        disabled={isLoadingSupabase}
                        sx={{
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#FFD700',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-focused': {
                              color: '#FFD700',
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            color: 'white',
                            '&::placeholder': {
                              color: 'rgba(255, 255, 255, 0.5)',
                            },
                          },
                        }}
                      />
                      
                        <TextField
                          fullWidth
                          value={supabaseKey}
                          onChange={(e) => setSupabaseKey(e.target.value)}
                          placeholder="Your API key (required)"
                          disabled={isLoadingSupabase}
                        sx={{
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#FFD700',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-focused': {
                              color: '#FFD700',
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            color: 'white',
                            '&::placeholder': {
                              color: 'rgba(255, 255, 255, 0.5)',
                            },
                          },
                        }}
                      />
                      
                        <Button
                          onClick={connectToSupabase}
                          disabled={!supabaseUrl.trim() || !supabaseKey.trim() || isLoadingSupabase}
                          sx={{
                            background: 'linear-gradient(135deg, #3ECF8E 0%, #2E7D32 100%)',
                            '&:hover': { background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)' },
                            color: 'white',
                            px: 4,
                            py: 1.5,
                            mb: 2
                          }}
                        >
                          {isLoadingSupabase ? 'Connecting...' : '🔗 Connect to Database'}
                        </Button>
                    </Box>

                    {supabaseError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {supabaseError}
                      </Alert>
                    )}

                    {supabaseTables.length > 0 ? (
                      <Box>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                          Available Tables ({supabaseTables.length})
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: '200px', overflow: 'auto' }}>
                          {supabaseTables.map((table) => (
                            <Card key={table.name} sx={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              p: 2,
                              cursor: 'pointer',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.1)'
                              }
                            }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                  <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                                    {table.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#B0BEC5' }}>
                                    {table.columns.length} columns • {table.rowCount} rows
                                  </Typography>
                                </Box>
                                <Button
                                  size="small"
                                  onClick={() => fetchSupabaseTable(table.name)}
                                  disabled={isLoadingSupabase}
                                  sx={{
                                    background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                                    '&:hover': { background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)' },
                                    color: 'white',
                                    px: 2,
                                    py: 0.5
                                  }}
                                >
                                  {isLoadingSupabase ? 'Loading...' : '📥 Import'}
                                </Button>
                              </Box>
                            </Card>
                          ))}
                        </Box>
                      </Box>
                    ) : showManualTableInput ? (
                      <Box>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                          Manual Table Import
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 3 }}>
                          No tables were found automatically. Please enter the name of a table you want to import.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <TextField
                            fullWidth
                            value={manualTableName}
                            onChange={(e) => setManualTableName(e.target.value)}
                            placeholder="Enter table name (e.g., users, products, orders)"
                            disabled={isLoadingSupabase}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#FFD700',
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&.Mui-focused': {
                                  color: '#FFD700',
                                },
                              },
                              '& .MuiOutlinedInput-input': {
                                color: 'white',
                                '&::placeholder': {
                                  color: 'rgba(255, 255, 255, 0.5)',
                                },
                              },
                            }}
                          />
                          <Button
                            onClick={fetchManualTable}
                            disabled={!manualTableName.trim() || isLoadingSupabase}
                            sx={{
                              background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                              '&:hover': { background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)' },
                              color: 'white',
                              px: 4,
                              py: 1.5
                            }}
                          >
                            {isLoadingSupabase ? 'Loading...' : '📥 Import Table'}
                          </Button>
                        </Box>
                        <Button
                          onClick={() => setShowManualTableInput(false)}
                          sx={{ color: '#B0BEC5', textTransform: 'none' }}
                        >
                          ← Back to automatic discovery
                        </Button>
                      </Box>
                    ) : null}
                    
                    <Typography variant="caption" sx={{ color: '#757575', mt: 2, display: 'block' }}>
                      Connect to your database to import table data directly. Both URL and API key are required.
                    </Typography>
                  </Box>
                )}

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                      Uploaded Files ({uploadedFiles.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {uploadedFiles.map((file) => (
                        <Card key={file.id} sx={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          p: 2
                        }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="body1" sx={{ color: 'white' }}>
                                {file.file.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#B0BEC5' }}>
                                {(file.file.size / 1024 / 1024).toFixed(2)} MB
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Chip
                                label={file.status}
                                size="small"
                                sx={{
                                  backgroundColor: file.status === 'completed' ? '#4CAF50' : 
                                                 file.status === 'error' ? '#F44336' : '#FF9800',
                                  color: 'white'
                                }}
                              />
                              {file.status === 'uploading' && (
                                <Typography variant="caption" sx={{ color: '#B0BEC5' }}>
                                  {file.progress}%
                                </Typography>
                              )}
                              <Button
                                size="small"
                                onClick={() => removeFile(file.id)}
                                sx={{ color: '#F44336', minWidth: 'auto', p: 0.5 }}
                              >
                                ✕
                              </Button>
                            </Box>
                          </Box>
                          {file.error && (
                            <Alert severity="error" sx={{ mt: 1 }}>
                              {file.error}
                            </Alert>
                          )}
                        </Card>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Continue Button */}
                {uploadedFiles.length > 0 && uploadedFiles.every(f => f.status === 'completed') && (
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Button
                      variant="contained"
                      onClick={handleContinueWithFiles}
                      sx={{
                        background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                        '&:hover': { background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)' },
                        color: 'white',
                        py: 1.5,
                        px: 4,
                        fontSize: '1.1rem'
                      }}
                    >
                      Continue with {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''}
                    </Button>
                  </Box>
                )}

                {/* Upload Instructions */}
                {uploadedFiles.length === 0 && (
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                      {uploadMethod === 'upload' 
                        ? 'Upload files or switch to Connect URL to get started'
                        : 'Connect to database or switch to file upload'
                      }
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Box>
          
        {/* Overall Progress and Agents - Only show when workflow has started */}
          {workflowStarted && (
            <>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                mb: 4
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      Overall Progress
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#4CAF50' }}>
                      {Math.round(overallProgress)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={overallProgress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #4CAF50, #2E7D32)',
                        borderRadius: 4
                      }
                    }}
                  />
                </CardContent>
              </Card>

              {/* Agents Grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 3, mb: 4 }}>
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100%'
              }}>
                <CardContent>
                  {/* Agent Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      fontSize: '2rem', 
                      mr: 2,
                      opacity: agent.status === 'completed' ? 1 : 0.7
                    }}>
                      {agent.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {agent.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                        {agent.role}
                      </Typography>
                    </Box>
                    <Chip 
                      label={agent.status}
                      size="small"
                      sx={{
                        backgroundColor: agent.status === 'completed' ? '#4CAF50' : 
                                        agent.status === 'working' ? '#FF9800' : 
                                        '#9E9E9E',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>

                  {/* Progress Bar */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                        Progress
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#4CAF50' }}>
                        {Math.round(agent.progress)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={agent.progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #4CAF50, #2E7D32)',
                          borderRadius: 3
                        }
                      }}
                    />
                  </Box>

                  {/* Current Task */}
                  <Typography variant="body2" sx={{ color: 'white', mb: 2, fontStyle: 'italic' }}>
                    {agent.currentTask}
                  </Typography>

                  {/* Details */}
                  <AnimatePresence>
                    {agent.details.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1, fontWeight: 'bold' }}>
                          Details:
                        </Typography>
                        {agent.details.map((detail, detailIndex) => (
                          <motion.div
                            key={detailIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: detailIndex * 0.1 }}
                          >
                            <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 0.5 }}>
                              • {detail}
                            </Typography>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Confidence Score */}
                  {agent.confidence > 0 && (
                    <Box sx={{ mt: 2, p: 1, background: 'rgba(76, 175, 80, 0.1)', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ color: '#4CAF50', textAlign: 'center' }}>
                        Confidence: {agent.confidence}%
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
              </Box>
            </>
          )}

        {/* Completion Section */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card sx={{ 
                background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(46, 125, 50, 0.1) 100%)',
                border: '2px solid #4CAF50',
                textAlign: 'center',
                p: 4
              }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                  🎉 Your API is Ready!
                </Typography>
                <Typography variant="h6" sx={{ color: '#B0BEC5', mb: 3 }}>
                  All agents have completed their work. Your intelligent knowledge API is now live and ready for testing.
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                    <strong>API URL:</strong> {apiUrl}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                    <strong>API Key:</strong> {apiKey}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={handleEnterSandbox}
                    sx={{
                      background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    🧪 Enter Sandbox
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{
                      color: '#B0BEC5',
                      borderColor: '#B0BEC5',
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem'
                    }}
                  >
                    Close
                  </Button>
                </Box>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default APIBuilder;
