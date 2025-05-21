module.exports = {
  // Use the jest-puppeteer preset
  preset: 'jest-puppeteer',
  
  // Test files pattern
  testMatch: ['**/src/tests/e2e/**/*.test.js'],
  
  // Test timeout (30 seconds)
  testTimeout: 30000,
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  
  // Test runner
  testRunner: 'jest-circus/runner',
  
  // Verbose output
  verbose: true,
  
  // Transform settings
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  
  // Module name mapper for CSS/SCSS files
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  
  // Test environment options
  testEnvironmentOptions: {
    'jest-puppeteer': {
      // Configure Puppeteer launch options
      launch: {
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
      },
      // Browser context to use
      browserContext: 'default',
    }
  }
};
