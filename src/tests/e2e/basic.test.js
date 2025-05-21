// Import the page object from the test environment
const { page } = require('@playwright/test');

// Base URL for tests
const BASE_URL = 'http://localhost:3000';

// Test suite for basic functionality
describe('MockItUpAI Basic Tests', () => {
  // Basic smoke test
  test('Homepage loads successfully', async () => {
    // Navigate to the homepage
    await page.goto(BASE_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Check the page title
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Wait for main content to be visible
    await page.waitForSelector('body', { timeout: 5000 });
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'homepage.png' });
    
    // Check for main content
    const content = await page.content();
    expect(content).toMatch(/mockitupai/i);
  });

  // Test navigation
  test('Can navigate to login page', async () => {
    // Navigate to the homepage first
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    
    // Wait for navigation to complete
    await page.waitForSelector('a[href*="login"]', { timeout: 5000 });
    
    // Try to find and click the login link
    const loginLink = await page.$('a[href*="login"]');
    
    if (loginLink) {
      // If login link exists, click it
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
        loginLink.click()
      ]);
      
      // Wait for login page to load
      await page.waitForSelector('body', { timeout: 5000 });
      
      // Take a screenshot for debugging
      await page.screenshot({ path: 'login-page.png' });
      
      // Verify we're on the login page
      expect(page.url()).toContain('login');
    } else {
      console.log('Login link not found, skipping login navigation test');
      // Take a screenshot to see what's on the page
      await page.screenshot({ path: 'no-login-link.png' });
    }
  });
});
