/**
 * Custom React port setup for development server
 * This script will be loaded before react-scripts starts
 */

if (process.env.REACT_APP_USE_DYNAMIC_PORT === 'true') {
  const { findAvailablePort } = require('./setupPorts');
  
  // Get the default port (from .env or default to 5000)
  const defaultPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  
  // Find an available port and set it
  findAvailablePort(defaultPort)
    .then(port => {
      console.log(`Found available port: ${port}`);
      process.env.PORT = port.toString();
    })
    .catch(err => {
      console.error('Error finding available port:', err);
      // Continue with default port, react-scripts will handle port conflicts
    });
}
