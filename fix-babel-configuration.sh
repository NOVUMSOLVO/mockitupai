#!/bin/bash
# filepath: /Users/valentinechideme/Documents/augment-projects/mockitupai/fix-babel-configuration.sh
# Fix Babel configuration for both React and Expo compatibility

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}====== Fixing Babel Configuration ======${NC}"
echo ""

# Step 1: Install necessary dependencies
echo -e "${YELLOW}Step 1: Installing Babel dependencies...${NC}"
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-preset-expo@latest @babel/eslint-parser

echo -e "${GREEN}✓ Babel dependencies installed${NC}"

# Step 2: Create proper babel.config.js
echo ""
echo -e "${YELLOW}Step 2: Creating babel.config.js...${NC}"

cat > babel.config.js << 'EOL'
// filepath: /Users/valentinechideme/Documents/augment-projects/mockitupai/babel.config.js
module.exports = function(api) {
  api.cache(true);
  
  // Detect environment (React vs Expo)
  const isExpo = process.env.EXPO_ENV === 'true';
  
  return {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      // Only include expo preset if we're in an Expo environment
      isExpo && 'babel-preset-expo'
    ].filter(Boolean),
    plugins: []
  };
};
EOL

echo -e "${GREEN}✓ babel.config.js created${NC}"

# Step 3: Create proper .babelrc for better compatibility
echo ""
echo -e "${YELLOW}Step 3: Creating .babelrc...${NC}"

cat > .babelrc << 'EOL'
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  "plugins": []
}
EOL

echo -e "${GREEN}✓ .babelrc created${NC}"

# Step 4: Update ESLint configuration
echo ""
echo -e "${YELLOW}Step 4: Updating ESLint configuration...${NC}"

cat > .eslintrc.json << 'EOL'
{
  "extends": [
    "react-app"
  ],
  "parser": "@babel/eslint-parser",
  "parserOptions": {
    "requireConfigFile": false,
    "babelOptions": {
      "presets": ["@babel/preset-env", "@babel/preset-react"]
    }
  },
  "rules": {
    "jsx-a11y/anchor-is-valid": "warn"
  }
}
EOL

echo -e "${GREEN}✓ ESLint configuration updated${NC}"

# Step 5: Clean up node_modules to ensure fresh dependencies
echo ""
echo -e "${YELLOW}Step 5: Skipping node_modules cleanup for now${NC}"
# Automatically skip cleanup to avoid disrupting the environment
echo "You can manually clean node_modules later by running:"
echo "rm -rf node_modules package-lock.json && npm install"

# Step 6: Create helpers for switching between React and Expo modes
echo ""
echo -e "${YELLOW}Step 6: Creating helper scripts for React/Expo switching...${NC}"

# Create React start script
cat > start-react.sh << 'EOL'
#!/bin/bash
# Start in React mode
echo "Starting project in React mode..."
export EXPO_ENV=false
npm run start
EOL
chmod +x start-react.sh

# Create Expo start script
cat > start-expo.sh << 'EOL'
#!/bin/bash
# Start in Expo mode
echo "Starting project in Expo mode..."
export EXPO_ENV=true
npm run start-expo
EOL
chmod +x start-expo.sh

echo -e "${GREEN}✓ Helper scripts created${NC}"

echo ""
echo -e "${BLUE}====== Babel Configuration Fixed ======${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. To run in React mode (default): ./start-react.sh"
echo "2. To run in Expo mode: ./start-expo.sh"
echo "3. To start the payment API server: node server.js"
echo ""
echo -e "${YELLOW}If you still encounter Babel issues:${NC}"
echo "1. Try running: npm install --legacy-peer-deps"
echo "2. Directly remove babel-preset-expo from your project if you don't need Expo"
echo "3. See PAYMENT_DEBUGGING.md for more troubleshooting tips"
