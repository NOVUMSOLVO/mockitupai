// File: start-dev.js
const { findAvailablePort } = require('./setupPorts'); // setupPorts.js is in the root
const { exec } = require('child_process');
const path = require('path');

// Get the default port (from .env or default to 5000)
const defaultPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

findAvailablePort(defaultPort)
  .then(port => {
    console.log(`[start-dev.js] Found available port: ${port}. Starting dev server...`);
    
    // Construct the command to run react-scripts
    const reactScriptsPath = path.join(__dirname, 'node_modules', '.bin', 'react-scripts');
    // Set PORT directly in the command for cross-env to pick up, along with other env vars
    const command = `cross-env REACT_APP_USE_DYNAMIC_PORT=true PORT=${port} node ${reactScriptsPath} start`;
    
    console.log(`[start-dev.js] Executing: ${command}`);

    const child = exec(command, {
        env: { 
            ...process.env, 
            PORT: port.toString(),
            NODE_OPTIONS: '--openssl-legacy-provider' // Add OpenSSL legacy provider
        }, 
        cwd: __dirname // CWD is project root since start-dev.js is there
    });

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    child.on('exit', (code) => {
        console.log(`[start-dev.js] React-scripts process exited with code ${code}`);
    });
  })
  .catch(err => {
    console.error('[start-dev.js] Could not find an available port or start server. Error:', err);
    process.exit(1);
  });
