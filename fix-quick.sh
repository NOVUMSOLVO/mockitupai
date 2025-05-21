#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Mockitup.ai Path and Permission Fixer ===${NC}"
echo

# Check if we're in the wrong path
CURRENT_PATH=$(pwd)
if [[ "$CURRENT_PATH" == "/valentinechideme"* ]]; then
  echo -e "${RED}Incorrect path detected: $CURRENT_PATH${NC}"
  CORRECT_PATH="/Users${CURRENT_PATH}"
  echo -e "${YELLOW}Switching to correct path: $CORRECT_PATH${NC}"
  cd "$CORRECT_PATH" || {
    echo -e "${RED}Failed to change directory.${NC}"
    exit 1
  }
  echo -e "${GREEN}✓ Now in correct directory: $(pwd)${NC}"
fi

# Fix permissions for all scripts
echo -e "${YELLOW}Setting executable permissions for all scripts...${NC}"
chmod +x *.sh *.js
echo -e "${GREEN}✓ Permissions fixed${NC}"

# List available scripts
echo
echo -e "${YELLOW}Available deployment scripts:${NC}"
echo "1. ./deploy-direct.sh - Simple direct deployment"
echo "2. ./deploy-netlify.sh - Interactive guided deployment"
echo "3. ./deploy-netlify-auto.sh - Automated non-interactive deployment"
echo
echo -e "${GREEN}You can now run any of these scripts${NC}"
