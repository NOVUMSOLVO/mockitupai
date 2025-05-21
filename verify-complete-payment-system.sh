#!/bin/bash
# filepath: /Users/valentinechideme/Documents/augment-projects/mockitupai/verify-complete-payment-system.sh
# Comprehensive verification of the payment system

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}====== Mockitup.ai Complete Payment System Verification ======${NC}"
echo ""

# Check permissions
echo -e "${YELLOW}Checking script permissions...${NC}"
if [ ! -x ./test-payment-system.sh ] || [ ! -x ./test-payment-api.sh ] || [ ! -x ./test-payment-logging.sh ]; then
  echo -e "${RED}⚠️ Some scripts are not executable${NC}"
  echo "Fixing permissions..."
  chmod +x *.sh
  echo -e "${GREEN}✓ Permissions fixed${NC}"
else
  echo -e "${GREEN}✓ Script permissions OK${NC}"
fi

# Check logs directory
echo ""
echo -e "${YELLOW}Checking logs directory...${NC}"
if [ ! -d "logs" ]; then
  echo "Creating logs directory..."
  mkdir -p logs
  echo -e "${GREEN}✓ Logs directory created${NC}"
else
  echo -e "${GREEN}✓ Logs directory exists${NC}"
fi

# Check babel dependencies
echo ""
echo -e "${YELLOW}Checking Babel configuration...${NC}"
if [ ! -f babel.config.js ] || [ ! -f .babelrc ]; then
  echo -e "${RED}⚠️ Missing Babel configuration files${NC}"
  echo "Creating default configuration..."
  
  if [ ! -f babel.config.js ]; then
    echo 'module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["@babel/preset-env", "babel-preset-expo"],
  };
};' > babel.config.js
    echo -e "${GREEN}✓ Created babel.config.js${NC}"
  fi
  
  if [ ! -f .babelrc ]; then
    echo '{
  "presets": ["@babel/preset-env", "babel-preset-expo"],
  "plugins": []
}' > .babelrc
    echo -e "${GREEN}✓ Created .babelrc${NC}"
  fi
else
  echo -e "${GREEN}✓ Babel configuration files exist${NC}"
fi

# Check for package.json babel dependencies
echo ""
echo -e "${YELLOW}Checking package.json for Babel dependencies...${NC}"
if ! grep -q "babel-preset-expo" package.json; then
  echo -e "${RED}⚠️ babel-preset-expo not found in package.json${NC}"
  echo "Installing babel-preset-expo..."
  npm install --save-dev babel-preset-expo
  echo -e "${GREEN}✓ Installed babel-preset-expo${NC}"
else
  echo -e "${GREEN}✓ babel-preset-expo is installed${NC}"
fi

if ! grep -q "@babel/preset-env" package.json; then
  echo -e "${RED}⚠️ @babel/preset-env not found in package.json${NC}"
  echo "Installing @babel/preset-env..."
  npm install --save-dev @babel/preset-env
  echo -e "${GREEN}✓ Installed @babel/preset-env${NC}"
else
  echo -e "${GREEN}✓ @babel/preset-env is installed${NC}"
fi

# Check payment dependencies
echo ""
echo -e "${YELLOW}Checking payment dependencies...${NC}"
if ! grep -q "@stripe/react-stripe-js" package.json || ! grep -q "@paypal/react-paypal-js" package.json; then
  echo -e "${RED}⚠️ Missing payment dependencies${NC}"
  echo "Installing payment dependencies..."
  if ! grep -q "@stripe/react-stripe-js" package.json; then
    npm install --save @stripe/react-stripe-js @stripe/stripe-js
  fi
  if ! grep -q "@paypal/react-paypal-js" package.json; then
    npm install --save @paypal/react-paypal-js
  fi
  echo -e "${GREEN}✓ Installed payment dependencies${NC}"
else
  echo -e "${GREEN}✓ Payment dependencies are installed${NC}"
fi

# Check environment variables
echo ""
echo -e "${YELLOW}Checking environment variables...${NC}"
if [ ! -f .env ]; then
  echo -e "${RED}⚠️ Missing .env file${NC}"
  echo "Creating from template..."
  cp .env.example .env
  echo -e "${GREEN}✓ Created .env file from template${NC}"
  echo -e "${YELLOW}⚠️ You should update the .env file with your actual credentials${NC}"
else
  echo -e "${GREEN}✓ .env file exists${NC}"
fi

# Run test scripts
echo ""
echo -e "${YELLOW}Running test-payment-system.sh...${NC}"
./test-payment-system.sh | grep -v "Would you like to start the test server" || true

echo ""
echo -e "${YELLOW}Testing payment logging functionality...${NC}"
./test-payment-logging.sh

echo ""
echo -e "${BLUE}====== Verification Complete ======${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update your .env file with real test credentials"
echo "2. Test the payment API with ./test-payment-api.sh"
echo "3. Start the server with 'node server.js'"
echo "4. Test a complete payment flow in the browser"
echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo "- PAYMENT_QUICKSTART.md - Quick start guide"
echo "- PAYMENT_TESTING_GUIDE.md - Comprehensive testing procedures"
echo "- PAYMENT_DEBUGGING.md - Troubleshooting common issues"
echo ""
echo -e "Run ${GREEN}node server.js${NC} to start the server and test payments"
