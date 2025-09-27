'use client';

import React, { useState, useCallback } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Alert, CircularProgress, Chip, LinearProgress } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { parseExcelToText, formatExcelDataForAI, extractDataInsights, ExcelData } from '../utils/excelParser';

interface ExcelAPITesterProps {
  apiUrl: string;
  apiKey: string;
  onClose: () => void;
}

const ExcelAPITester: React.FC<ExcelAPITesterProps> = ({ apiUrl, apiKey, onClose }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setError(null);
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Parse Excel file
      const parsedData = await parseExcelToText(file);
      setExcelData(parsedData);
      
      setUploadProgress(100);
      clearInterval(progressInterval);
      setIsProcessing(false);
    } catch (err: any) {
      setError(`Failed to process Excel file: ${err.message}`);
      setIsProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB max
  });

  const testExcelQuery = async () => {
    if (!query.trim() || !excelData) return;
    
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const formattedData = formatExcelDataForAI(excelData);
      
      const res = await fetch('/api/excel-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: query.trim(),
          fileContent: formattedData,
          fileName: excelData.fileName
        }),
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

  const clearFile = () => {
    setUploadedFile(null);
    setExcelData(null);
    setResponse(null);
    setError(null);
    setUploadProgress(0);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        p: 2,
      }}
    >
      <Box
        sx={{
          bgcolor: '#1A1A2E',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
          p: 4,
          maxWidth: '1200px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          border: '1px solid rgba(255, 215, 0, 0.3)',
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: '#B0BEC5',
            '&:hover': { color: '#FFD700' },
            minWidth: 'auto',
            p: 1,
          }}
        >
          ✕
        </Button>

        <Typography variant="h4" gutterBottom sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
          🧠 Excel AI Agent Sandbox
        </Typography>
        <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 4, textAlign: 'center' }}>
          Upload an Excel file and ask questions about your data using our AI agent
        </Typography>

        <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 2 }}>
          <strong>API URL:</strong> <span style={{ color: '#FFD700', wordBreak: 'break-all' }}>{apiUrl}</span>
        </Typography>
        <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 4 }}>
          <strong>API Key:</strong> <span style={{ color: '#FFD700', wordBreak: 'break-all' }}>{apiKey}</span>
        </Typography>

        {/* File Upload Section */}
        <Card sx={{ mb: 4, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              📊 Upload Excel File
            </Typography>
            
            {!uploadedFile ? (
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
                  },
                  mb: 2
                }}
              >
                <input {...getInputProps()} />
                <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                  {isDragActive ? 'Drop your Excel file here' : 'Drag & drop your Excel file here'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 2 }}>
                  or click to browse files
                </Typography>
                <Typography variant="caption" sx={{ color: '#B0BEC5' }}>
                  Supports XLSX, XLS, CSV files (Max 10MB)
                </Typography>
              </Box>
            ) : (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                    📄 {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </Typography>
                  <Button
                    onClick={clearFile}
                    sx={{ color: '#FF6B6B', minWidth: 'auto', p: 1 }}
                  >
                    Remove
                  </Button>
                </Box>
                
                {isProcessing && (
                  <Box sx={{ mb: 2 }}>
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
                      Processing... {uploadProgress}%
                    </Typography>
                  </Box>
                )}

                {excelData && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ color: '#4CAF50', mb: 1 }}>
                      ✅ File processed successfully
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label={`${excelData.sheets.length} sheets`} size="small" sx={{ bgcolor: '#4CAF50', color: 'white' }} />
                      <Chip label={`${excelData.totalRows} rows`} size="small" sx={{ bgcolor: '#2196F3', color: 'white' }} />
                      <Chip label={`${excelData.totalColumns} columns`} size="small" sx={{ bgcolor: '#FF9800', color: 'white' }} />
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Query Section */}
        {excelData && (
          <Card sx={{ mb: 4, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                🤖 Ask Questions About Your Data
              </Typography>
              <TextField
                fullWidth
                label="Ask a question about your Excel data (e.g., 'What's the average salary by department?')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ mb: 2 }}
                multiline
                rows={3}
              />
              <Button
                variant="contained"
                onClick={testExcelQuery}
                disabled={loading || !query.trim()}
                sx={{
                  background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)' },
                  color: 'white',
                  py: 1.5,
                  px: 4,
                  mr: 2,
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Ask AI Agent'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Raw Data Test */}
        <Card sx={{ mb: 4, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              📊 Test Raw Data Access
            </Typography>
            <Button
              variant="outlined"
              onClick={testRawData}
              disabled={loading}
              sx={{
                color: '#FFD700',
                borderColor: '#FFD700',
                '&:hover': { borderColor: '#FFA500', color: '#FFA500' },
                py: 1.5,
                px: 4,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Get Raw Data (limit=5)'}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {response && (
          <Card sx={{ mt: 4, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                🤖 AI Agent Response:
              </Typography>
              <Box
                sx={{
                  bgcolor: '#0F0F23',
                  p: 3,
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  maxHeight: '400px',
                  overflowY: 'auto',
                }}
              >
                <pre style={{ color: '#E0E0E0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {typeof response === 'string' ? response : JSON.stringify(response, null, 2)}
                </pre>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default ExcelAPITester;
