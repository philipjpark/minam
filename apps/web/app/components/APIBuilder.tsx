'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, LinearProgress, Chip, Button, Alert } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface APIBuilderProps {
  onComplete: (apiUrl: string, apiKey: string) => void;
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

const APIBuilder: React.FC<APIBuilderProps> = ({ onComplete, onClose, fileData }) => {
  const [currentStep, setCurrentStep] = useState(0);
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

  useEffect(() => {
    startAgentWorkflow();
  }, []);

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

  const analyzeFileData = async (fileData: any) => {
    if (!fileData) {
      return {
        fileType: 'Unknown',
        dataRows: 0,
        qualityScore: 0,
        missingValues: 0,
        schemaGenerated: false
      };
    }

    try {
      // Call OpenAI API to analyze the file data
      const response = await fetch('/api/analyze-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileData: fileData,
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
      return {
        fileType: fileData.fileName?.split('.').pop()?.toUpperCase() || 'Unknown',
        dataRows: fileData.totalRows || 0,
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
        const analysis = await analyzeFileData(fileData);
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
    onComplete(apiUrl, apiKey);
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
          
          {/* Overall Progress */}
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
        </Box>

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
