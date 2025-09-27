'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
// Using simple emoji icons instead of Material-UI icons
const PlayIcon = () => <span style={{ fontSize: '20px' }}>▶️</span>;
const PauseIcon = () => <span style={{ fontSize: '20px' }}>⏸️</span>;
const RefreshIcon = () => <span style={{ fontSize: '20px' }}>🔄</span>;
const CodeIcon = () => <span style={{ fontSize: '20px' }}>💻</span>;
const RealTimeIcon = () => <span style={{ fontSize: '20px' }}>⚡</span>;
const TrendingIcon = () => <span style={{ fontSize: '20px' }}>📈</span>;
const SecurityIcon = () => <span style={{ fontSize: '20px' }}>🔒</span>;
const SpeedIcon = () => <span style={{ fontSize: '20px' }}>⚡</span>;
const CheckIcon = () => <span style={{ fontSize: '20px' }}>✅</span>;
const ErrorIcon = () => <span style={{ fontSize: '20px' }}>❌</span>;
const WarningIcon = () => <span style={{ fontSize: '20px' }}>⚠️</span>;
const CloseIcon = () => <span style={{ fontSize: '20px' }}>❌</span>;
const CopyIcon = () => <span style={{ fontSize: '20px' }}>📋</span>;
const OpenIcon = () => <span style={{ fontSize: '20px' }}>🔗</span>;
import { motion, AnimatePresence } from 'framer-motion';
import CryptoAgentService, { APISpecification, CryptoDataset } from '../../services/cryptoAgentService';

interface RealTimeAPIDashboardProps {
  apiSpec: APISpecification;
  dataset: CryptoDataset;
  onClose: () => void;
}

interface APIMetric {
  name: string;
  value: string;
  status: 'good' | 'warning' | 'error';
  trend?: 'up' | 'down' | 'stable';
}

interface RealTimeUpdate {
  id: string;
  timestamp: string;
  type: 'price_update' | 'sentiment_change' | 'volume_spike' | 'error';
  data: any;
  severity: 'low' | 'medium' | 'high';
}

