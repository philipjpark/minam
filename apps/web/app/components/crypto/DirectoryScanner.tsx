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
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsScanning(true);
    setError(null);
    setScanProgress(0);
    setCurrentStep('Scanning directory structure...');

    try {
      // Simulate directory scanning
      const directoryInfo = await scanDirectory(files);
      setDirectoryData(directoryInfo);
      
      setScanProgress(25);
      setCurrentStep('Analyzing data patterns with AI models...');
      
      // Use Model Toggle Agent to select optimal model
      const modelRecommendation = await ModelToggleAgent.getDetailedRecommendation(directoryInfo);
      
      setScanProgress(50);
      setCurrentStep(`Selected ${modelRecommendation.recommendation.recommendedModel} - ${modelRecommendation.recommendation.reasoning}`);
      
      // Analyze with the recommended model
      const analysis = await OpenAIService.analyzeDirectory(directoryInfo);
      
      setScanProgress(75);
      setCurrentStep('Generating API specification...');
      
      // Generate API spec
      const apiSpec = await OpenAIService.generateApiSpecification(analysis);
      
      setScanProgress(100);
      setCurrentStep('Analysis complete!');
      
      // Complete analysis with model recommendation details
      const completeAnalysis: DirectoryAnalysis = {
        ...analysis,
        suggestedApiStructure: apiSpec,
        bestModel: {
          id: modelRecommendation.recommendation.recommendedModel,
          name: modelRecommendation.recommendation.recommendedModel,
          description: `AI-selected optimal model with ${Math.round(modelRecommendation.recommendation.confidence * 100)}% confidence`,
          maxTokens: 200000,
          costPer1kTokens: 0.01,
          capabilities: ['ai-optimized', 'auto-selected']
        },
        modelReasoning: modelRecommendation.recommendation.reasoning
      };
      
      onAnalysisComplete(completeAnalysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setIsScanning(false);
    }
  };

  const scanDirectory = async (files: FileList): Promise<any> => {
    return new Promise((resolve) => {
      const fileArray = Array.from(files);
      const fileTypes = [...new Set(fileArray.map(f => f.name.split('.').pop() || 'unknown'))];
      const totalSize = fileArray.reduce((sum, file) => sum + file.size, 0);
      
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
      const dataPatterns = detectDataPatterns(fileArray);

      resolve({
        path: 'Desktop/SelectedDirectory',
        fileCount: fileArray.length,
        fileTypes,
        totalSize: formatFileSize(totalSize),
        structure,
        dataPatterns
      });
    });
  };

  const detectDataPatterns = (files: File[]): string[] => {
    const patterns = [];
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
            <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
              📁 Directory Scanner
            </Typography>
            <Typography variant="h6" sx={{ color: '#B0BEC5', maxWidth: '600px', mx: 'auto' }}>
              Select files from your desktop to analyze and transform into a monetizable API
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
                  <Typography variant="h5" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
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
                    <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                      📂 Click to Select Files
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
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
                      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                        Directory Analysis
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Chip label={`${directoryData.fileCount} files`} sx={{ bgcolor: '#FFD700', color: 'black' }} />
                        <Chip label={directoryData.totalSize} sx={{ bgcolor: '#1E90FF', color: 'white' }} />
                        <Chip label={`${directoryData.fileTypes.length} types`} sx={{ bgcolor: '#32CD32', color: 'white' }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                        File Types: {directoryData.fileTypes.join(', ')}
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
                  <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
                    AI Analysis Progress
                  </Typography>

                  {isScanning && (
                    <Box>
                      <Typography variant="body1" sx={{ color: '#B0BEC5', mb: 2 }}>
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
                      <Typography variant="body2" sx={{ color: '#FFD700', textAlign: 'center' }}>
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
                      <Typography variant="body1" sx={{ color: '#B0BEC5' }}>
                        Select files to begin AI analysis
                      </Typography>
                    </Box>
                  )}

                  {directoryData && !isScanning && (
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                        Data Patterns Detected
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {directoryData.dataPatterns.map((pattern: string, index: number) => (
                          <Chip 
                            key={index} 
                            label={pattern} 
                            sx={{ 
                              bgcolor: 'rgba(255, 215, 0, 0.2)', 
                              color: '#FFD700',
                              border: '1px solid #FFD700'
                            }} 
                          />
                        ))}
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
