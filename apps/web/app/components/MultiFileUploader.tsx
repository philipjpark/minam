'use client';

import React, { useState, useCallback } from 'react';
import { Box, Typography, Card, CardContent, Button, Chip, IconButton, Alert } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadedFile {
  id: string;
  file: File;
  data: any;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
}

interface MultiFileUploaderProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  onClose: () => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

const MultiFileUploader: React.FC<MultiFileUploaderProps> = ({ 
  onFilesUploaded, 
  onClose, 
  maxFiles = 10,
  acceptedTypes = ['.xlsx', '.xls', '.csv', '.pdf']
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setIsProcessing(true);
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

    setIsProcessing(false);
  }, [uploadedFiles.length, maxFiles]);

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

  const handleContinue = () => {
    const completedFiles = uploadedFiles.filter(f => f.status === 'completed');
    onFilesUploaded(completedFiles);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return '📄';
      case 'xlsx': case 'xls': return '📊';
      case 'csv': return '📈';
      default: return '📁';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'error': return '#F44336';
      case 'processing': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 50%, #16213E 100%)',
      p: 4
    }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ 
            color: '#FFD700', 
            fontWeight: 'bold', 
            mb: 2,
            textShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
          }}>
            📁 Multi-File Upload
          </Typography>
          <Typography variant="h6" sx={{ color: '#B0BEC5', mb: 3 }}>
            Upload multiple files to create intelligent connections and cross-file analysis
          </Typography>
          <Typography variant="body2" sx={{ color: '#757575' }}>
            Supported formats: Excel (.xlsx, .xls), CSV (.csv), PDF (.pdf) • Max {maxFiles} files • 10MB per file
          </Typography>
        </Box>

        {/* Upload Area */}
        <Card sx={{
          mb: 4,
          background: 'rgba(255, 255, 255, 0.08)',
          border: `2px dashed ${isDragActive ? '#FFD700' : 'rgba(255, 255, 255, 0.2)'}`,
          borderRadius: '20px',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: '#FFD700',
            background: 'rgba(255, 215, 0, 0.05)'
          }
        }}>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <Box {...getRootProps()}>
              <input {...getInputProps()} />
              <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
                {isDragActive ? '📂 Drop files here' : '📁 Drag & drop files here'}
              </Typography>
              <Typography variant="h6" sx={{ color: '#B0BEC5', mb: 3 }}>
                or click to browse files
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  color: '#FFD700',
                  borderColor: '#FFD700',
                  '&:hover': { borderColor: '#FFA500', color: '#FFA500' },
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem'
                }}
              >
                Select Files
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* File List */}
        {uploadedFiles.length > 0 && (
          <Card sx={{
            mb: 4,
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                📋 Uploaded Files ({uploadedFiles.length})
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <AnimatePresence>
                  {uploadedFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        p: 2
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="h5">
                              {getFileIcon(file.file.name)}
                            </Typography>
                            <Box>
                              <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                                {file.file.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#B0BEC5' }}>
                                {(file.file.size / 1024 / 1024).toFixed(2)} MB
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip
                              label={file.status}
                              size="small"
                              sx={{
                                backgroundColor: getStatusColor(file.status),
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                            
                            {file.status === 'uploading' && (
                              <Typography variant="caption" sx={{ color: '#B0BEC5' }}>
                                {file.progress}%
                              </Typography>
                            )}
                            
                            <IconButton
                              onClick={() => removeFile(file.id)}
                              sx={{ color: '#F44336' }}
                              size="small"
                            >
                              ✕
                            </IconButton>
                          </Box>
                        </Box>
                        
                        {file.error && (
                          <Alert severity="error" sx={{ mt: 1 }}>
                            {file.error}
                          </Alert>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              color: '#B0BEC5',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': { borderColor: '#B0BEC5' },
              py: 1.5,
              px: 4
            }}
          >
            Cancel
          </Button>
          
          <Button
            variant="contained"
            onClick={handleContinue}
            disabled={uploadedFiles.filter(f => f.status === 'completed').length === 0 || isProcessing}
            sx={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)' },
              color: 'white',
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            {isProcessing ? 'Processing...' : `Continue with ${uploadedFiles.filter(f => f.status === 'completed').length} files`}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MultiFileUploader;
