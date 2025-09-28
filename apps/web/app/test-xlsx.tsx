'use client';

import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const TestXLSX: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');

  const testXLSXImport = async () => {
    try {
      // Test dynamic import
      const xlsxModule = await import('xlsx');
      const XLSX = xlsxModule.default || xlsxModule;
      
      if (!XLSX || typeof XLSX.read !== 'function') {
        setTestResult('❌ XLSX library not properly loaded');
        return;
      }

      // Test static import
      const staticXLSX = require('xlsx');
      if (!staticXLSX || typeof staticXLSX.read !== 'function') {
        setTestResult('❌ Static XLSX import failed');
        return;
      }

      setTestResult('✅ XLSX library is working properly');
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, color: 'white' }}>
        XLSX Library Test
      </Typography>
      
      <Button
        onClick={testXLSXImport}
        variant="contained"
        sx={{ mb: 3 }}
      >
        Test XLSX Import
      </Button>
      
      {testResult && (
        <Typography variant="body1" sx={{ color: 'white' }}>
          {testResult}
        </Typography>
      )}
    </Box>
  );
};

export default TestXLSX;
