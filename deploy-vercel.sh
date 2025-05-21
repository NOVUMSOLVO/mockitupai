#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Mockitup.ai Vercel Deployment Script ===${NC}"
echo

# Step 1: Check paths and fix if necessary
echo -e "${YELLOW}Step 1: Checking path...${NC}"
CURRENT_PATH=$(pwd)
if [[ "$CURRENT_PATH" == "/valentinechideme"* ]]; then
  echo -e "${RED}Warning: You are using an incorrect path!${NC}"
  echo -e "Current path: $CURRENT_PATH"
  CORRECT_PATH="/Users${CURRENT_PATH}"
  echo -e "Correct path should be: ${GREEN}$CORRECT_PATH${NC}"
  
  echo -e "${YELLOW}Switching to correct path...${NC}"
  cd "$CORRECT_PATH" || {
    echo -e "${RED}Failed to change to correct directory.${NC}"
    echo "Please manually run:"
    echo "cd $CORRECT_PATH"
    exit 1
  }
fi

echo -e "${GREEN}✓ Working in correct directory: $(pwd)${NC}"
echo

# Step 2: Install vercel CLI globally if not installed
echo -e "${YELLOW}Step 2: Checking for Vercel CLI...${NC}"
if ! command -v vercel &> /dev/null; then
  echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
  npm install -g vercel
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install Vercel CLI. Trying with npx...${NC}"
  else
    echo -e "${GREEN}✓ Vercel CLI installed successfully${NC}"
  fi
else
  echo -e "${GREEN}✓ Vercel CLI already installed${NC}"
fi
echo

# Step 3: Build the project
echo -e "${YELLOW}Step 3: Building project...${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}Build failed. Please fix errors and try again.${NC}"
  exit 1
else
  echo -e "${GREEN}✓ Build completed successfully${NC}"
fi
echo

# Step 4: Deploy to Vercel
echo -e "${YELLOW}Step 4: Deploying to Vercel...${NC}"
echo -e "Attempting deployment using installed CLI first..."

if command -v vercel &> /dev/null; then
  vercel --prod
  DEPLOY_STATUS=$?
else
  echo -e "${YELLOW}Using npx to run vercel...${NC}"
  npx vercel --prod
  DEPLOY_STATUS=$?
fi

if [ $DEPLOY_STATUS -ne 0 ]; then
  echo -e "${RED}Deployment with primary method failed. Trying alternative...${NC}"
  echo -e "Creating a temporary Vercel deployment script..."
  
  # Create temporary file for deploying with Vercel
  echo '
  {
    "name": "vercel-deploy-temp",
    "version": "1.0.0",
    "scripts": {
      "deploy": "vercel --prod"
    },
    "dependencies": {
      "vercel": "latest"
    }
  }
  ' > vercel-deploy-temp.json
  
  echo -e "Installing temporary deployment tools..."
  npm install --prefix ./vercel-deploy-temp --package-lock=false
  
  echo -e "Trying deployment with temporary installation..."
  npx --prefix ./vercel-deploy-temp vercel --prod
  
  # Clean up
  rm -rf vercel-deploy-temp vercel-deploy-temp.json
else
  echo -e "${GREEN}✓ Deployment initiated successfully${NC}"
fi

echo
echo -e "${GREEN}=== Deployment Process Complete ===${NC}"
echo
echo -e "If you encounter any issues with the deployment, please try:"
echo -e "1. ${YELLOW}npm install -g vercel${NC}"
echo -e "2. ${YELLOW}vercel login${NC}"
echo -e "3. ${YELLOW}vercel --prod${NC}"
echo
echo -e "For further assistance, visit: ${GREEN}https://vercel.com/docs/cli${NC}"
