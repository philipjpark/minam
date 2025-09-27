'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  LinearProgress,
  Chip,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip
} from '@mui/material';
// Using simple emoji icons instead of Material-UI icons
const AgentIcon = () => <span style={{ fontSize: '24px' }}>🤖</span>;
const BrainIcon = () => <span style={{ fontSize: '24px' }}>🧠</span>;
const ChartIcon = () => <span style={{ fontSize: '24px' }}>📈</span>;
const CodeIcon = () => <span style={{ fontSize: '24px' }}>💻</span>;
const SecurityIcon = () => <span style={{ fontSize: '24px' }}>🔒</span>;
const DeployIcon = () => <span style={{ fontSize: '24px' }}>☁️</span>;
const OrchestratorIcon = () => <span style={{ fontSize: '24px' }}>⚙️</span>;
const CheckIcon = () => <span style={{ fontSize: '20px' }}>✅</span>;
const PlayIcon = () => <span style={{ fontSize: '20px' }}>▶️</span>;
const PauseIcon = () => <span style={{ fontSize: '20px' }}>⏸️</span>;
const RefreshIcon = () => <span style={{ fontSize: '20px' }}>🔄</span>;
const LaunchIcon = () => <span style={{ fontSize: '20px' }}>🚀</span>;
const CloseIcon = () => <span style={{ fontSize: '20px' }}>❌</span>;
const RealTimeIcon = () => <span style={{ fontSize: '20px' }}>⚡</span>;
const BlockchainIcon = () => <span style={{ fontSize: '20px' }}>⛓️</span>;
import CryptoAgentService, { CryptoAgent, CryptoDataset, APISpecification } from '../../services/cryptoAgentService';

interface CryptoAgentsWorkingPageProps {
  dataset: CryptoDataset;
  requirements: any;
  onComplete: (results: any) => void;
  onClose: () => void;
}

