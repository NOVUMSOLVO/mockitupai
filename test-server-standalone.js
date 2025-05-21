/**
 * Test script to verify server start-up
 */
const { startWithAvailablePort } = require('./setupPorts');
const express = require('express');
const app = express();

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Server is running correctly!');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

console.log('Starting test server...');

// Start the server with an available port
startWithAvailablePort((PORT) => {
  const server = app.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
      console.error('Error starting test server:', err);
      return;
    }
    console.log(`-------------------------------------------`);
    console.log(`✅ Test server is running on port ${PORT}`);
    console.log(`🌐 Open http://localhost:${PORT} in your browser`);
    console.log(`-------------------------------------------`);
    console.log(`To test the health endpoint: http://localhost:${PORT}/health`);
  });

  // Handle server errors
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please try a different port.`);
    } else {
      console.error('Server error:', err);
    }
  });
}, process.env.PORT ? parseInt(process.env.PORT, 10) : 5000);
