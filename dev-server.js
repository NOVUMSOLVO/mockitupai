#!/usr/bin/env node

/**
 * Simple development server for Mockitup.ai
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { startWithAvailablePort } = require('./setupPorts');

const preferredPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const STATIC_DIR = path.join(__dirname, 'build');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Default to serving index.html
  let filePath = STATIC_DIR + (req.url === '/' ? '/index.html' : req.url);
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If file doesn't exist, serve index.html (SPA fallback)
      filePath = path.join(STATIC_DIR, 'index.html');
    }
    
    // Determine content type
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';
    
    // Read and serve the file
    fs.readFile(filePath, (error, content) => {
      if (error) {
        res.writeHead(500);
        res.end(`Error loading ${filePath}: ${error.code}`);
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });
});

// Start the server with an available port
startWithAvailablePort((PORT) => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Server also available at http://127.0.0.1:${PORT}/`);
    console.log(`Try opening this URL in your browser`);
    console.log(`Press Ctrl+C to stop the server`);
  });
}, preferredPort);
