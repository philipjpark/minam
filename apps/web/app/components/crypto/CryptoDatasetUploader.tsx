'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Alert,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
// Using simple emoji icons instead of Material-UI icons
const UploadIcon = () => <span style={{ fontSize: '24px' }}>☁️</span>;
const FileIcon = () => <span style={{ fontSize: '24px' }}>📄</span>;
const DataIcon = () => <span style={{ fontSize: '24px' }}>📊</span>;
const BlockchainIcon = () => <span style={{ fontSize: '24px' }}>⛓️</span>;
const SpeedIcon = () => <span style={{ fontSize: '24px' }}>⚡</span>;
const SecurityIcon = () => <span style={{ fontSize: '24px' }}>🔒</span>;
const CheckIcon = () => <span style={{ fontSize: '20px' }}>✅</span>;
const ErrorIcon = () => <span style={{ fontSize: '20px' }}>❌</span>;
const CloseIcon = () => <span style={{ fontSize: '20px' }}>❌</span>;
const RealTimeIcon = () => <span style={{ fontSize: '20px' }}>⚡</span>;
import { motion } from 'framer-motion';
import CryptoAgentService, { CryptoDataset } from '../../services/cryptoAgentService';
import CryptoAgentsWorkingPage from './CryptoAgentsWorkingPage';

interface CryptoDatasetUploaderProps {
  onComplete: (dataset: CryptoDataset, requirements: any) => void;
  onClose: () => void;
}

