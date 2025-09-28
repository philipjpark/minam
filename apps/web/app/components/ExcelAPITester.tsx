'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Alert, CircularProgress, Chip, LinearProgress } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { parseExcelToText, formatExcelDataForAI, extractDataInsights, ExcelData } from '../utils/excelParser';

interface ExcelAPITesterProps {
  apiUrl: string;
  apiKey: string;
  onClose: () => void;
  preUploadedFile?: File;
  uploadedFiles?: any[];
}

const ExcelAPITester: React.FC<ExcelAPITesterProps> = ({ apiUrl, apiKey, onClose, preUploadedFile, uploadedFiles = [] }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(preUploadedFile || null);
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isJsonFormat, setIsJsonFormat] = useState(false);

  // Auto-process pre-uploaded file
  useEffect(() => {
    if (preUploadedFile && !excelData) {
      processFile(preUploadedFile);
    }
  }, [preUploadedFile, excelData]);

  const parsePDFToText = async (file: File): Promise<ExcelData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          // For now, create a mock PDF data structure that works with the AI
          // In a production environment, you would implement proper PDF text extraction
          const mockPDFData: ExcelData = {
            fileName: file.name,
            sheets: [{
              name: 'PDF Content',
              data: [
                ['PDF Document: ' + file.name],
                ['File Size: ' + (file.size / 1024 / 1024).toFixed(2) + ' MB'],
                ['Document Type: PDF'],
                ['Status: Ready for AI analysis'],
                ['Note: PDF content will be analyzed by AI when you ask questions']
              ],
              rows: 5,
              columns: 1
            }],
            totalRows: 5,
            totalColumns: 1,
            fileSize: file.size
          };

          resolve(mockPDFData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const processFile = async (file: File) => {
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

      // Parse file based on type
      let parsedData: ExcelData;
      if (file.type === 'application/pdf') {
        parsedData = await parsePDFToText(file);
      } else {
        parsedData = await parseExcelToText(file);
      }
      setExcelData(parsedData);
      
      setUploadProgress(100);
      clearInterval(progressInterval);
      setIsProcessing(false);
    } catch (err: any) {
      setError(`Failed to process file: ${err.message}`);
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    await processFile(file);
  }, []);

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
        if (response.response) {
          formatted += `📊 **Analysis Result:**\n${response.response}\n\n`;
        }
        
        // Add query information
        if (response.query) {
          formatted += `❓ **Your Question:** ${response.query}\n\n`;
        }
        
        // Add file information
        if (response.fileName) {
          formatted += `📁 **File:** ${response.fileName}\n\n`;
        }
        
        // Add model information
        if (response.model) {
          formatted += `🤖 **AI Model Used:** ${response.model}\n`;
        }
        
        // Add model reasoning
        if (response.modelReasoning) {
          formatted += `💭 **Why This Model:** ${response.modelReasoning}\n`;
        }
        
        // Add timestamp
        if (response.timestamp) {
          const date = new Date(response.timestamp);
          formatted += `⏰ **Generated:** ${date.toLocaleString()}\n`;
        }
        
        return formatted.trim();
      }
      
      return JSON.stringify(response, null, 2);
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
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB max
  });

  const testExcelQuery = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Convert uploaded files to the format expected by multi-file agent
      const files = uploadedFiles.map(file => ({
        id: file.id,
        fileName: file.file.name,
        fileType: file.file.type.split('/')[1] || 'unknown',
        data: file.data,
        uploadTime: new Date().toISOString()
      }));

      const res = await fetch('/api/multi-file-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          files: files,
          conversationHistory: [] // Could be enhanced to maintain conversation history
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

        <Typography variant="h3" gutterBottom sx={{ 
          color: 'white', 
          mb: 3, 
          textAlign: 'center',
          fontWeight: 800,
          textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🧠 Your API Sandbox
        </Typography>
        <Typography variant="h6" sx={{ 
          color: '#FFD700', 
          mb: 4, 
          textAlign: 'center',
          fontWeight: 600,
          textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
        }}>
          Upload a file and ask questions about this API.
        </Typography>

        <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 2 }}>
          <strong>API URL:</strong> <span style={{ color: '#FFD700', wordBreak: 'break-all' }}>{apiUrl}</span>
        </Typography>
        <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 4 }}>
          <strong>API Key:</strong> <span style={{ color: '#FFD700', wordBreak: 'break-all' }}>{apiKey}</span>
        </Typography>

        {/* File Upload Section */}
        <Card sx={{ 
          mb: 4, 
          bgcolor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          <CardContent>
            <Typography variant="h5" sx={{ 
              color: '#FFD700', 
              mb: 2,
              fontWeight: 700,
              textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
            }}>
              📊 Upload File...
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
                  {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#B0BEC5', mb: 2 }}>
                  or click to browse files
                </Typography>
                <Typography variant="caption" sx={{ color: '#B0BEC5' }}>
                  Supports XLSX, XLS, CSV, PDF files (Max 10MB)
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
          <Card sx={{ 
            mb: 4, 
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <CardContent>
              <Typography variant="h5" sx={{ 
                color: '#FFD700', 
                mb: 2,
                fontWeight: 700,
                textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
              }}>
                🤖 Ask Questions About Your Data
              </Typography>
              <TextField
                fullWidth
                label="Ask a question about your data (e.g., 'What's the average salary by department?')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {response && (
          <Card sx={{ 
            mt: 4, 
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ 
                  color: '#FFD700', 
                  fontWeight: 700,
                  textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                }}>
                  🤖 AI Agent Response:
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setIsJsonFormat(!isJsonFormat)}
                  sx={{
                    color: isJsonFormat ? '#FFD700' : '#B0BEC5',
                    borderColor: isJsonFormat ? '#FFD700' : 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: '#FFD700',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)'
                    },
                    fontSize: '0.8rem',
                    px: 2,
                    py: 0.5
                  }}
                >
                  {isJsonFormat ? '👤 Human View' : '📄 JSON View'}
                </Button>
              </Box>
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
                <pre style={{ 
                  color: '#E0E0E0', 
                  whiteSpace: 'pre-wrap', 
                  wordBreak: 'break-word',
                  fontFamily: isJsonFormat ? 'monospace' : 'inherit',
                  lineHeight: isJsonFormat ? 1.4 : 1.6
                }}>
                  {formatResponseForDisplay(response)}
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
