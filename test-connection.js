#!/usr/bin/env node

/**
 * Very simple HTTP server for testing connectivity
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { startWithAvailablePort } = require('./setupPorts');

const preferredPort = parseInt(process.env.PORT || '5000', 10);

const server = http.createServer((req, res) => {
  // Try to serve the test-connection.html file from public directory
  const testFilePath = path.join(__dirname, 'public', 'test-connection.html');
  
  fs.access(testFilePath, fs.constants.F_OK, (err) => {
    if (!err) {
      // File exists, serve it
      fs.readFile(testFilePath, (err, content) => {
        if (err) {
          // If error reading file, send error response
          res.writeHead(500);
          res.end('Error loading test-connection.html');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content);
        }
      });
    } else {
      // File doesn't exist, send inline HTML
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Mockitup.ai Connection Test</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem; }
        .success { color: green; }
      </style>
    </head>
    <body>
      <h1>Connection Test Successful!</h1>
      <p class="success">✅ If you can see this page, your connection is working correctly.</p>
      <p>Request: ${req.method} ${req.url}</p>
      <p>The server is responding on port ${PORT}.</p>
      <hr>
      <p><strong>Next steps:</strong></p>
      <ol>
        <li>Return to the terminal and stop this test server (Ctrl+C)</li>
        <li>Try running the full React application</li>
      </ol>
    </body>
    </html>
  `);
    }
  });
});

// Start the server with an available port
startWithAvailablePort((PORT) => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Simple test server running at http://localhost:${PORT}/`);
    console.log(`Try opening this URL in your browser`);
    console.log(`Press Ctrl+C to stop the server`);
  });
}, preferredPort);
