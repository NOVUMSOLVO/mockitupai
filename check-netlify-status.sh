#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${GREEN}${BOLD}=== Mockitup.ai Netlify Status Checker ===${NC}"
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

# Step 2: Check for Netlify CLI
USE_NPX=false
echo -e "${YELLOW}Step 2: Checking for Netlify CLI...${NC}"
if ! command -v netlify &> /dev/null; then
  echo -e "${YELLOW}Netlify CLI not found. Will use npx instead.${NC}"
  USE_NPX=true
else
  echo -e "${GREEN}✓ Netlify CLI found${NC}"
fi
echo

# Step 3: Check site link status
echo -e "${YELLOW}Step 3: Checking if site is linked to Netlify...${NC}"

if [ -f ".netlify/state.json" ]; then
  echo -e "${GREEN}✓ Project is linked to a Netlify site${NC}"
  SITE_ID=$(grep -o '"siteId": "[^"]*' .netlify/state.json | cut -d'"' -f4)
  echo -e "Site ID: ${BLUE}$SITE_ID${NC}"
  
  if [ "$USE_NPX" = true ]; then
    echo -e "${YELLOW}Getting site information via npx...${NC}"
    SITE_INFO=$(npx netlify-cli sites:list | grep "$SITE_ID")
  else
    echo -e "${YELLOW}Getting site information...${NC}"
    SITE_INFO=$(netlify sites:list | grep "$SITE_ID")
  fi
  
  if [ -n "$SITE_INFO" ]; then
    SITE_NAME=$(echo $SITE_INFO | awk '{print $1}')
    SITE_URL="https://$SITE_NAME.netlify.app"
    
    echo -e "${GREEN}✓ Site information:${NC}"
    echo -e "  Name: ${BLUE}$SITE_NAME${NC}"
    echo -e "  URL:  ${BLUE}$SITE_URL${NC}"
    
    # Check deployment status
    echo
    echo -e "${YELLOW}Checking latest deployment status...${NC}"
    if [ "$USE_NPX" = true ]; then
      npx netlify-cli sites:info "$SITE_ID"
    else
      netlify sites:info "$SITE_ID"
    fi
  else
    echo -e "${RED}Error: Couldn't find information for site ID: $SITE_ID${NC}"
    echo -e "This might happen if the site was deleted from Netlify but the local link remains."
  fi
else
  echo -e "${RED}✗ Project is not linked to any Netlify site${NC}"
  echo -e "Run ${YELLOW}./deploy-netlify.sh${NC} first to create and link a site."
fi

echo
echo -e "${GREEN}${BOLD}=== Status Check Complete ===${NC}"
echo
echo -e "To open the site in your browser:"
echo -e "  ${YELLOW}netlify open:site${NC}"
echo
echo -e "To view deployments in Netlify Dashboard:"
echo -e "  ${YELLOW}netlify open${NC}"
