'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';

const TestApiKey: React.FC = () => {
  const [apiKeyStatus, setApiKeyStatus] = useState<string>('Checking...');
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    // Check if API key is available
    const checkApiKey = () => {
      // Try to access the API key from different sources
      const serverApiKey = process.env.OPENAI_API_KEY;
      const publicApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      
      console.log('Server API Key:', serverApiKey ? 'Set' : 'Not set');
      console.log('Public API Key:', publicApiKey ? 'Set' : 'Not set');
      
      if (serverApiKey) {
        setApiKeyStatus('✅ Server API Key is set');
      } else if (publicApiKey) {
        setApiKeyStatus('✅ Public API Key is set');
      } else {
        setApiKeyStatus('❌ No API Key found');
      }
    };

    checkApiKey();
  }, []);

  const testApiCall = async () => {
    setTestResult('Testing API call...');
    
    try {
      const response = await fetch('/api/test-openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hello, this is a test message'
        })
      });

      if (response.ok) {
        const result = await response.json();
        setTestResult(`✅ API call successful: ${result.message}`);
      } else {
        const error = await response.text();
        setTestResult(`❌ API call failed: ${error}`);
      }
    } catch (error) {
      setTestResult(`❌ API call error: ${error}`);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 8, bgcolor: '#1A1A2E', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
        API Key Test
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          This component tests if the OpenAI API key is properly configured.
        </Typography>
      </Alert>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          API Key Status:
        </Typography>
        <Typography variant="body1" sx={{ color: '#B0BEC5' }}>
          {apiKeyStatus}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          onClick={testApiCall}
          sx={{
            bgcolor: '#FFD700',
            color: 'black',
            '&:hover': { bgcolor: '#FFA500' }
          }}
        >
          Test API Call
        </Button>
      </Box>

      {testResult && (
        <Box>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            Test Result:
          </Typography>
          <Typography variant="body1" sx={{ color: '#B0BEC5' }}>
            {testResult}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TestApiKey;
