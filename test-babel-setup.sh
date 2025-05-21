#!/bin/bash
# filepath: /Users/valentinechideme/Documents/augment-projects/mockitupai/test-babel-setup.sh
# Test the Babel configuration by trying to parse JavaScript and JSX files

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}====== Testing Babel Configuration ======${NC}"
echo ""

# First, let's verify our Babel dependencies
echo -e "${YELLOW}Checking Babel dependencies...${NC}"
npm list @babel/core @babel/preset-env @babel/preset-react babel-preset-expo --depth=0 || {
  echo -e "${RED}⚠️ Some Babel dependencies are missing${NC}"
  echo "Installing Babel dependencies..."
  npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-preset-expo
}

echo ""
echo -e "${YELLOW}Checking Babel configuration files...${NC}"
if [ ! -f babel.config.js ]; then
  echo -e "${RED}⚠️ Missing babel.config.js${NC}"
  echo "Creating babel.config.js..."
  echo "module.exports = function(api) {
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
};" > babel.config.js
  echo -e "${GREEN}✓ Created babel.config.js${NC}"
fi

if [ ! -f .babelrc ]; then
  echo -e "${RED}⚠️ Missing .babelrc${NC}"
  echo "Creating .babelrc..."
  echo '{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  "plugins": []
}' > .babelrc
  echo -e "${GREEN}✓ Created .babelrc${NC}"
fi

# Test parsing a JavaScript file
echo ""
echo -e "${YELLOW}Testing JavaScript parsing with Babel...${NC}"

# Create a test file
echo "// Test file for Babel parsing (JS)
const testFunction = () => {
  console.log('Hello, world!');
  return { success: true };
};

export default testFunction;" > babel-test.js

# Try parsing with Babel
echo "Trying to parse babel-test.js..."
npx babel babel-test.js --out-file babel-test.compiled.js 2>/dev/null

# Test parsing a JSX file
echo ""
echo -e "${YELLOW}Testing JSX parsing with Babel...${NC}"

# Create a test file with JSX
echo "// Test file for Babel parsing (JSX)
import React from 'react';

const TestComponent = () => {
  const name = 'World';
  return (
    <div className='test-component'>
      <h1>Hello, {name}!</h1>
      <p>This is a test component</p>
    </div>
  );
};

export default TestComponent;" > babel-test.jsx

# Try parsing with Babel
echo "Trying to parse babel-test.jsx..."
npx babel babel-test.jsx --out-file babel-test.jsx.compiled.js 2>/dev/null

# Check results
if [ -f babel-test.compiled.js ]; then
  echo -e "${GREEN}✓ Successfully compiled JavaScript with Babel${NC}"
else
  echo -e "${RED}❌ Failed to compile JavaScript with Babel${NC}"
fi

if [ -f babel-test.jsx.compiled.js ]; then
  echo -e "${GREEN}✓ Successfully compiled JSX with Babel${NC}"
else
  echo -e "${RED}❌ Failed to compile JSX with Babel${NC}"
fi

# Clean up test files
rm -f babel-test.js babel-test.compiled.js babel-test.jsx babel-test.jsx.compiled.js

echo ""
echo -e "${YELLOW}Current Babel setup for this project:${NC}"
echo "1. Dependencies:"
echo "   - @babel/core"
echo "   - @babel/preset-env"
echo "   - @babel/preset-react"
echo "   - babel-preset-expo (used conditionally)"
echo ""
echo "2. Configuration supports both React and Expo modes"
echo ""
echo "3. ESLint parser: @babel/eslint-parser"
echo ""
echo -e "${BLUE}====== Babel Configuration Test Complete ======${NC}"