const RealTimeAPIDashboard: React.FC<RealTimeAPIDashboardProps> = ({ 
  apiSpec, 
  dataset, 
  onClose 
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState<RealTimeUpdate[]>([]);
  const [apiMetrics, setApiMetrics] = useState<APIMetric[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');

  // Initialize API metrics
  useEffect(() => {
    setApiMetrics([
      {
        name: 'Response Time',
        value: '12ms',
        status: 'good',
        trend: 'down'
      },
      {
        name: 'Uptime',
        value: '99.9%',
        status: 'good',
        trend: 'stable'
      },
      {
        name: 'Requests/min',
        value: '2,847',
        status: 'good',
        trend: 'up'
      },
      {
        name: 'Error Rate',
        value: '0.01%',
        status: 'good',
        trend: 'down'
      },
      {
        name: 'Data Freshness',
        value: '2.3s',
        status: 'good',
        trend: 'stable'
      },
      {
        name: 'Blockchain Sync',
        value: '99.8%',
        status: 'good',
        trend: 'up'
      }
    ]);
  }, []);

  // Connect to real-time updates
  useEffect(() => {
    if (isConnected && !isPaused) {
      connectToRealTimeUpdates();
    } else {
      disconnectFromRealTimeUpdates();
    }

    return () => {
      disconnectFromRealTimeUpdates();
    };
  }, [isConnected, isPaused]);

  const connectToRealTimeUpdates = () => {
    try {
      setConnectionStatus('connecting');
      
      // Simulate WebSocket connection
      const mockWebSocket = {
        onmessage: (event: any) => {
          const update = JSON.parse(event.data);
          handleRealTimeUpdate(update);
        },
        onopen: () => {
          setConnectionStatus('connected');
          setIsConnected(true);
        },
        onclose: () => {
          setConnectionStatus('disconnected');
          setIsConnected(false);
        },
        onerror: () => {
          setConnectionStatus('error');
        }
      };

      // Simulate real-time updates
      const interval = setInterval(() => {
        if (isConnected && !isPaused) {
          const mockUpdate: RealTimeUpdate = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            type: ['price_update', 'sentiment_change', 'volume_spike'][Math.floor(Math.random() * 3)] as any,
            data: {
              symbol: ['BTC/USD', 'ETH/USD', 'SOL/USD'][Math.floor(Math.random() * 3)],
              price: (Math.random() * 100000).toFixed(2),
              change: (Math.random() * 10 - 5).toFixed(2),
              volume: (Math.random() * 1000000).toFixed(0)
            },
            severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any
          };
          handleRealTimeUpdate(mockUpdate);
        }
      }, 2000);

      return () => clearInterval(interval);
    } catch (error) {
      console.error('Error connecting to real-time updates:', error);
      setConnectionStatus('error');
    }
  };

  const disconnectFromRealTimeUpdates = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setConnectionStatus('disconnected');
  };

  const handleRealTimeUpdate = (update: RealTimeUpdate) => {
    setRealTimeUpdates(prev => [update, ...prev.slice(0, 49)]); // Keep last 50 updates
    
    // Update metrics based on update
    setApiMetrics(prev => prev.map(metric => {
      if (metric.name === 'Data Freshness') {
        return {
          ...metric,
          value: `${(Math.random() * 5).toFixed(1)}s`,
          status: Math.random() > 0.8 ? 'warning' : 'good'
        };
      }
      return metric;
    }));
  };

  const handlePlayPause = () => {
    if (isConnected) {
      setIsPaused(!isPaused);
    } else {
      setIsConnected(true);
    }
  };

  const handleRefresh = () => {
    setRealTimeUpdates([]);
    setApiMetrics(prev => prev.map(metric => ({
      ...metric,
      value: metric.name === 'Response Time' ? `${Math.floor(Math.random() * 20) + 5}ms` : metric.value
    })));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'error': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'price_update': return <TrendingIcon />;
      case 'sentiment_change': return <RealTimeIcon />;
      case 'volume_spike': return <SpeedIcon />;
      case 'error': return <ErrorIcon />;
      default: return <CheckIcon />;
    }
  };

  const handleShowCode = (endpoint: any) => {
    setSelectedEndpoint(endpoint);
    setShowCodeDialog(true);
  };

  const generateCodeExample = (endpoint: any) => {
    return `// ${endpoint.description}
const response = await fetch('${apiSpec.endpoints[0]?.path || '/api/v1/data'}/${endpoint.path}', {
  method: '${endpoint.method}',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    // Add your parameters here
  })
});

const data = await response.json();
console.log(data);`;
  };

  const TabPanel = ({ children, value, index }: any) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

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

      <Container maxWidth="xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography 
                variant="h3" 
                gutterBottom
                sx={{ 
                  color: 'white',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                  textShadow: '0 0 20px rgba(76, 175, 80, 0.5)'
                }}
              >
                ⚡ Live API Dashboard
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#B0BEC5',
                  fontWeight: 300
                }}
              >
                {apiSpec.name} - Real-time Crypto Trading Data
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Chip
                icon={isConnected ? <CheckIcon /> : <ErrorIcon />}
                label={connectionStatus.toUpperCase()}
                color={isConnected ? 'success' : 'error'}
                variant="outlined"
                sx={{ color: 'white' }}
              />
              <IconButton onClick={handlePlayPause} sx={{ color: 'white' }}>
                {isConnected && !isPaused ? <PauseIcon /> : <PlayIcon />}
              </IconButton>
              <IconButton onClick={handleRefresh} sx={{ color: 'white' }}>
                <RefreshIcon />
              </IconButton>
              <IconButton onClick={onClose} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </motion.div>

        {/* API Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {apiMetrics.map((metric, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={metric.name}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px'
                }}>
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
                      {metric.name}
                    </Typography>
                    <Chip
                      size="small"
                      label={metric.status}
                      sx={{
                        backgroundColor: getStatusColor(metric.status),
                        color: 'white',
                        fontSize: '0.7rem'
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Main Content Tabs */}
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
            <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  '& .MuiTab-root': {
                    color: '#B0BEC5',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  },
                  '& .Mui-selected': {
                    color: '#4CAF50 !important'
                  }
                }}
              >
                <Tab label="Real-time Updates" />
                <Tab label="API Endpoints" />
                <Tab label="Documentation" />
                <Tab label="Analytics" />
              </Tabs>
            </Box>

            <TabPanel value={activeTab} index={0}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Live Data Stream
                </Typography>
                <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 3 }}>
                  Real-time updates from your crypto trading API
                </Typography>
              </Box>

              <TableContainer component={Paper} sx={{ 
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
                maxHeight: '400px'
              }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>Time</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>Type</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>Data</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>Severity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <AnimatePresence>
                      {realTimeUpdates.map((update, index) => (
                        <motion.tr
                          key={update.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <TableCell sx={{ color: '#B0BEC5' }}>
                            {new Date(update.timestamp).toLocaleTimeString()}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getUpdateIcon(update.type)}
                              <Typography variant="body2" sx={{ color: 'white' }}>
                                {update.type.replace('_', ' ')}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: 'white' }}>
                            {update.data.symbol}: ${update.data.price} ({update.data.change}%)
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={update.severity}
                              sx={{
                                backgroundColor: getSeverityColor(update.severity),
                                color: 'white',
                                fontSize: '0.7rem'
                              }}
                            />
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  API Endpoints
                </Typography>
                <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 3 }}>
                  Available endpoints for your crypto trading API
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {apiSpec.endpoints.map((endpoint, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card sx={{ 
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px'
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                              {endpoint.path}
                            </Typography>
                            <Chip 
                              label={endpoint.method} 
                              color={endpoint.method === 'GET' ? 'success' : 'primary'}
                              size="small"
                              sx={{ mb: 2 }}
                            />
                          </Box>
                          <IconButton 
                            onClick={() => handleShowCode(endpoint)}
                            sx={{ color: 'white' }}
                          >
                            <CodeIcon />
                          </IconButton>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 2 }}>
                          {endpoint.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip 
                            label={`${endpoint.crypto_specific.data_freshness} fresh`}
                            size="small"
                            sx={{ backgroundColor: '#4CAF50', color: 'white' }}
                          />
                          <Chip 
                            label={endpoint.crypto_specific.blockchain_verified ? 'Verified' : 'Unverified'}
                            size="small"
                            sx={{ backgroundColor: endpoint.crypto_specific.blockchain_verified ? '#4CAF50' : '#FF9800', color: 'white' }}
                          />
                          <Chip 
                            label={endpoint.crypto_specific.real_time ? 'Real-time' : 'Batch'}
                            size="small"
                            sx={{ backgroundColor: '#2196F3', color: 'white' }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  API Documentation
                </Typography>
                <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 3 }}>
                  Complete documentation for integrating with your crypto trading API
                </Typography>
              </Box>

              <Card sx={{ 
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px'
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                    Quick Start Guide
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 3 }}>
                    1. Get your API key from the dashboard
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 3 }}>
                    2. Use the endpoints below to access real-time crypto data
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 3 }}>
                    3. Subscribe to WebSocket updates for live data streaming
                  </Typography>
                  
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                      Base URL
                    </Typography>
                    <Box sx={{ 
                      background: 'rgba(0, 0, 0, 0.5)',
                      p: 2,
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      color: '#4CAF50'
                    }}>
                      https://api.minam.com/v1/{dataset.name.toLowerCase().replace(/\s+/g, '-')}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </TabPanel>

            <TabPanel value={activeTab} index={3}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Analytics & Performance
                </Typography>
                <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 3 }}>
                  Monitor your API performance and usage analytics
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px'
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                        Request Volume
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#4CAF50', mb: 1 }}>
                        2,847
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                        requests in the last hour
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px'
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                        Active Users
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#2196F3', mb: 1 }}>
                        156
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                        traders using your API
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          </Card>
        </motion.div>
      </Container>

      {/* Code Dialog */}
      <Dialog 
        open={showCodeDialog} 
        onClose={() => setShowCodeDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: 'white', background: '#1A1A2E' }}>
          Code Example - {selectedEndpoint?.path}
        </DialogTitle>
        <DialogContent sx={{ background: '#1A1A2E' }}>
          <Box sx={{ 
            background: '#0F0F23',
            p: 3,
            borderRadius: '8px',
            fontFamily: 'monospace',
            color: '#4CAF50',
            whiteSpace: 'pre-wrap',
            overflow: 'auto'
          }}>
            {selectedEndpoint && generateCodeExample(selectedEndpoint)}
          </Box>
        </DialogContent>
        <DialogActions sx={{ background: '#1A1A2E' }}>
          <Button 
            onClick={() => navigator.clipboard.writeText(selectedEndpoint ? generateCodeExample(selectedEndpoint) : '')}
            startIcon={<CopyIcon />}
            sx={{ color: '#4CAF50' }}
          >
            Copy Code
          </Button>
          <Button onClick={() => setShowCodeDialog(false)} sx={{ color: 'white' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

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

export default RealTimeAPIDashboard;
