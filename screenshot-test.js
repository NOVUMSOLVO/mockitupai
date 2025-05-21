const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: false, // Show the browser
    defaultViewport: null,
    args: ['--start-maximized']
  });

  try {
    const page = await browser.newPage();
    
    // Navigate to the home page
    console.log('Navigating to http://localhost:3005...');
    await page.goto('http://localhost:3005', { 
      waitUntil: 'networkidle0',
      timeout: 60000 // 60 seconds timeout
    });
    
    console.log('Page loaded, taking screenshot...');
    
    // Take a screenshot of the full page
    await page.screenshot({
      path: 'homepage-screenshot.png',
      fullPage: true
    });
    
    console.log('Screenshot saved as homepage-screenshot.png');
    
    // Log any console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text());
      }
    });
    
    // Wait for 30 seconds to allow manual inspection
    console.log('Keeping the browser open for 30 seconds...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    // Close the browser
    await browser.close();
  }
})();
