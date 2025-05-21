#!/bin/bash
# filepath: /Users/valentinechideme/Documents/augment-projects/mockitupai/payment-system-fix-all.sh
# All-in-one script to fix the payment system

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}====== Payment System Fix All ======${NC}"
echo ""

# Step 1: Fix script permissions
echo -e "${YELLOW}Step 1: Fixing script permissions...${NC}"
chmod +x *.sh
echo -e "${GREEN}✓ Script permissions fixed${NC}"

# Step 2: Remove any REM comments
echo ""
echo -e "${YELLOW}Step 2: Removing Windows-style REM comments...${NC}"
for script in *.sh; do
  if grep -q "REM filepath" "$script"; then
    echo "  Found REM comments in $script, fixing..."
    grep -v "REM filepath" "$script" > "$script.fixed"
    mv "$script.fixed" "$script"
    chmod +x "$script"
  fi
done
echo -e "${GREEN}✓ REM comments removed${NC}"

# Step 3: Fix Babel configuration
echo ""
echo -e "${YELLOW}Step 3: Fixing Babel configuration...${NC}"

# Update babel.config.js
echo "module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['@babel/preset-env'],
  };
};" > babel.config.js

# Update .babelrc
echo '{
  "presets": ["@babel/preset-env"],
  "plugins": []
}' > .babelrc

echo -e "${GREEN}✓ Babel configuration fixed${NC}"

# Step 4: Install dependencies
echo ""
echo -e "${YELLOW}Step 4: Installing required dependencies...${NC}"
npm install --save-dev @babel/core @babel/preset-env @babel/eslint-parser babel-preset-expo
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 5: Update ESLint configuration
echo ""
echo -e "${YELLOW}Step 5: Updating ESLint configuration...${NC}"
if [ -f .eslintrc.json ]; then
  echo '{
  "extends": [
    "react-app"
  ],
  "parser": "@babel/eslint-parser",
  "parserOptions": {
    "requireConfigFile": false,
    "babelOptions": {
      "presets": ["@babel/preset-env"]
    }
  },
  "rules": {
    "jsx-a11y/anchor-is-valid": "warn"
  }
}' > .eslintrc.json
  echo -e "${GREEN}✓ ESLint configuration updated${NC}"
else
  echo -e "${YELLOW}⚠️ .eslintrc.json not found, skipping ESLint configuration${NC}"
fi

# Step 6: Create logs directory
echo ""
echo -e "${YELLOW}Step 6: Creating logs directory...${NC}"
mkdir -p logs
echo -e "${GREEN}✓ Logs directory created${NC}"

# Step 7: Ensure .env file exists
echo ""
echo -e "${YELLOW}Step 7: Checking .env file...${NC}"
if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
  echo -e "${GREEN}✓ Created .env file from template${NC}"
  echo -e "${YELLOW}⚠️ Remember to update your .env file with your actual credentials${NC}"
elif [ -f .env ]; then
  echo -e "${GREEN}✓ .env file exists${NC}"
else
  echo -e "${RED}❌ .env.example not found, cannot create .env file${NC}"
fi

# Step 8: Final verification
echo ""
echo -e "${YELLOW}Step 8: Running final verification...${NC}"
echo "Testing Babel configuration..."
# Create a test file
echo "// Test file for Babel parsing
const testFunction = () => {
  console.log('Hello, world!');
  return { success: true };
};

export default testFunction;" > babel-test.js

# Try parsing with Babel
npx babel babel-test.js --out-file babel-test.compiled.js 2>/dev/null

if [ -f babel-test.compiled.js ]; then
  echo -e "${GREEN}✓ Successfully compiled with Babel${NC}"
  # Clean up test files
  rm babel-test.js babel-test.compiled.js
else
  echo -e "${RED}❌ Failed to compile with Babel${NC}"
fi

echo ""
echo -e "${BLUE}====== Payment System Fix Complete ======${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Test the payment system with ./test-payment-system.sh"
echo "2. Test the payment API with ./test-payment-api.sh"
echo "3. Start the server with 'node server.js'"
echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo "- PAYMENT_QUICKSTART.md - Quick start guide"
echo "- PAYMENT_TESTING_GUIDE.md - Comprehensive testing procedures"
echo "- PAYMENT_DEBUGGING.md - Troubleshooting common issues"
echo "- PAYMENT_FIX_SUMMARY.md - Summary of all fixes applied"
