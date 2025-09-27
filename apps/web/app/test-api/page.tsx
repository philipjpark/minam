import React from 'react';
import TestApiKey from '../test-api-key';
import Navbar from '../components/Navbar';
import { Box } from '@mui/material';

export default function TestApiPage() {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 50%, #16213E 100%)' }}>
      <Navbar />
      <TestApiKey />
    </Box>
  );
}