const CryptoDatasetUploader: React.FC<CryptoDatasetUploaderProps> = ({ onComplete, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dataset, setDataset] = useState<CryptoDataset | null>(null);
  const [requirements, setRequirements] = useState<any>({});
  const [showAgents, setShowAgents] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Dataset configuration
  const [datasetConfig, setDatasetConfig] = useState({
    name: '',
    type: 'price_data' as const,
    blockchain: [] as string[],
    update_frequency: 'real_time' as const,
    data_source: '',
    description: ''
  });

  // Trading requirements
  const [tradingRequirements, setTradingRequirements] = useState({
    trading_pairs: [] as string[],
    timeframes: [] as string[],
    analysis_types: [] as string[],
    real_time: true,
    target_users: 'retail_traders',
    latency_requirements: 'ultra_low',
    security_level: 'enterprise'
  });

  const datasetTypes = [
    { id: 'price_data', name: 'Price Data', icon: '📈', description: 'Historical and real-time price data' },
    { id: 'on_chain_metrics', name: 'On-Chain Metrics', icon: '⛓️', description: 'Blockchain transaction and network data' },
    { id: 'market_sentiment', name: 'Market Sentiment', icon: '😊', description: 'Social media and news sentiment analysis' },
    { id: 'defi_protocols', name: 'DeFi Protocols', icon: '🏦', description: 'DeFi protocol metrics and TVL data' },
    { id: 'nft_metrics', name: 'NFT Metrics', icon: '🖼️', description: 'NFT trading and collection data' },
    { id: 'custom', name: 'Custom Dataset', icon: '⚡', description: 'Custom crypto-related data' }
  ];

  const blockchains = [
    'Ethereum', 'Bitcoin', 'Solana', 'Polygon', 'Arbitrum', 'Optimism', 
    'Avalanche', 'BNB Chain', 'Cosmos', 'Polkadot', 'Cardano', 'Algorand'
  ];

  const tradingPairs = [
    'BTC/USD', 'ETH/USD', 'SOL/USD', 'MATIC/USD', 'AVAX/USD', 'DOT/USD',
    'ADA/USD', 'LINK/USD', 'UNI/USD', 'AAVE/USD', 'CRV/USD', 'SUSHI/USD'
  ];

  const timeframes = [
    '1m', '5m', '15m', '30m', '1h', '4h', '6h', '12h', '1d', '3d', '1w'
  ];

  const analysisTypes = [
    'price_prediction', 'sentiment_analysis', 'risk_assessment', 
    'volatility_analysis', 'volume_analysis', 'correlation_analysis'
  ];

  const steps = [
    { label: 'Upload Dataset', description: 'Upload your crypto dataset' },
    { label: 'Configure Dataset', description: 'Set dataset parameters' },
    { label: 'Trading Requirements', description: 'Define trading needs (optional)' },
    { label: 'Review & Generate', description: 'Review and start API generation' }
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Add safety check for acceptedFiles
    if (!acceptedFiles || acceptedFiles.length === 0) {
      console.error('No files accepted or files array is empty');
      return;
    }
    
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setDatasetConfig(prev => ({ ...prev, name: file.name.split('.')[0] }));
      setUploadProgress(0);
      
      // Simulate file analysis
      setIsAnalyzing(true);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsAnalyzing(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024, // 50MB max file size
    onDropRejected: (fileRejections) => {
      console.error('File rejected:', fileRejections);
      // You could show an error message to the user here
    }
  });

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0: return uploadedFile && uploadProgress === 100;
      case 1: return datasetConfig.name && datasetConfig.type && datasetConfig.blockchain.length > 0;
      case 2: return true; // Trading requirements are now optional
      case 3: return true;
      default: return false;
    }
  };

  const handleGenerateAPI = () => {
    const finalDataset: CryptoDataset = {
      id: Date.now().toString(),
      name: datasetConfig.name,
      type: datasetConfig.type,
      size: uploadedFile ? uploadedFile.size : 0,
      quality_score: Math.floor(Math.random() * 20) + 80, // Simulate quality score
      schema: { /* Would be generated from file analysis */ },
      last_updated: new Date().toISOString(),
      update_frequency: datasetConfig.update_frequency,
      blockchain: datasetConfig.blockchain,
      data_source: datasetConfig.data_source
    };

    setDataset(finalDataset);
    setRequirements(tradingRequirements);
    setShowAgents(true);
  };

  const handleAgentsComplete = (results: any) => {
    onComplete(dataset!, requirements);
  };

  const handleAgentsClose = () => {
    setShowAgents(false);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 3 }}>
              Upload Your Crypto Dataset
            </Typography>
            <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 4 }}>
              Upload your crypto trading data in CSV, JSON, or Excel format. 
              We'll analyze it and create a high-performance API for traders.
            </Typography>

            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed',
                borderColor: isDragActive ? '#4CAF50' : 'rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: isDragActive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  borderColor: '#4CAF50',
                  background: 'rgba(76, 175, 80, 0.1)'
                }
              }}
            >
              <input {...getInputProps()} />
              <UploadIcon sx={{ fontSize: 48, color: '#4CAF50', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                {isDragActive ? 'Drop your file here' : 'Drag & drop your dataset here'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 2 }}>
                or click to browse files
              </Typography>
              <Typography variant="caption" sx={{ color: '#B0BEC5' }}>
                Supports CSV, JSON, XLS, XLSX files
              </Typography>
            </Box>

            {fileRejections.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    File rejected: {fileRejections[0].errors[0]?.message || 'Invalid file type or size'}
                  </Typography>
                </Alert>
              </Box>
            )}

            {uploadedFile && (
              <Box sx={{ mt: 3 }}>
                <Card sx={{ background: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <FileIcon sx={{ color: '#4CAF50' }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                          {uploadedFile.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </Box>
                      {uploadProgress === 100 ? (
                        <CheckIcon sx={{ color: '#4CAF50' }} />
                      ) : (
                        <ErrorIcon sx={{ color: '#F44336' }} />
                      )}
                    </Box>
                    {isAnalyzing && (
                      <Box sx={{ mt: 2 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={uploadProgress}
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
                        <Typography variant="caption" sx={{ color: '#B0BEC5', mt: 1, display: 'block' }}>
                          Analyzing dataset structure... {uploadProgress}%
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 3 }}>
              Configure Your Dataset
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Dataset Name"
                  value={datasetConfig.name}
                  onChange={(e) => setDatasetConfig(prev => ({ ...prev, name: e.target.value }))}
                  sx={{ mb: 3 }}
                />
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Dataset Type</InputLabel>
                  <Select
                    value={datasetConfig.type}
                    onChange={(e) => setDatasetConfig(prev => ({ ...prev, type: e.target.value as any }))}
                    label="Dataset Type"
                  >
                    {datasetTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <span>{type.icon}</span>
                          <Box>
                            <Typography variant="body1">{type.name}</Typography>
                            <Typography variant="caption" sx={{ color: '#B0BEC5' }}>
                              {type.description}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Blockchains</InputLabel>
                  <Select
                    multiple
                    value={datasetConfig.blockchain}
                    onChange={(e) => setDatasetConfig(prev => ({ ...prev, blockchain: e.target.value as string[] }))}
                    label="Blockchains"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {blockchains.map((chain) => (
                      <MenuItem key={chain} value={chain}>
                        {chain}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Update Frequency</InputLabel>
                  <Select
                    value={datasetConfig.update_frequency}
                    onChange={(e) => setDatasetConfig(prev => ({ ...prev, update_frequency: e.target.value as any }))}
                    label="Update Frequency"
                  >
                    <MenuItem value="real_time">Real-time</MenuItem>
                    <MenuItem value="minute">Every minute</MenuItem>
                    <MenuItem value="hourly">Hourly</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Data Source"
                  value={datasetConfig.data_source}
                  onChange={(e) => setDatasetConfig(prev => ({ ...prev, data_source: e.target.value }))}
                  placeholder="e.g., CoinGecko API, Binance API, Custom collection"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 3 }}>
              Define Trading Requirements (Optional)
            </Typography>
            <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 4 }}>
              Specify trading requirements to optimize your API for specific use cases. You can skip this step and use default settings.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Trading Pairs</InputLabel>
                  <Select
                    multiple
                    value={tradingRequirements.trading_pairs}
                    onChange={(e) => setTradingRequirements(prev => ({ ...prev, trading_pairs: e.target.value as string[] }))}
                    label="Trading Pairs"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {tradingPairs.map((pair) => (
                      <MenuItem key={pair} value={pair}>
                        {pair}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Timeframes</InputLabel>
                  <Select
                    multiple
                    value={tradingRequirements.timeframes}
                    onChange={(e) => setTradingRequirements(prev => ({ ...prev, timeframes: e.target.value as string[] }))}
                    label="Timeframes"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {timeframes.map((timeframe) => (
                      <MenuItem key={timeframe} value={timeframe}>
                        {timeframe}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Analysis Types</InputLabel>
                  <Select
                    multiple
                    value={tradingRequirements.analysis_types}
                    onChange={(e) => setTradingRequirements(prev => ({ ...prev, analysis_types: e.target.value as string[] }))}
                    label="Analysis Types"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value.replace('_', ' ')} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {analysisTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Target Users</InputLabel>
                  <Select
                    value={tradingRequirements.target_users}
                    onChange={(e) => setTradingRequirements(prev => ({ ...prev, target_users: e.target.value }))}
                    label="Target Users"
                  >
                    <MenuItem value="retail_traders">Retail Traders</MenuItem>
                    <MenuItem value="institutional_traders">Institutional Traders</MenuItem>
                    <MenuItem value="algorithmic_traders">Algorithmic Traders</MenuItem>
                    <MenuItem value="all_traders">All Traders</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 3 }}>
              Review Configuration
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                      📊 Dataset Configuration
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                      Name: <span style={{ color: 'white' }}>{datasetConfig.name}</span>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                      Type: <span style={{ color: 'white' }}>{datasetTypes.find(t => t.id === datasetConfig.type)?.name}</span>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                      Blockchains: <span style={{ color: 'white' }}>{datasetConfig.blockchain.join(', ')}</span>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                      Updates: <span style={{ color: 'white' }}>{datasetConfig.update_frequency}</span>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                      ⚡ Trading Requirements
                    </Typography>
                    {tradingRequirements.trading_pairs.length > 0 || tradingRequirements.timeframes.length > 0 ? (
                      <>
                        <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                          Pairs: <span style={{ color: 'white' }}>{tradingRequirements.trading_pairs.join(', ') || 'Not specified'}</span>
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                          Timeframes: <span style={{ color: 'white' }}>{tradingRequirements.timeframes.join(', ') || 'Not specified'}</span>
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                          Analysis: <span style={{ color: 'white' }}>{tradingRequirements.analysis_types.join(', ') || 'Not specified'}</span>
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                          Users: <span style={{ color: 'white' }}>{tradingRequirements.target_users.replace('_', ' ')}</span>
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" sx={{ color: '#B0BEC5', fontStyle: 'italic' }}>
                        Trading requirements skipped - using default settings
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  if (showAgents && dataset) {
    return (
      <CryptoAgentsWorkingPage
        dataset={dataset}
        requirements={requirements}
        onComplete={handleAgentsComplete}
        onClose={handleAgentsClose}
      />
    );
  }

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
              ⚡ Crypto Trading API Generator
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
              Transform your crypto data into high-performance trading APIs with real-time updates
            </Typography>
          </Box>
        </motion.div>

        {/* Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card sx={{ 
            mb: 4,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Stepper activeStep={activeStep} orientation="horizontal">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      sx={{
                        '& .MuiStepLabel-iconContainer': {
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: activeStep >= index 
                            ? 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)'
                            : 'linear-gradient(135deg, #E0E0E0 0%, #F5F5F5 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          boxShadow: activeStep >= index 
                            ? '0 3px 12px rgba(76, 175, 80, 0.3)'
                            : '0 2px 6px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s ease'
                        },
                        '& .MuiStepLabel-label': {
                          color: activeStep >= index ? '#4CAF50' : '#9E9E9E',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginTop: '6px',
                          textAlign: 'center'
                        }
                      }}
                    >
                      <Typography variant="caption" sx={{ 
                        color: activeStep >= index ? '#4CAF50' : '#9E9E9E', 
                        display: 'block', 
                        maxWidth: '120px', 
                        lineHeight: 1.2,
                        fontSize: '0.7rem',
                        fontStyle: 'italic',
                        opacity: activeStep >= index ? 0.9 : 0.6,
                        textAlign: 'center',
                        mx: 'auto'
                      }}>
                        {step.description}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </motion.div>

        {/* Step Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px'
          }}>
            <CardContent sx={{ p: 5 }}>
              <Box sx={{ mb: 4 }}>
                {renderStepContent(activeStep)}
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 3, 
                justifyContent: 'space-between',
                alignItems: 'center',
                pt: 3,
                borderTop: '2px solid rgba(255, 255, 255, 0.1)'
              }}>
                <Box>
                  {activeStep > 0 && (
                    <Button 
                      onClick={handleBack} 
                      variant="outlined"
                      sx={{ 
                        color: 'white', 
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '12px',
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: '#4CAF50',
                          backgroundColor: 'rgba(76, 175, 80, 0.1)'
                        }
                      }}
                    >
                      ← Back
                    </Button>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    px: 3,
                    py: 1.5,
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <Typography variant="body2" sx={{ 
                      color: 'white', 
                      fontWeight: 600,
                      fontSize: '0.875rem'
                    }}>
                      Step {activeStep + 1} of {steps.length}
                    </Typography>
                  </Box>
                  
                  {/* Show Skip button for trading requirements step */}
                  {activeStep === 2 && (
                    <Button
                      variant="outlined"
                      onClick={handleNext}
                      sx={{
                        color: '#B0BEC5',
                        borderColor: 'rgba(176, 190, 197, 0.3)',
                        borderRadius: '12px',
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        '&:hover': {
                          borderColor: '#B0BEC5',
                          backgroundColor: 'rgba(176, 190, 197, 0.1)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Skip Trading Requirements
                    </Button>
                  )}
                  
                  <Button
                    variant="contained"
                    onClick={activeStep === steps.length - 1 ? handleGenerateAPI : handleNext}
                    disabled={!canProceed()}
                    sx={{
                      background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                      borderRadius: '12px',
                      px: 5,
                      py: 1.5,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
                      '&:hover': { 
                        background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
                        boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
                        transform: 'translateY(-2px)'
                      },
                      '&:disabled': { 
                        background: 'linear-gradient(135deg, #9E9E9E 0%, #BDBDBD 100%)',
                        boxShadow: 'none',
                        transform: 'none'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {activeStep === steps.length - 1 ? '🚀 Generate Trading API' : 'Next →'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
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

export default CryptoDatasetUploader;
