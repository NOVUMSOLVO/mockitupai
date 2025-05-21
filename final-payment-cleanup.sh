#!/bin/bash
# filepath: /Users/valentinechideme/Documents/augment-projects/mockitupai/final-payment-cleanup.sh
# Final cleanup and verification of payment system

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}====== Final Payment System Cleanup ======${NC}"
echo ""

# Remove temporary files
echo -e "${YELLOW}Removing temporary files...${NC}"
rm -f *.tmp
echo -e "${GREEN}✓ Temporary files removed${NC}"

# Fix script permissions
echo ""
echo -e "${YELLOW}Fixing script permissions...${NC}"
chmod +x *.sh
echo -e "${GREEN}✓ Script permissions fixed${NC}"

# Ensure logs directory exists
echo ""
echo -e "${YELLOW}Ensuring logs directory exists...${NC}"
mkdir -p logs
echo -e "${GREEN}✓ Logs directory exists${NC}"

# Update package.json if needed
echo ""
echo -e "${YELLOW}Checking package.json for required dependencies...${NC}"
if ! grep -q "babel-preset-expo" package.json; then
  echo -e "${RED}⚠️ babel-preset-expo missing from package.json${NC}"
  npm install --save-dev babel-preset-expo
  echo -e "${GREEN}✓ babel-preset-expo installed${NC}"
else
  echo -e "${GREEN}✓ babel-preset-expo found in package.json${NC}"
fi

if ! grep -q "@babel/preset-env" package.json; then
  echo -e "${RED}⚠️ @babel/preset-env missing from package.json${NC}"
  npm install --save-dev @babel/preset-env
  echo -e "${GREEN}✓ @babel/preset-env installed${NC}"
else
  echo -e "${GREEN}✓ @babel/preset-env found in package.json${NC}"
fi

if ! grep -q "@babel/eslint-parser" package.json; then
  echo -e "${RED}⚠️ @babel/eslint-parser missing from package.json${NC}"
  npm install --save-dev @babel/eslint-parser
  echo -e "${GREEN}✓ @babel/eslint-parser installed${NC}"
else
  echo -e "${GREEN}✓ @babel/eslint-parser found in package.json${NC}"
fi

# Create .env file if it doesn't exist
echo ""
echo -e "${YELLOW}Checking .env file...${NC}"
if [ ! -f .env ]; then
  echo -e "${RED}⚠️ .env file not found${NC}"
  cp .env.example .env
  echo -e "${GREEN}✓ Created .env file from template${NC}"
  echo -e "${YELLOW}⚠️ Remember to update your .env file with your actual credentials${NC}"
else
  echo -e "${GREEN}✓ .env file exists${NC}"
fi

# Run verification script
echo ""
echo -e "${YELLOW}Running final verification...${NC}"
./test-babel-setup.sh

echo ""
echo -e "${BLUE}====== Final Payment System Cleanup Complete ======${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update your .env file with real test credentials"
echo "2. Test the payment system with ./test-payment-system.sh"
echo "3. Test the payment API with ./test-payment-api.sh"
echo "4. Start the server with 'node server.js'"
echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo "- PAYMENT_QUICKSTART.md - Quick start guide"
echo "- PAYMENT_TESTING_GUIDE.md - Comprehensive testing procedures"
echo "- PAYMENT_DEBUGGING.md - Troubleshooting common issues"
echo ""
echo -e "Run ${GREEN}node server.js${NC} to start the server and test payments"
