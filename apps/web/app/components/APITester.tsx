'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Alert, CircularProgress } from '@mui/material';

interface APITesterProps {
  apiUrl: string;
  apiKey: string;
  onClose: () => void;
}

const APITester: React.FC<APITesterProps> = ({ apiUrl, apiKey, onClose }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isJsonFormat, setIsJsonFormat] = useState(false);

  const testQuery = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Use the mock API endpoint
      const res = await fetch('/api/mock-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testRawData = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Use the mock API endpoint
      const res = await fetch('/api/mock-api?limit=5', {
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatResponseForDisplay = (response: any) => {
    if (isJsonFormat) {
      return typeof response === 'string' ? response : JSON.stringify(response, null, 2);
    } else {
      // Human-readable format
      if (typeof response === 'string') {
        return response;
      }
      
      if (response && typeof response === 'object') {
        let formatted = '';
        
        // Add main response content
        if (response.response || response.message) {
          formatted += `📊 **API Response:**\n${response.response || response.message}\n\n`;
        }
        
        // Add query information
        if (response.query) {
          formatted += `❓ **Your Query:** ${response.query}\n\n`;
        }
        
        // Add API information
        if (response.apiUrl || response.endpoint) {
          formatted += `🔗 **API Endpoint:** ${response.apiUrl || response.endpoint}\n`;
        }
        
        // Add status information
        if (response.status) {
          formatted += `✅ **Status:** ${response.status}\n`;
        }
        
        // Add timestamp
        if (response.timestamp) {
          const date = new Date(response.timestamp);
          formatted += `⏰ **Generated:** ${date.toLocaleString()}\n`;
        }
        
        // Add any additional data
        if (response.data) {
          formatted += `\n📋 **Additional Data:**\n${JSON.stringify(response.data, null, 2)}\n`;
        }
        
        return formatted.trim();
      }
      
      return JSON.stringify(response, null, 2);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 800,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 50%, #16213E 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
              🧪 Test Your API
            </Typography>
            <Button
              onClick={onClose}
              sx={{ color: '#B0BEC5', minWidth: 'auto', p: 1 }}
            >
              ✕
            </Button>
          </Box>

          <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 3 }}>
            API URL: <span style={{ color: 'white', fontFamily: 'monospace' }}>{apiUrl}</span>
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              Test Intelligent Query (RAG)
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Ask a question about your data..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && testQuery()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#4CAF50' },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={testQuery}
                disabled={loading || !query.trim()}
                sx={{
                  background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                  minWidth: 120,
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Query'}
              </Button>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              Test Raw Data Access
            </Typography>
            <Button
              variant="outlined"
              onClick={testRawData}
              disabled={loading}
              sx={{
                color: '#4CAF50',
                borderColor: '#4CAF50',
                '&:hover': { borderColor: '#4CAF50', backgroundColor: 'rgba(76, 175, 80, 0.1)' },
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Get Raw Data'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {response && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  API Response:
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setIsJsonFormat(!isJsonFormat)}
                  sx={{
                    color: isJsonFormat ? '#4CAF50' : '#B0BEC5',
                    borderColor: isJsonFormat ? '#4CAF50' : 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: '#4CAF50',
                      backgroundColor: 'rgba(76, 175, 80, 0.1)'
                    },
                    fontSize: '0.8rem',
                    px: 2,
                    py: 0.5
                  }}
                >
                  {isJsonFormat ? '👤 Human View' : '📄 JSON View'}
                </Button>
              </Box>
              <Card sx={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <CardContent>
                  <pre style={{ 
                    color: 'white', 
                    fontSize: '14px', 
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: isJsonFormat ? 'monospace' : 'inherit',
                    lineHeight: isJsonFormat ? 1.4 : 1.6
                  }}>
                    {formatResponseForDisplay(response)}
                  </pre>
                </CardContent>
              </Card>
            </Box>
          )}

          <Box sx={{ mt: 4, p: 2, background: 'rgba(76, 175, 80, 0.1)', borderRadius: 2, border: '1px solid rgba(76, 175, 80, 0.3)' }}>
            <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 'bold', mb: 1 }}>
              💡 How to use this API:
            </Typography>
            <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
              • <strong>Intelligent Query:</strong> Ask natural language questions about your data
            </Typography>
            <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 1 }}>
              • <strong>Raw Data:</strong> Access the original data directly
            </Typography>
            <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
              • <strong>Integration:</strong> Use this API in your apps, trading bots, or research tools
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default APITester;
