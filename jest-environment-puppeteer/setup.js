const puppeteer = require('puppeteer');
const fs = require('fs');
const os = require('os');
const path = require('path');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function () {
  console.log('Setup Puppeteer Environment');
  
  // Create the temp directory if it doesn't exist
  if (!fs.existsSync(DIR)) {
    fs.mkdirSync(DIR, { recursive: true });
  }
  
  // Configure browser instance
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
    ],
  });
  
  // Store the browser instance so we can close it in teardown
  global.__BROWSER_INSTANCE__ = browser;
  
  // Store the WS endpoint for the tests to connect to
  const wsEndpoint = browser.wsEndpoint();
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), wsEndpoint, 'utf-8');
  
  // Set the base URL for tests
  process.env.PUPPETEER_WS_ENDPOINT = wsEndpoint;
  
  console.log('Puppeteer Environment Setup Complete');
};
