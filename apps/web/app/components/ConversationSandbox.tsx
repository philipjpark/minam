'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  IconButton,
  Chip,
  Avatar,
  Tooltip,
  Divider
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface FileData {
  id: string;
  fileName: string;
  fileType: string;
  data: any;
  uploadTime: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  fileReferences?: string[];
  connections?: Array<{file1: string, file2: string, connectionType: string}>;
}

interface ConversationSandboxProps {
  files: FileData[];
  onClose: () => void;
}

const ConversationSandbox: React.FC<ConversationSandboxProps> = ({ files, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/multi-file-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: inputValue.trim(),
          files: files,
          conversationHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp.toISOString(),
            fileReferences: msg.fileReferences
          })),
          selectedFileId: selectedFileId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        fileReferences: data.fileReferences,
        connections: data.connections
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return '📄';
      case 'xlsx': case 'xls': return '📊';
      case 'csv': return '📈';
      default: return '📁';
    }
  };

  const getFileById = (fileId: string) => {
    return files.find(f => f.id === fileId);
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 50%, #16213E 100%)'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.05)'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
              🧠 AI Conversation Sandbox
            </Typography>
            <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
              Ask questions about your {files.length} uploaded file{files.length !== 1 ? 's' : ''} • Continuous conversation enabled
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              color: '#B0BEC5',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': { borderColor: '#B0BEC5' }
            }}
          >
            Close
          </Button>
        </Box>

        {/* File Quick Access */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {files.map((file) => (
            <Chip
              key={file.id}
              label={`${getFileIcon(file.fileType)} ${file.fileName}`}
              onClick={() => setSelectedFileId(selectedFileId === file.id ? undefined : file.id)}
              sx={{
                backgroundColor: selectedFileId === file.id ? '#FFD700' : 'rgba(255, 255, 255, 0.1)',
                color: selectedFileId === file.id ? '#000' : '#B0BEC5',
                '&:hover': {
                  backgroundColor: selectedFileId === file.id ? '#FFA500' : 'rgba(255, 255, 255, 0.2)'
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Messages */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {messages.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            color: '#B0BEC5'
          }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              👋 Welcome to your AI Sandbox!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Start a conversation by asking questions about your uploaded files.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: '400px', mx: 'auto' }}>
              <Typography variant="body2" sx={{ color: '#757575' }}>
                Try asking:
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575' }}>
                • "What patterns do you see across all my files?"
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575' }}>
                • "Compare the data in file1.xlsx and file2.csv"
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575' }}>
                • "Summarize the key insights from my data"
              </Typography>
            </Box>
          </Box>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}>
                  <Card sx={{
                    maxWidth: '80%',
                    background: message.role === 'user' 
                      ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                      : 'rgba(255, 255, 255, 0.08)',
                    border: message.role === 'user' 
                      ? 'none'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px'
                  }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Avatar sx={{
                          bgcolor: message.role === 'user' ? '#000' : '#4CAF50',
                          width: 32,
                          height: 32
                        }}>
                          {message.role === 'user' ? '👤' : '🤖'}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" sx={{ 
                              color: message.role === 'user' ? '#000' : '#B0BEC5',
                              fontWeight: 'bold'
                            }}>
                              {message.role === 'user' ? 'You' : 'AI Assistant'}
                            </Typography>
                            <Typography variant="caption" sx={{ 
                              color: message.role === 'user' ? '#666' : '#757575'
                            }}>
                              {formatTime(message.timestamp)}
                            </Typography>
                          </Box>
                          
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: message.role === 'user' ? '#000' : 'white',
                              whiteSpace: 'pre-wrap',
                              lineHeight: 1.6
                            }}
                          >
                            {message.content}
                          </Typography>

                          {/* File References */}
                          {message.fileReferences && message.fileReferences.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="caption" sx={{ color: '#B0BEC5', display: 'block', mb: 1 }}>
                                Referenced files:
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {message.fileReferences.map((fileId) => {
                                  const file = getFileById(fileId);
                                  return file ? (
                                    <Chip
                                      key={fileId}
                                      label={`${getFileIcon(file.fileType)} ${file.fileName}`}
                                      size="small"
                                      sx={{
                                        backgroundColor: 'rgba(255, 215, 0, 0.2)',
                                        color: '#FFD700',
                                        fontSize: '0.7rem'
                                      }}
                                    />
                                  ) : null;
                                })}
                              </Box>
                            </Box>
                          )}

                          {/* Connections */}
                          {message.connections && message.connections.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="caption" sx={{ color: '#B0BEC5', display: 'block', mb: 1 }}>
                                File connections found:
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                {message.connections.slice(0, 3).map((conn, index) => (
                                  <Typography key={index} variant="caption" sx={{ color: '#4CAF50' }}>
                                    🔗 {conn.file1} ↔ {conn.file2}: {conn.connectionType}
                                  </Typography>
                                ))}
                                {message.connections.length > 3 && (
                                  <Typography variant="caption" sx={{ color: '#757575' }}>
                                    +{message.connections.length - 3} more connections
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px'
            }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#4CAF50', width: 32, height: 32 }}>
                    🤖
                  </Avatar>
                  <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                    AI is thinking...
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ 
        p: 3, 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.05)'
      }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask questions about your files... (Press Enter to send, Shift+Enter for new line)"
            disabled={isLoading}
            sx={{
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
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            sx={{
              background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)' },
              color: 'white',
              minWidth: '100px',
              height: '56px'
            }}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ConversationSandbox;
