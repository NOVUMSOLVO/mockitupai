const puppeteer = require('puppeteer');

// Base URL for tests
const BASE_URL = 'http://localhost:3000';

describe('Simple Puppeteer Test', () => {
  let browser;
  let page;

  beforeAll(async () => {
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });
    
    // Create a new page
    page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    // Set default timeouts
    page.setDefaultNavigationTimeout(30000);
    page.setDefaultTimeout(10000);
  });

  afterAll(async () => {
    // Close the browser
    if (browser) {
      await browser.close();
    }
  });

  test('should load the homepage', async () => {
    // Navigate to the homepage
    await page.goto(BASE_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Check the page title
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'simple-test-screenshot.png' });
    
    console.log('Page title:', title);
  });
});
