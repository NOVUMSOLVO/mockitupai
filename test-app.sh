#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Mockitup.ai Comprehensive Testing Script ===${NC}"
echo

# Function to print section headers
print_header() {
  echo
  echo -e "${BLUE}==== $1 ====${NC}"
  echo
}

# Check that we're in the correct directory
print_header "Checking current directory"
CURRENT_DIR=$(pwd)
echo "Current directory: $CURRENT_DIR"

if [[ "$CURRENT_DIR" != *"mockitupai"* ]]; then
  echo -e "${RED}Warning: You may not be in the correct directory.${NC}"
  echo -e "Expected directory path should contain 'mockitupai'"
  echo -e "Try running: ${YELLOW}cd /Users/valentinechideme/Documents/augment-projects/mockitupai${NC}"
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Exiting..."
    exit 1
  fi
else
  echo -e "${GREEN}✓ Directory looks correct${NC}"
fi

# Check if node is installed
print_header "Checking Node.js installation"
if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v)
  echo -e "${GREEN}✓ Node.js is installed: $NODE_VERSION${NC}"
else
  echo -e "${RED}× Node.js is not installed or not in PATH${NC}"
  echo "Please install Node.js from https://nodejs.org/"
  exit 1
fi

# Check if npm is installed
print_header "Checking npm installation"
if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm -v)
  echo -e "${GREEN}✓ npm is installed: $NPM_VERSION${NC}"
else
  echo -e "${RED}× npm is not installed or not in PATH${NC}"
  exit 1
fi

# Check for package.json
print_header "Checking project structure"
if [ -f "package.json" ]; then
  echo -e "${GREEN}✓ package.json exists${NC}"
  PACKAGE_NAME=$(grep -o '"name": *"[^"]*"' package.json | cut -d'"' -f4)
  PACKAGE_VERSION=$(grep -o '"version": *"[^"]*"' package.json | cut -d'"' -f4)
  echo "Project: $PACKAGE_NAME v$PACKAGE_VERSION"
else
  echo -e "${RED}× package.json is missing${NC}"
  exit 1
fi

# Check for essential directories
if [ -d "src" ]; then
  echo -e "${GREEN}✓ src directory exists${NC}"
else
  echo -e "${RED}× src directory is missing${NC}"
  exit 1
fi

if [ -d "public" ]; then
  echo -e "${GREEN}✓ public directory exists${NC}"
else
  echo -e "${RED}× public directory is missing${NC}"
  exit 1
fi

# Check for node_modules
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✓ Dependencies are installed (node_modules exists)${NC}"
else
  echo -e "${YELLOW}! node_modules directory is missing${NC}"
  echo "Running npm install to install dependencies..."
  npm install
  if [ $? -ne 0 ]; then
    echo -e "${RED}× Failed to install dependencies${NC}"
    exit 1
  else
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
  fi
fi

# Check for essential files
print_header "Checking essential files"
ESSENTIAL_FILES=("src/App.js" "src/index.js" "src/index.css" "public/index.html" 
                "tailwind.config.js" "postcss.config.js")

for file in "${ESSENTIAL_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓ $file exists${NC}"
  else
    echo -e "${RED}× $file is missing${NC}"
  fi
done

# Check that test-connection.js is working correctly
print_header "Testing connection script"
echo "Starting test server in background to check connectivity..."

# Save the current process group ID
# Kill the process group when done (to clean up child processes)
pkill -f "node test-connection.js" > /dev/null 2>&1  # Kill any existing instances

if [ -f "test-connection.js" ]; then
  node test-connection.js > /tmp/test-server-output.log 2>&1 &
  TEST_SERVER_PID=$!
  echo "Server started with PID: $TEST_SERVER_PID"
  
  # Wait for server to start
  echo "Waiting 2 seconds for server to start..."
  sleep 2
  
  # Check if it's running
  if ps -p $TEST_SERVER_PID > /dev/null; then
    echo -e "${GREEN}✓ Test server is running${NC}"
    
    # Try connection
    echo "Testing connection to http://localhost:5000"
    if command -v curl &> /dev/null; then
      RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000)
      if [ "$RESPONSE" = "200" ]; then
        echo -e "${GREEN}✓ Server responded with HTTP 200 (OK)${NC}"
        echo "Test server output:"
        cat /tmp/test-server-output.log
      else
        echo -e "${RED}× Server responded with HTTP $RESPONSE${NC}"
      fi
    else
      echo -e "${YELLOW}! curl command not available, can't test connection${NC}"
    fi
    
    # Stop the server
    echo "Stopping test server..."
    kill $TEST_SERVER_PID
  else
    echo -e "${RED}× Test server failed to start${NC}"
    echo "Server output:"
    cat /tmp/test-server-output.log
  fi
else
  echo -e "${RED}× test-connection.js is missing${NC}"
fi

# Test Tailwind CSS configuration
print_header "Checking Tailwind CSS setup"
if [ -f "tailwind.config.js" ]; then
  echo -e "${GREEN}✓ tailwind.config.js exists${NC}"
  
  # Check for tailwind.config.js content
  if grep -q "content:" tailwind.config.js && grep -q "./src/" tailwind.config.js; then
    echo -e "${GREEN}✓ tailwind.config.js seems to be configured correctly${NC}"
  else
    echo -e "${YELLOW}! tailwind.config.js might be misconfigured${NC}"
  fi
  
  # Check for tailwind directives in CSS
  if grep -q "@tailwind" src/index.css; then
    echo -e "${GREEN}✓ Tailwind directives found in src/index.css${NC}"
  else
    echo -e "${YELLOW}! Tailwind directives might be missing in src/index.css${NC}"
  fi
else
  echo -e "${RED}× tailwind.config.js is missing${NC}"
fi

# Check deployment files
print_header "Checking deployment configuration"
if [ -f "netlify.toml" ]; then
  echo -e "${GREEN}✓ netlify.toml exists for Netlify deployment${NC}"
else
  echo -e "${YELLOW}! netlify.toml is missing${NC}"
fi

if [ -f "vercel.json" ]; then
  echo -e "${GREEN}✓ vercel.json exists for Vercel deployment${NC}"
else
  echo -e "${YELLOW}! vercel.json is missing${NC}"
fi

# Final verdict
print_header "Summary"

if [ -f "src/App.js" ] && [ -f "src/index.js" ] && [ -f "public/index.html" ] && [ -f "tailwind.config.js" ]; then
  echo -e "${GREEN}✓ All essential files are present${NC}"
else
  echo -e "${RED}× Some essential files are missing${NC}"
fi

echo
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✓ Dependencies are installed${NC}"
else
  echo -e "${RED}× Dependencies are missing${NC}"
fi

echo
echo -e "${GREEN}=== Testing Complete ===${NC}"
echo
echo "To run the application:"
echo -e "  ${YELLOW}./start.sh${NC}"
echo
echo "To deploy the application:"
echo -e "  ${YELLOW}npm run build${NC}"
echo -e "  ${YELLOW}# Then deploy using Netlify or Vercel CLI${NC}"
echo

exit 0
