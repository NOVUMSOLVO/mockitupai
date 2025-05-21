const puppeteer = require('puppeteer');

module.exports = async function() {
  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  });

  // Store the browser instance
  global.__BROWSER__ = browser;
  
  // Create a new page
  global.__PAGE__ = await browser.newPage();
  
  // Set viewport
  await global.__PAGE__.setViewport({ width: 1280, height: 800 });
  
  // Set default timeouts
  global.__PAGE__.setDefaultNavigationTimeout(30000);
  global.__PAGE__.setDefaultTimeout(10000);
};
