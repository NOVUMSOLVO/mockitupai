const fs = require('fs');
const os = require('os');
const path = require('path');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function () {
  console.log('Teardown Puppeteer Environment');
  
  // Close the browser instance if it exists
  if (global.__BROWSER_INSTANCE__) {
    try {
      await global.__BROWSER_INSTANCE__.close();
      console.log('Browser instance closed successfully');
    } catch (error) {
      console.error('Error closing browser instance:', error);
    }
  }
  
  // Clean up the temporary directory
  try {
    if (fs.existsSync(DIR)) {
      const wsEndpointPath = path.join(DIR, 'wsEndpoint');
      if (fs.existsSync(wsEndpointPath)) {
        fs.unlinkSync(wsEndpointPath);
      }
      fs.rmdirSync(DIR);
      console.log('Temporary files cleaned up');
    }
  } catch (error) {
    console.error('Error cleaning up temporary files:', error);
  }
  
  console.log('Puppeteer Environment Teardown Complete');
};