const CryptoAgentsWorkingPage: React.FC<CryptoAgentsWorkingPageProps> = ({ 
  dataset, 
  requirements, 
  onComplete, 
  onClose 
}) => {
  const [agents, setAgents] = useState<CryptoAgent[]>(() => {
    // Get default agents from the service
    const defaultAgents = [
      {
        id: 'data-validator',
        name: 'Data Validator',
        type: 'data_validator' as const,
        status: 'idle' as const,
        description: 'Validates and cleans crypto datasets for quality and consistency',
        confidence: 0.95,
        lastUpdate: new Date().toISOString(),
        performance: {
          accuracy: 0.98,
          speed: 0.85,
          efficiency: 0.92
        },
        config: {
          model: 'gpt-4o',
          temperature: 0.1,
          maxTokens: 4000
        },
        crypto_specialization: {
          blockchain: ['ethereum', 'bitcoin', 'solana'],
          trading_pairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'],
          analysis_types: ['price_data', 'volume_analysis', 'sentiment']
        },
        role: 'Data Validation',
        progress: 0,
        currentTask: 'Waiting to start'
      },
      {
        id: 'model-profiler',
        name: 'Model Profiler',
        type: 'model_profiler' as const,
        status: 'idle' as const,
        description: 'Analyzes data patterns and selects optimal AI models for crypto analysis',
        confidence: 0.88,
        lastUpdate: new Date().toISOString(),
        performance: {
          accuracy: 0.94,
          speed: 0.78,
          efficiency: 0.89
        },
        config: {
          model: 'gpt-4o',
          temperature: 0.2,
          maxTokens: 6000
        },
        crypto_specialization: {
          blockchain: ['ethereum', 'bitcoin', 'polygon'],
          trading_pairs: ['BTC/USDT', 'ETH/USDT', 'MATIC/USDT'],
          analysis_types: ['pattern_recognition', 'model_selection', 'performance_optimization']
        },
        role: 'Model Selection',
        progress: 0,
        currentTask: 'Waiting to start'
      },
      {
        id: 'api-architect',
        name: 'API Architect',
        type: 'api_architect' as const,
        status: 'idle' as const,
        description: 'Designs comprehensive API specifications for crypto data monetization',
        confidence: 0.92,
        lastUpdate: new Date().toISOString(),
        performance: {
          accuracy: 0.96,
          speed: 0.82,
          efficiency: 0.91
        },
        config: {
          model: 'gpt-4o',
          temperature: 0.3,
          maxTokens: 8000
        },
        crypto_specialization: {
          blockchain: ['ethereum', 'bitcoin', 'solana', 'polygon'],
          trading_pairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'MATIC/USDT'],
          analysis_types: ['api_design', 'endpoint_optimization', 'rate_limiting']
        },
        role: 'API Design',
        progress: 0,
        currentTask: 'Waiting to start'
      },
      {
        id: 'security-auditor',
        name: 'Security Auditor',
        type: 'security_auditor' as const,
        status: 'idle' as const,
        description: 'Audits API security and ensures crypto data protection standards',
        confidence: 0.97,
        lastUpdate: new Date().toISOString(),
        performance: {
          accuracy: 0.99,
          speed: 0.75,
          efficiency: 0.88
        },
        config: {
          model: 'gpt-4o',
          temperature: 0.1,
          maxTokens: 5000
        },
        crypto_specialization: {
          blockchain: ['ethereum', 'bitcoin'],
          trading_pairs: ['BTC/USDT', 'ETH/USDT'],
          analysis_types: ['security_audit', 'vulnerability_assessment', 'compliance_check']
        },
        role: 'Security Audit',
        progress: 0,
        currentTask: 'Waiting to start'
      },
      {
        id: 'deployment-engineer',
        name: 'Deployment Engineer',
        type: 'deployment_engineer' as const,
        status: 'idle' as const,
        description: 'Handles API deployment and infrastructure scaling for crypto services',
        confidence: 0.90,
        lastUpdate: new Date().toISOString(),
        performance: {
          accuracy: 0.93,
          speed: 0.88,
          efficiency: 0.85
        },
        config: {
          model: 'gpt-4o',
          temperature: 0.2,
          maxTokens: 6000
        },
        crypto_specialization: {
          blockchain: ['ethereum', 'bitcoin', 'solana'],
          trading_pairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'],
          analysis_types: ['deployment_strategy', 'scaling_optimization', 'monitoring_setup']
        },
        role: 'Deployment',
        progress: 0,
        currentTask: 'Waiting to start'
      },
      {
        id: 'orchestrator',
        name: 'Orchestrator',
        type: 'orchestrator' as const,
        status: 'idle' as const,
        description: 'Coordinates all agents and manages the complete API generation workflow',
        confidence: 0.94,
        lastUpdate: new Date().toISOString(),
        performance: {
          accuracy: 0.95,
          speed: 0.80,
          efficiency: 0.93
        },
        config: {
          model: 'gpt-4o',
          temperature: 0.1,
          maxTokens: 10000
        },
        crypto_specialization: {
          blockchain: ['ethereum', 'bitcoin', 'solana', 'polygon'],
          trading_pairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'MATIC/USDT'],
          analysis_types: ['workflow_management', 'agent_coordination', 'quality_assurance']
        },
        role: 'Orchestration',
        progress: 0,
        currentTask: 'Waiting to start'
      }
    ];
    return defaultAgents;
  });
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('Initialization');
  const [isPaused, setIsPaused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [agentResults, setAgentResults] = useState<any>(null);
  const [canDeploy, setCanDeploy] = useState(false);
  const [deploymentSuccess, setDeploymentSuccess] = useState(false);
  const [apiDeployed, setApiDeployed] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  const [currentAgentDetails, setCurrentAgentDetails] = useState<string>('');
  const [realTimeUpdates, setRealTimeUpdates] = useState<any[]>([]);

  // Reset deployment state when component mounts
  useEffect(() => {
    setApiDeployed(false);
    setDeploymentSuccess(false);
    setCanDeploy(false);
  }, []);

  useEffect(() => {
    if (!isPaused) {
      startCryptoAgentWorkflow();
    }
  }, [isPaused]);

  const addSystemLog = (message: string) => {
    setSystemLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const startCryptoAgentWorkflow = () => {
    addSystemLog('🚀 Starting Crypto Trading API Generation Workflow');
    addSystemLog(`📊 Processing ${dataset.type} dataset: ${dataset.name}`);
    addSystemLog(`⛓️ Target Blockchains: ${dataset.blockchain?.join(', ') || 'Not specified'}`);
    
    // Start agents with crypto-specific timing
    setTimeout(() => startAgent('data-validator'), 1000);
    setTimeout(() => startAgent('model-profiler'), 3000);
    setTimeout(() => startAgent('api-architect'), 5000);
    setTimeout(() => startAgent('security-auditor'), 7000);
    setTimeout(() => startAgent('deployment-engineer'), 9000);
    setTimeout(() => startAgent('orchestrator'), 11000);
  };

  const startAgent = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      addSystemLog(`🤖 ${agent.name} is now active and beginning ${agent.role?.toLowerCase() || 'processing'}`);
      setCurrentPhase(`${agent.name} Phase`);
      setCurrentAgentDetails(agent.description);
      
      setAgents(prev => prev.map(a => 
        a.id === agentId 
          ? { ...a, status: 'running', progress: 0 }
          : a
      ));

      // Simulate work progress with crypto-specific tasks
      const interval = setInterval(() => {
        setAgents(prev => prev.map(a => {
          if (a.id === agentId && a.status === 'running') {
            const newProgress = Math.min((a.progress || 0) + Math.random() * 8, 100);
            
            if (newProgress >= 100) {
              clearInterval(interval);
              addSystemLog(`✅ ${a.name} has completed ${a.role?.toLowerCase() || 'processing'} successfully`);
              return { ...a, status: 'completed', progress: 100 };
            }
            
            // Add crypto-specific progress logs
            if (newProgress > (a.progress || 0) && newProgress % 25 === 0) {
              addSystemLog(`📊 ${a.name} progress: ${Math.round(newProgress)}% - ${a.currentTask}`);
            }
            
            return { ...a, progress: newProgress };
          }
          return a;
        }));
      }, 300);

      // Update current task with crypto-specific details
      let taskIndex = 0;
      const cryptoTasks = getCryptoTasksForAgent(agentId);
      const taskInterval = setInterval(() => {
        setAgents(prev => prev.map(a => {
          if (a.id === agentId && a.status === 'running') {
            const newTaskIndex = Math.min(taskIndex + 1, cryptoTasks.length - 1);
            taskIndex = newTaskIndex;
            const newTask = cryptoTasks[newTaskIndex];
            
            addSystemLog(`🔄 ${a.name} is now: ${newTask}`);
            setCurrentAgentDetails(newTask);
            
            return { ...a, currentTask: newTask };
          }
          return a;
        }));
        
        if (taskIndex >= cryptoTasks.length - 1) {
          clearInterval(taskInterval);
        }
      }, 2500);
    }
  };

  const getCryptoTasksForAgent = (agentId: string): string[] => {
    const taskMap: Record<string, string[]> = {
      'data-validator': [
        'Initializing crypto data validation algorithms...',
        'Cleaning price data and removing outliers',
        'Validating blockchain transaction data integrity',
        'Structuring data for optimal API performance',
        'Implementing real-time data freshness checks',
        'Finalizing data quality assessment report'
      ],
      'model-profiler': [
        'Analyzing crypto market patterns and trends...',
        'Evaluating ML models for price prediction accuracy',
        'Testing sentiment analysis models on crypto data',
        'Optimizing models for low-latency trading decisions',
        'Implementing blockchain-specific feature engineering',
        'Finalizing model selection and configuration'
      ],
      'api-architect': [
        'Designing RESTful endpoints for crypto data access...',
        'Implementing real-time WebSocket connections',
        'Configuring rate limiting for trading applications',
        'Setting up authentication for crypto traders',
        'Optimizing API structure for low-latency responses',
        'Finalizing API specification and documentation'
      ],
      'security-auditor': [
        'Implementing crypto-specific security measures...',
        'Configuring data encryption for sensitive trading data',
        'Setting up access controls for API endpoints',
        'Ensuring compliance with financial regulations',
        'Implementing blockchain verification mechanisms',
        'Finalizing security audit and compliance report'
      ],
      'deployment-engineer': [
        'Containerizing API for blockchain infrastructure...',
        'Setting up auto-scaling for high-frequency trading',
        'Configuring monitoring and alerting systems',
        'Implementing load balancing for crypto data streams',
        'Setting up real-time data pipeline infrastructure',
        'Finalizing deployment and monitoring configuration'
      ],
      'orchestrator': [
        'Coordinating final API integration...',
        'Implementing real-time data streaming capabilities',
        'Setting up WebSocket connections for live updates',
        'Configuring API versioning and backward compatibility',
        'Testing end-to-end crypto trading data flow',
        'Finalizing API delivery and real-time update system'
      ]
    };

    return taskMap[agentId] || ['Processing...'];
  };

  useEffect(() => {
    // Calculate overall progress
    const totalProgress = agents.reduce((sum, agent) => sum + agent.progress, 0);
    const averageProgress = totalProgress / agents.length;
    setOverallProgress(averageProgress);

    // Check if all agents are complete
    if (agents.every(agent => agent.status === 'completed')) {
      setTimeout(() => {
        setShowResults(true);
        setCanDeploy(true);
      }, 2000);
    }
  }, [agents]);

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleRestart = () => {
    setAgents(prev => prev.map(agent => ({
      ...agent,
      status: 'idle',
      progress: 0,
      currentTask: 'Waiting to start'
    })));
    setOverallProgress(0);
    setCurrentPhase('Initialization');
    setIsPaused(false);
  };

  const handleComplete = () => {
    const results = {
      dataValidator: {
        status: 'completed',
        dataQuality: 'High quality crypto data validated and cleaned',
        dataFreshness: 'Real-time data freshness checks implemented',
        blockchainVerified: true,
        message: 'Crypto dataset validated and optimized for trading APIs'
      },
      modelProfiler: {
        status: 'completed',
        selectedModel: 'LSTM with attention mechanism for price prediction',
        accuracy: '94.2% accuracy on crypto price prediction',
        latency: 'Sub-100ms inference time for real-time trading',
        message: 'Optimal ML model selected for crypto trading analysis'
      },
      apiArchitect: {
        status: 'completed',
        endpoints: '12 RESTful endpoints + WebSocket for real-time data',
        authentication: 'JWT + Web3 wallet authentication supported',
        rateLimits: '1000 requests/minute for trading applications',
        message: 'High-performance API architecture designed for crypto traders'
      },
      securityAuditor: {
        status: 'completed',
        securityLevel: 'Enterprise-grade security with blockchain verification',
        encryption: 'AES-256 encryption for all sensitive data',
        compliance: 'GDPR and financial regulations compliant',
        message: 'Security audit completed with crypto-specific protections'
      },
      deploymentEngineer: {
        status: 'completed',
        infrastructure: 'Kubernetes cluster with auto-scaling',
        monitoring: 'Real-time monitoring with 99.9% uptime SLA',
        latency: 'Sub-50ms response times globally',
        message: 'API deployed on high-performance crypto trading infrastructure'
      },
      orchestrator: {
        status: 'completed',
        realTimeUpdates: 'WebSocket connections for live data streaming',
        apiVersion: 'v1.0.0 with backward compatibility',
        documentation: 'Comprehensive API docs for crypto traders',
        message: 'API orchestration completed with real-time update capabilities'
      },
      apiSpec: {
        name: `${dataset.name} Trading API`,
        version: '1.0.0',
        status: 'ready_for_deployment',
        realTimeCapable: true,
        blockchainVerified: true,
        tradingOptimized: true
      }
    };
    setAgentResults(results);
    setShowResults(true);
    setCanDeploy(true);
  };

  const handleDeployAPI = async () => {
    if (apiDeployed) {
      console.log('API already deployed, skipping duplicate deployment');
      return;
    }

    try {
      addSystemLog('🚀 Deploying API to crypto trading infrastructure...');
      
      // Simulate API deployment
      setTimeout(() => {
        setApiDeployed(true);
        setDeploymentSuccess(true);
        addSystemLog('✅ API successfully deployed and ready for crypto traders!');
        addSystemLog('📡 Real-time data streaming activated');
        addSystemLog('🔗 API endpoints available for integration');
        
        onComplete({ 
          ...agentResults, 
          deployed: true, 
          apiUrl: `https://api.minam.com/v1/${dataset.name.toLowerCase().replace(/\s+/g, '-')}`,
          websocketUrl: `wss://api.minam.com/ws/${dataset.name.toLowerCase().replace(/\s+/g, '-')}`,
          realTimeUpdates: true
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error deploying API:', error);
      addSystemLog('❌ API deployment failed. Please try again.');
    }
  };

  const getAgentIcon = (agentId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'data-validator': <BrainIcon />,
      'model-profiler': <ChartIcon />,
      'api-architect': <CodeIcon />,
      'security-auditor': <SecurityIcon />,
      'deployment-engineer': <DeployIcon />,
      'orchestrator': <OrchestratorIcon />
    };
    return iconMap[agentId] || <AgentIcon />;
  };

  const getAgentColor = (agentId: string) => {
    const colorMap: Record<string, string> = {
      'data-validator': '#2196F3',
      'model-profiler': '#4CAF50',
      'api-architect': '#FF9800',
      'security-auditor': '#F44336',
      'deployment-engineer': '#9C27B0',
      'orchestrator': '#00BCD4'
    };
    return colorMap[agentId] || '#666';
  };

  const getAgentReasoning = (agentId: string, status: string) => {
    if (status !== 'completed') return null;
    
    const reasoningMap: Record<string, string> = {
      'data-validator': 'Analyzed 15,000+ crypto data points, validated price accuracy against 3 exchanges, cleaned 2.3% outliers, verified blockchain transaction integrity using Merkle proofs, and implemented real-time data freshness checks.',
      'model-profiler': 'Tested 8 ML models on 6 months of historical data. LSTM with attention achieved 94.2% accuracy vs 89.1% for traditional models. Selected for superior pattern recognition in volatile crypto markets and sub-100ms inference time.',
      'api-architect': 'Designed RESTful architecture with 12 endpoints covering price data, technical indicators, and sentiment analysis. Implemented WebSocket for real-time updates, JWT + Web3 authentication, and rate limiting optimized for trading applications.',
      'security-auditor': 'Conducted comprehensive security audit: AES-256 encryption for all data, implemented rate limiting and DDoS protection, added blockchain verification for data integrity, ensured GDPR compliance, and established 99.9% uptime SLA.',
      'deployment-engineer': 'Deployed on Kubernetes cluster with auto-scaling (2-20 pods), configured CDN for global <50ms latency, set up monitoring with Prometheus/Grafana, implemented blue-green deployments, and established disaster recovery procedures.',
      'orchestrator': 'Coordinated all agents, established real-time communication via WebSockets, created comprehensive API documentation, implemented versioning strategy, and set up automated testing pipeline with 95% code coverage.'
    };
    
    return reasoningMap[agentId] || 'Agent completed its assigned tasks successfully.';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 50%, #16213E 100%)',
        py: 4,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: 'radial-gradient(circle at 20% 80%, #4CAF50 0%, transparent 50%), radial-gradient(circle at 80% 20%, #2196F3 0%, transparent 50%), radial-gradient(circle at 40% 40%, #FF9800 0%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite alternate'
        }}
      />

      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h2" 
              gutterBottom
              sx={{ 
                color: 'white',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '3px',
                textShadow: '0 0 20px rgba(76, 175, 80, 0.5)'
              }}
            >
              ⚡ Crypto Trading API Generation
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#B0BEC5',
                fontWeight: 300,
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Your {dataset.type} dataset is being processed by our AI agents to create a high-performance trading API
            </Typography>
          </Box>
        </motion.div>

        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card sx={{ 
            mb: 6, 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Overall Progress: {Math.round(overallProgress)}%
                </Typography>
                <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 3 }}>
                  Current Phase: {currentPhase}
                </Typography>
                <Typography variant="body2" sx={{ color: '#4CAF50', mb: 3, fontStyle: 'italic' }}>
                  {currentAgentDetails}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={overallProgress}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #4CAF50, #2196F3, #FF9800)',
                      borderRadius: 6
                    }
                  }}
                />
              </Box>

              {/* Control Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handlePauseResume}
                  startIcon={isPaused ? <PlayIcon /> : <PauseIcon />}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleRestart}
                  startIcon={<RefreshIcon />}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Restart
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card sx={{ 
            mb: 6, 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
                📋 System Activity Logs
              </Typography>
              <Box sx={{ 
                maxHeight: '200px', 
                overflowY: 'auto',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                p: 2,
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}>
                {systemLogs.length === 0 ? (
                  <Typography variant="body2" sx={{ color: '#B0BEC5', textAlign: 'center' }}>
                    Waiting for system initialization...
                  </Typography>
                ) : (
                  systemLogs.map((log, index) => (
                    <Box key={index} sx={{ 
                      color: 'white', 
                      mb: 1, 
                      opacity: index < systemLogs.length - 10 ? 0.6 : 1,
                      transition: 'opacity 0.3s ease'
                    }}>
                      {log}
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Agent Cards */}
        <Grid container spacing={4}>
          {agents.map((agent, index) => (
            <Grid item xs={12} md={6} lg={4} key={agent.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Tooltip
                  title={
                    <Box sx={{ p: 2, maxWidth: 300 }}>
                      <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
                        {agent.name} - Task Completion Details
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#E0E0E0', lineHeight: 1.6 }}>
                        {getAgentReasoning(agent.id, agent.status) || 'Agent is currently working on its assigned tasks...'}
                      </Typography>
                    </Box>
                  }
                  arrow
                  placement="top"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: 'rgba(0, 0, 0, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${getAgentColor(agent.id)}`,
                        borderRadius: '12px',
                        boxShadow: `0 8px 32px ${getAgentColor(agent.id)}40`
                      }
                    },
                    arrow: {
                      sx: {
                        color: 'rgba(0, 0, 0, 0.9)'
                      }
                    }
                  }}
                  disableHoverListener={agent.status !== 'completed'}
                >
                  <Card sx={{ 
                    height: '100%',
                    background: `linear-gradient(135deg, ${getAgentColor(agent.id)}15 0%, ${getAgentColor(agent.id)}05 100%)`,
                    border: `2px solid ${agent.status === 'running' ? getAgentColor(agent.id) : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '20px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: agent.status === 'completed' ? 'pointer' : 'default',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: `0 20px 40px ${getAgentColor(agent.id)}30`
                    }
                  }}>
                  {/* Status Indicator */}
                  <Box sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: agent.status === 'completed' ? '#4CAF50' : 
                               agent.status === 'running' ? getAgentColor(agent.id) : '#666',
                    boxShadow: agent.status === 'running' ? `0 0 20px ${getAgentColor(agent.id)}` : 'none',
                    animation: agent.status === 'running' ? 'pulse 2s infinite' : 'none'
                  }} />

                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Agent Header */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          mb: 2,
                          background: `linear-gradient(135deg, ${getAgentColor(agent.id)}, ${getAgentColor(agent.id)}80)`,
                          boxShadow: `0 8px 32px ${getAgentColor(agent.id)}40`
                        }}
                      >
                        {getAgentIcon(agent.id)}
                      </Avatar>
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                        {agent.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 2 }}>
                        {agent.role}
                      </Typography>
                      <Chip
                        label={agent.status}
                        color={agent.status === 'completed' ? 'success' : 
                               agent.status === 'running' ? 'primary' : 'default'}
                        variant="outlined"
                        sx={{ color: 'white' }}
                      />
                    </Box>

                    {/* Progress Bar */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                          Progress
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                          {Math.round(agent.progress)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={agent.progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            background: `linear-gradient(90deg, ${getAgentColor(agent.id)}, ${getAgentColor(agent.id)}80)`,
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>

                    {/* Current Task */}
                    <Box sx={{ mb: 3, flex: 1 }}>
                      <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                        Current Task:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontStyle: 'italic' }}>
                        {agent.currentTask}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
                </Tooltip>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Dataset Info Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card sx={{ 
            mt: 6,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
                📊 Crypto Dataset Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                    Dataset: <span style={{ color: 'white' }}>{dataset.name}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                    Type: <span style={{ color: 'white' }}>{dataset.type}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                    Blockchain: <span style={{ color: 'white' }}>{dataset.blockchain.join(', ')}</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                    Size: <span style={{ color: 'white' }}>{dataset.size.toLocaleString()} records</span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                    Quality: <span style={{ color: 'white' }}>{dataset.quality_score}/100</span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                    Updates: <span style={{ color: 'white' }}>{dataset.update_frequency}</span>
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Completion Section with Deploy Button */}
        {agents.every(agent => agent.status === 'completed') && !deploymentSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Card sx={{ 
              mt: 4,
              background: 'rgba(76, 175, 80, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(76, 175, 80, 0.3)',
              borderRadius: '20px'
            }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                  🎉 Crypto Trading API Ready!
                </Typography>
                <Typography variant="body1" sx={{ color: '#FFFFFF', mb: 4, fontWeight: 500 }}>
                  All AI agents have successfully created your high-performance crypto trading API. 
                  Ready for deployment with real-time data streaming!
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleComplete}
                    startIcon={<LaunchIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1976D2, #1565C0)'
                      }
                    }}
                  >
                    View Results
                  </Button>
                  
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleDeployAPI}
                    disabled={apiDeployed}
                    startIcon={<DeployIcon />}
                    sx={{
                      background: apiDeployed 
                        ? 'linear-gradient(135deg, #9E9E9E, #757575)' 
                        : 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        background: apiDeployed 
                          ? 'linear-gradient(135deg, #9E9E9E, #757575)' 
                          : 'linear-gradient(135deg, #2E7D32, #1B5E20)'
                      }
                    }}
                  >
                    {apiDeployed ? '✅ API Deployed' : '🚀 Deploy Trading API'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Deployment Success Message */}
        {deploymentSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card sx={{ 
              mt: 4,
              background: 'rgba(76, 175, 80, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(76, 175, 80, 0.4)',
              borderRadius: '20px'
            }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                  🎉 Crypto Trading API Successfully Deployed!
                </Typography>
                <Typography variant="body1" sx={{ color: '#FFFFFF', mb: 4, fontWeight: 500 }}>
                  Your API is now live and ready for crypto traders! Real-time data streaming is active.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => onComplete({ deployed: true, message: 'API deployed successfully' })}
                    startIcon={<RealTimeIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2E7D32, #1B5E20)'
                      }
                    }}
                  >
                    View Live API
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </Container>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default CryptoAgentsWorkingPage;
