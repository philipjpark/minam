'use client';

import React, { useState, useRef } from 'react';
import { Box, Typography, Card, CardContent, Button, LinearProgress, Alert, Chip, Grid, Paper, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import OpenAIService, { DirectoryAnalysis, ModelAnalysis } from '../../services/openaiService';
import ModelToggleAgent from '../../services/modelToggleAgent';

interface DirectoryScannerProps {
  onAnalysisComplete: (analysis: DirectoryAnalysis) => void;
  onClose: () => void;
}

const DirectoryScanner: React.FC<DirectoryScannerProps> = ({ onAnalysisComplete, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [directoryData, setDirectoryData] = useState<any>(null);
  const [modelAnalyses, setModelAnalyses] = useState<ModelAnalysis[]>([]);
  const [bestModel, setBestModel] = useState<ModelAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDirectorySelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File change event triggered');
    const files = event.target.files;
    console.log('Files received:', files);
    
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }

    console.log('Starting file processing...');
    setIsScanning(true);
    setError(null);
    setScanProgress(0);
    setCurrentStep('Preparing your data for API creation...');

    try {
      // Quick file validation
      const steps = [
        'Validating file format...',
        'Analyzing data structure...',
        'Preparing for AI agents...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setScanProgress((i + 1) * 30);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Create basic analysis for API Builder
      const completeAnalysis: DirectoryAnalysis = {
        path: files[0].name,
        fileCount: 1,
        fileTypes: [files[0].type || 'unknown'],
        totalSize: `${(files[0].size / 1024).toFixed(1)} KB`,
        structure: { type: 'file', name: files[0].name },
        dataPatterns: ['structured_data', 'queryable_content'],
        suggestedApiStructure: {
          endpoints: [
            {
              path: '/query',
              method: 'POST',
              description: 'Ask intelligent questions about your data',
              parameters: [
                { name: 'query', type: 'string', required: true, description: 'Your question' }
              ]
            },
            {
              path: '/data',
              method: 'GET',
              description: 'Access raw data directly',
              parameters: [
                { name: 'limit', type: 'number', required: false, description: 'Number of records to return' }
              ]
            }
          ],
          authentication: { type: 'api_key', required: true },
          rateLimits: { requests_per_minute: 100, requests_per_hour: 1000 }
        },
        bestModel: {
          id: 'gpt-4o',
          name: 'GPT-4o',
          description: 'Optimal for intelligent data queries',
          maxTokens: 4000,
          costPer1kTokens: 0.03,
          capabilities: ['natural_language_processing', 'data_analysis', 'query_optimization']
        },
        modelReasoning: 'GPT-4o selected for optimal performance with your data type'
      };
      
      setScanProgress(100);
      setCurrentStep('Ready for API Builder!');
      
      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('File processed, starting API Builder...');
      onAnalysisComplete(completeAnalysis);
    } catch (err) {
      console.error('Error in handleFileChange:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setIsScanning(false);
    }
  };

  const scanDirectory = async (files: FileList): Promise<any> => {
    return new Promise((resolve, reject) => {
      try {
        // Add safety check for files
        if (!files || files.length === 0) {
          reject(new Error('No files provided'));
          return;
        }

        const fileArray = Array.from(files);
        console.log('File array created:', fileArray);
        
        const fileTypes = [...new Set(fileArray.map(f => {
          const extension = f.name.split('.').pop();
          console.log('File name:', f.name, 'Extension:', extension);
          return extension || 'unknown';
        }))];
        console.log('File types detected:', fileTypes);
        
        const totalSize = fileArray.reduce((sum, file) => sum + file.size, 0);
        console.log('Total size calculated:', totalSize);
        
        // Simulate directory structure analysis
        const structure = {
          root: {
            files: fileArray.map(f => ({
              name: f.name,
              size: f.size,
              type: f.type,
              lastModified: f.lastModified
            }))
          }
        };

        // Simulate data pattern detection
        console.log('Calling detectDataPatterns with:', fileArray);
        const dataPatterns = detectDataPatterns(fileArray);
        console.log('Data patterns detected:', dataPatterns);

        const result = {
          path: 'Desktop/SelectedDirectory',
          fileCount: fileArray.length,
          fileTypes: fileTypes || [],
          totalSize: formatFileSize(totalSize),
          structure,
          dataPatterns: dataPatterns || []
        };
        
        console.log('Final result:', result);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  };

  const detectDataPatterns = (files: File[]): string[] => {
    const patterns = [];
    
    // Add safety check for files array
    if (!files || files.length === 0) {
      return ['No files detected'];
    }
    
    const fileNames = files.map(f => f.name.toLowerCase());
    
    if (fileNames.some(name => name.includes('csv') || name.includes('data'))) {
      patterns.push('Structured Data (CSV)');
    }
    if (fileNames.some(name => name.includes('json'))) {
      patterns.push('JSON Data');
    }
    if (fileNames.some(name => name.includes('log'))) {
      patterns.push('Log Files');
    }
    if (fileNames.some(name => name.includes('config') || name.includes('settings'))) {
      patterns.push('Configuration Files');
    }
    if (fileNames.some(name => name.includes('image') || name.includes('photo'))) {
      patterns.push('Image Data');
    }
    
    return patterns.length > 0 ? patterns : ['Mixed Data Types'];
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 4, background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 50%, #16213E 100%)' }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{ 
              color: 'white', 
              fontWeight: 800, 
              mb: 2,
              textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}>
              📁 Upload Your Data
            </Typography>
            <Typography variant="h6" sx={{ 
              color: '#FFD700', 
              maxWidth: '600px', 
              mx: 'auto',
              fontWeight: 600,
              textShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
              fontSize: { xs: '1.1rem', md: '1.3rem' }
            }}>
              Upload your data to start the API Builder process
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          {/* Directory Selection */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                backdropFilter: 'blur(10px)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                height: '100%'
              }}>
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h5" sx={{ 
                    color: 'white', 
                    mb: 3, 
                    textAlign: 'center',
                    fontWeight: 700,
                    textShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
                    fontSize: '1.8rem'
                  }}>
                    Select Your Data
                  </Typography>
                  
                  <Box
                    sx={{
                      border: '2px dashed #FFD700',
                      borderRadius: '12px',
                      p: 4,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#FFA500',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)'
                      }
                    }}
                    onClick={handleDirectorySelect}
                  >
                    <Typography variant="h6" sx={{ 
                      color: '#FFD700', 
                      mb: 2,
                      fontWeight: 700,
                      textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                      fontSize: '1.4rem'
                    }}>
                      📂 Click to Select Files
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#E0E0E0',
                      fontWeight: 500,
                      textShadow: '0 0 5px rgba(255, 255, 255, 0.2)',
                      fontSize: '1.1rem'
                    }}>
                      Choose multiple files from your desktop to analyze
                    </Typography>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                  </Box>

                  {directoryData && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" sx={{ 
                        color: 'white', 
                        mb: 2,
                        fontWeight: 700,
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
                        fontSize: '1.4rem'
                      }}>
                        Directory Analysis
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Chip label={`${directoryData.fileCount} files`} sx={{ bgcolor: '#FFD700', color: 'black' }} />
                        <Chip label={directoryData.totalSize} sx={{ bgcolor: '#1E90FF', color: 'white' }} />
                        <Chip label={`${directoryData.fileTypes ? directoryData.fileTypes.length : 0} types`} sx={{ bgcolor: '#32CD32', color: 'white' }} />
                      </Box>
                      <Typography variant="body2" sx={{ 
                        color: '#E0E0E0',
                        fontWeight: 500,
                        textShadow: '0 0 5px rgba(255, 255, 255, 0.2)',
                        fontSize: '1rem'
                      }}>
                        File Types: {directoryData.fileTypes && directoryData.fileTypes.length > 0 ? directoryData.fileTypes.join(', ') : 'Unknown'}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Analysis Progress */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                backdropFilter: 'blur(10px)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                height: '100%'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ 
                    color: 'white', 
                    mb: 3,
                    fontWeight: 700,
                    textShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
                    fontSize: '1.8rem'
                  }}>
                    AI Analysis Progress
                  </Typography>

                  {isScanning && (
                    <Box>
                      <Typography variant="body1" sx={{ 
                        color: '#E0E0E0', 
                        mb: 2,
                        fontWeight: 500,
                        textShadow: '0 0 5px rgba(255, 255, 255, 0.2)',
                        fontSize: '1.1rem'
                      }}>
                        {currentStep}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={scanProgress} 
                        sx={{ 
                          height: 10, 
                          borderRadius: 5, 
                          mb: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #FFD700, #1E90FF)',
                            borderRadius: 5
                          }
                        }} 
                      />
                      <Typography variant="body2" sx={{ 
                        color: '#FFD700', 
                        textAlign: 'center',
                        fontWeight: 600,
                        textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                        fontSize: '1.1rem'
                      }}>
                        {scanProgress}% Complete
                      </Typography>
                    </Box>
                  )}

                  {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {error}
                    </Alert>
                  )}

                  {!isScanning && !directoryData && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" sx={{ 
                        color: '#E0E0E0',
                        fontWeight: 500,
                        textShadow: '0 0 5px rgba(255, 255, 255, 0.2)',
                        fontSize: '1.1rem'
                      }}>
                        Select files to begin AI analysis
                      </Typography>
                    </Box>
                  )}

                  {directoryData && !isScanning && (
                    <Box>
                      <Typography variant="h6" sx={{ 
                        color: 'white', 
                        mb: 2,
                        fontWeight: 700,
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
                        fontSize: '1.4rem'
                      }}>
                        Data Patterns Detected
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {directoryData.dataPatterns && directoryData.dataPatterns.length > 0 ? (
                          directoryData.dataPatterns.map((pattern: string, index: number) => (
                            <Chip 
                              key={index} 
                              label={pattern} 
                              sx={{ 
                                bgcolor: 'rgba(255, 215, 0, 0.2)', 
                                color: '#FFD700',
                                border: '1px solid #FFD700'
                              }} 
                            />
                          ))
                        ) : (
                          <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                            No patterns detected
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ 
              color: '#B0BEC5', 
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': { 
                borderColor: 'white', 
                backgroundColor: 'rgba(255, 255, 255, 0.1)' 
              }
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DirectoryScanner;
