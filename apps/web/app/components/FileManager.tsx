'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Chip, IconButton, Tooltip, Badge } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface FileData {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  sheets: Array<{
    name: string;
    data: string[][];
    rows: number;
    columns: number;
  }>;
  totalRows: number;
  totalColumns: number;
  uploadTime: Date;
  tags: string[];
  connections: string[]; // IDs of connected files
}

interface FileManagerProps {
  files: FileData[];
  onFileSelect: (fileId: string) => void;
  onFileRemove: (fileId: string) => void;
  onAnalyzeConnections: () => void;
  selectedFileId?: string;
}

const FileManager: React.FC<FileManagerProps> = ({
  files,
  onFileSelect,
  onFileRemove,
  onAnalyzeConnections,
  selectedFileId
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date' | 'type'>('date');
  const [filterType, setFilterType] = useState<string>('all');

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return '📄';
      case 'xlsx': case 'xls': return '📊';
      case 'csv': return '📈';
      default: return '📁';
    }
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return '#F44336';
      case 'xlsx': case 'xls': return '#4CAF50';
      case 'csv': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const sortedFiles = [...files].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.fileName.localeCompare(b.fileName);
      case 'size':
        return b.fileSize - a.fileSize;
      case 'date':
        return b.uploadTime.getTime() - a.uploadTime.getTime();
      case 'type':
        return a.fileType.localeCompare(b.fileType);
      default:
        return 0;
    }
  });

  const filteredFiles = filterType === 'all' 
    ? sortedFiles 
    : sortedFiles.filter(file => file.fileType.toLowerCase() === filterType.toLowerCase());

  const fileTypes = [...new Set(files.map(f => f.fileType))];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
            📁 File Manager
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant={viewMode === 'grid' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('grid')}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              ⊞
            </Button>
            <Button
              size="small"
              variant={viewMode === 'list' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('list')}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              ☰
            </Button>
          </Box>
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#B0BEC5', alignSelf: 'center' }}>
              Sort by:
            </Typography>
            {['name', 'size', 'date', 'type'].map((option) => (
              <Button
                key={option}
                size="small"
                variant={sortBy === option ? 'contained' : 'outlined'}
                onClick={() => setSortBy(option as any)}
                sx={{ 
                  minWidth: 'auto', 
                  px: 2,
                  textTransform: 'capitalize',
                  fontSize: '0.8rem'
                }}
              >
                {option}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#B0BEC5', alignSelf: 'center' }}>
              Filter:
            </Typography>
            <Button
              size="small"
              variant={filterType === 'all' ? 'contained' : 'outlined'}
              onClick={() => setFilterType('all')}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              All
            </Button>
            {fileTypes.map((type) => (
              <Button
                key={type}
                size="small"
                variant={filterType === type ? 'contained' : 'outlined'}
                onClick={() => setFilterType(type)}
                sx={{ 
                  minWidth: 'auto', 
                  px: 2,
                  textTransform: 'uppercase',
                  fontSize: '0.8rem'
                }}
              >
                {type}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Connection Analysis Button */}
        {files.length > 1 && (
          <Button
            variant="contained"
            onClick={onAnalyzeConnections}
            sx={{
              background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)' },
              color: 'white',
              mb: 2
            }}
          >
            🔗 Analyze File Connections
          </Button>
        )}
      </Box>

      {/* File List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {filteredFiles.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ color: '#B0BEC5', mb: 1 }}>
              No files found
            </Typography>
            <Typography variant="body2" sx={{ color: '#757575' }}>
              Upload some files to get started
            </Typography>
          </Box>
        ) : (
          <Box sx={{
            display: viewMode === 'grid' ? 'grid' : 'flex',
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr',
            flexDirection: viewMode === 'list' ? 'column' : 'row',
            gap: 2
          }}>
            <AnimatePresence>
              {filteredFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    sx={{
                      background: selectedFileId === file.id 
                        ? 'rgba(255, 215, 0, 0.1)' 
                        : 'rgba(255, 255, 255, 0.08)',
                      border: selectedFileId === file.id 
                        ? '2px solid #FFD700' 
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.12)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
                      }
                    }}
                    onClick={() => onFileSelect(file.id)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                          <Typography variant="h4">
                            {getFileIcon(file.fileType)}
                          </Typography>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                color: 'white', 
                                fontWeight: 500,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {file.fileName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#B0BEC5' }}>
                              {formatFileSize(file.fileSize)} • {formatDate(file.uploadTime)}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={file.fileType.toUpperCase()}
                            size="small"
                            sx={{
                              backgroundColor: getFileTypeColor(file.fileType),
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '0.7rem'
                            }}
                          />
                          
                          {file.connections.length > 0 && (
                            <Tooltip title={`Connected to ${file.connections.length} files`}>
                              <Badge badgeContent={file.connections.length} color="primary">
                                <IconButton size="small" sx={{ color: '#4CAF50' }}>
                                  🔗
                                </IconButton>
                              </Badge>
                            </Tooltip>
                          )}
                          
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onFileRemove(file.id);
                            }}
                            sx={{ color: '#F44336' }}
                          >
                            ✕
                          </IconButton>
                        </Box>
                      </Box>

                      {/* File Stats */}
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Typography variant="caption" sx={{ color: '#B0BEC5' }}>
                          📊 {file.totalRows.toLocaleString()} rows
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#B0BEC5' }}>
                          📋 {file.totalColumns} columns
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#B0BEC5' }}>
                          📄 {file.sheets.length} sheets
                        </Typography>
                      </Box>

                      {/* Tags */}
                      {file.tags.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {file.tags.slice(0, 3).map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(255, 215, 0, 0.2)',
                                color: '#FFD700',
                                fontSize: '0.7rem',
                                height: '20px'
                              }}
                            />
                          ))}
                          {file.tags.length > 3 && (
                            <Typography variant="caption" sx={{ color: '#B0BEC5', alignSelf: 'center' }}>
                              +{file.tags.length - 3} more
                            </Typography>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        )}
      </Box>

      {/* Footer Stats */}
      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography variant="caption" sx={{ color: '#757575' }}>
          {files.length} files • {formatFileSize(files.reduce((sum, f) => sum + f.fileSize, 0))} total
        </Typography>
      </Box>
    </Box>
  );
};

export default FileManager;
