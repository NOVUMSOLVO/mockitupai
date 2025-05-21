/**
 * Port utility for Mockitup.ai
 * This utility helps find available ports for running servers
 */

const net = require('net');

/**
 * Find an available port starting from the preferred port
 * 
 * @param {number} preferredPort - The port to start checking from
 * @param {number} maxPort - The maximum port number to check (default: preferred port + 100)
 * @returns {Promise<number>} - A promise that resolves to an available port
 */
const findAvailablePort = (preferredPort, maxPort = preferredPort + 100) => {
  return new Promise((resolve, reject) => {
    if (preferredPort > maxPort) {
      reject(new Error(`Could not find an available port between ${preferredPort - 100} and ${maxPort}`));
      return;
    }

    const server = net.createServer();
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${preferredPort} is in use, trying port ${preferredPort + 1}...`);
        resolve(findAvailablePort(preferredPort + 1, maxPort));
      } else {
        reject(err);
      }
    });
    
    server.listen(preferredPort, '0.0.0.0', () => {
      server.close(() => {
        resolve(preferredPort);
      });
    });
  });
};

/**
 * Start a server on an available port
 * 
 * @param {function} startFn - Function to start the server, receives the port as an argument
 * @param {number} preferredPort - The preferred port to start with
 */
const startWithAvailablePort = async (startFn, preferredPort = 5000) => {
  try {
    const port = await findAvailablePort(preferredPort);
    console.log(`Port ${port} is available, starting server...`);
    startFn(port);
  } catch (err) {
    console.error('Failed to find an available port:', err);
    // Try with a fallback port if preferred port fails
    console.log('Attempting to start with fallback port 3000...');
    try {
      const fallbackPort = 3000;
      const port = await findAvailablePort(fallbackPort);
      startFn(port);
    } catch (fallbackErr) {
      console.error('Failed to start server with fallback port:', fallbackErr);
      process.exit(1);
    }
  }
};

module.exports = {
  findAvailablePort,
  startWithAvailablePort
};
