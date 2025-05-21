// Simple Puppeteer environment for Jest
const NodeEnvironment = require('jest-environment-node');
const puppeteer = require('puppeteer');

class PuppeteerEnvironment extends NodeEnvironment {
  constructor(config) {
    // Ensure config exists
    const customConfig = {
      ...config,
      testEnvironmentOptions: {
        ...(config.testEnvironmentOptions || {})
      }
    };
    
    super(customConfig);
  }

  async setup() {
    await super.setup();
    
    // Configure browser launch options
    const launchOptions = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    };

    try {
      // Launch browser
      this.global.browser = await puppeteer.launch(launchOptions);
      
      // Create a new page
      this.global.page = await this.global.browser.newPage();
      
      // Set viewport
      await this.global.page.setViewport({ width: 1280, height: 800 });
      
      // Set default timeouts
      this.global.page.setDefaultNavigationTimeout(30000);
      this.global.page.setDefaultTimeout(10000);
      
    } catch (error) {
      console.error('Failed to setup Puppeteer environment:', error);
      throw error;
    }
  }

  async teardown() {
    try {
      // Close page if it exists
      if (this.global.page) {
        await this.global.page.close().catch(console.error);
      }
      
      // Close browser if it exists
      if (this.global.browser) {
        await this.global.browser.close().catch(console.error);
      }
    } catch (error) {
      console.error('Error during teardown:', error);
    } finally {
      await super.teardown();
    }
  }
}

module.exports = PuppeteerEnvironment;
