#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Log file for output
LOG_FILE="netlify-deploy-log.txt"
echo "Starting Netlify deployment at $(date)" > $LOG_FILE

echo -e "${GREEN}${BOLD}=== Mockitup.ai Netlify Deployment Script ===${NC}" | tee -a $LOG_FILE
echo -e "${BLUE}This script will guide you through creating and deploying your site to Netlify${NC}" | tee -a $LOG_FILE
echo "All output will be logged to $LOG_FILE"
echo | tee -a $LOG_FILE

# Step 1: Check paths and fix if necessary
echo -e "${YELLOW}Step 1: Checking path...${NC}" | tee -a $LOG_FILE
CURRENT_PATH=$(pwd)
echo "Current path: $CURRENT_PATH" >> $LOG_FILE
if [[ "$CURRENT_PATH" == "/valentinechideme"* ]]; then
  echo -e "${RED}Warning: You are using an incorrect path!${NC}" | tee -a $LOG_FILE
  echo -e "Current path: $CURRENT_PATH" | tee -a $LOG_FILE
  CORRECT_PATH="/Users${CURRENT_PATH}"
  echo -e "Correct path should be: ${GREEN}$CORRECT_PATH${NC}" | tee -a $LOG_FILE
  
  echo -e "${YELLOW}Switching to correct path...${NC}" | tee -a $LOG_FILE
  cd "$CORRECT_PATH" || {
    echo -e "${RED}Failed to change to correct directory.${NC}" | tee -a $LOG_FILE
    echo "Please manually run:" | tee -a $LOG_FILE
    echo "cd $CORRECT_PATH" | tee -a $LOG_FILE
    exit 1
  }
fi

echo -e "${GREEN}✓ Working in correct directory: $(pwd)${NC}" | tee -a $LOG_FILE
echo | tee -a $LOG_FILE

# Step 2: Install netlify-cli globally if not installed
echo -e "${YELLOW}Step 2: Checking for Netlify CLI...${NC}"
if ! command -v netlify &> /dev/null; then
  echo -e "${YELLOW}Netlify CLI not found. Installing...${NC}"
  npm install -g netlify-cli
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install Netlify CLI globally.${NC}"
    echo -e "${YELLOW}Will use npx to run netlify commands instead.${NC}"
    USE_NPX=true
  else
    echo -e "${GREEN}✓ Netlify CLI installed successfully${NC}"
    USE_NPX=false
  fi
else
  echo -e "${GREEN}✓ Netlify CLI already installed${NC}"
  USE_NPX=false
fi
echo

# Step 3: Check if user is logged in to Netlify
echo -e "${YELLOW}Step 3: Checking Netlify authentication...${NC}"

check_auth() {
  if [ "$USE_NPX" = true ]; then
    npx netlify-cli status | grep -q "Logged in"
  else
    netlify status | grep -q "Logged in"
  fi
  return $?
}

if ! check_auth; then
  echo -e "${YELLOW}You need to log in to Netlify first.${NC}"
  echo -e "Please follow the authentication process in your browser..."
  
  if [ "$USE_NPX" = true ]; then
    npx netlify-cli login
  else
    netlify login
  fi
  
  if ! check_auth; then
    echo -e "${RED}Authentication failed. Please try again later.${NC}"
    exit 1
  fi
fi

echo -e "${GREEN}✓ Successfully authenticated with Netlify${NC}"
echo

# Step 4: Check if site is already linked
echo -e "${YELLOW}Step 4: Checking for existing Netlify site link...${NC}"
SITE_NAME="mockitup-ai"

if [ -f ".netlify/state.json" ]; then
  echo -e "${GREEN}✓ Project is already linked to a Netlify site${NC}"
  SITE_ID=$(grep -o '"siteId": "[^"]*' .netlify/state.json | cut -d'"' -f4)
  
  if [ "$USE_NPX" = true ]; then
    SITE_NAME=$(npx netlify-cli sites:list | grep "$SITE_ID" | awk '{print $1}')
  else
    SITE_NAME=$(netlify sites:list | grep "$SITE_ID" | awk '{print $1}')
  fi
  
  echo -e "Linked to site: ${BLUE}$SITE_NAME${NC}"
else
  echo -e "${YELLOW}No linked Netlify site found.${NC}"
  echo -e "Would you like to:"
  echo -e "  1. Create a new Netlify site"
  echo -e "  2. Link to an existing Netlify site"
  echo -e "  3. Exit"
  
  read -p "Enter your choice (1-3): " site_choice
  
  case $site_choice in
    1)
      echo -e "${YELLOW}Creating a new Netlify site...${NC}"
      if [ "$USE_NPX" = true ]; then
        npx netlify-cli sites:create --name "$SITE_NAME" --manual
      else
        netlify sites:create --name "$SITE_NAME" --manual
      fi
      
      if [ $? -ne 0 ]; then
        echo -e "${YELLOW}Site creation might have failed. Attempting to continue anyway...${NC}"
      else
        echo -e "${GREEN}✓ Site created successfully${NC}"
      fi
      ;;
    2)
      echo -e "${YELLOW}Listing available Netlify sites...${NC}"
      if [ "$USE_NPX" = true ]; then
        npx netlify-cli sites:list
      else
        netlify sites:list
      fi
      
      echo
      read -p "Enter the site name you want to link to: " SITE_NAME
      ;;
    3)
      echo -e "${YELLOW}Exiting deployment process.${NC}"
      exit 0
      ;;
    *)
      echo -e "${RED}Invalid choice. Defaulting to creating a new site.${NC}"
      if [ "$USE_NPX" = true ]; then
        npx netlify-cli sites:create --name "$SITE_NAME" --manual
      else
        netlify sites:create --name "$SITE_NAME" --manual
      fi
      ;;
  esac
  
  # Link the site
  echo -e "${YELLOW}Linking project to Netlify site...${NC}"
  if [ "$USE_NPX" = true ]; then
    npx netlify-cli link --name "$SITE_NAME"
  else
    netlify link --name "$SITE_NAME"
  fi
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to link to Netlify site. Please try manually with:${NC}"
    echo -e "netlify link --name \"$SITE_NAME\""
    exit 1
  fi
  
  echo -e "${GREEN}✓ Successfully linked to Netlify site${NC}"
fi
echo

# Step 5: Build the project
echo -e "${YELLOW}Step 5: Building project...${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}Build failed. Please fix errors and try again.${NC}"
  exit 1
else
  echo -e "${GREEN}✓ Build completed successfully${NC}"
fi
echo

# Step 6: Deploy to Netlify
echo -e "${YELLOW}Step 6: Deploying to Netlify...${NC}"

# Ask if this should be a production deployment
echo -e "Is this a production deployment? (y/n)"
read -p "Enter your choice [y]: " prod_choice
prod_choice=${prod_choice:-y}

if [[ $prod_choice =~ ^[Yy]$ ]]; then
  DEPLOY_FLAG="--prod"
  echo -e "${BLUE}Deploying to production...${NC}"
else
  DEPLOY_FLAG="--message \"Draft deployment\""
  echo -e "${BLUE}Creating a draft deployment...${NC}"
fi

# Execute deployment
if [ "$USE_NPX" = true ]; then
  npx netlify-cli deploy $DEPLOY_FLAG
  DEPLOY_STATUS=$?
else
  netlify deploy $DEPLOY_FLAG
  DEPLOY_STATUS=$?
fi

if [ $DEPLOY_STATUS -ne 0 ]; then
  echo -e "${RED}Deployment with primary method failed. Trying alternative...${NC}"
  echo -e "Creating a temporary Netlify deployment script..."
  
  # Create temporary file for deploying with Netlify
  echo '{
    "name": "netlify-deploy-temp",
    "version": "1.0.0",
    "scripts": {
      "deploy": "netlify-cli deploy '"$DEPLOY_FLAG"'"
    },
    "dependencies": {
      "netlify-cli": "latest"
    }
  }' > netlify-deploy-temp.json
  
  echo -e "Installing temporary deployment tools..."
  npm install --prefix ./netlify-deploy-temp --package-lock=false
  
  echo -e "Trying deployment with temporary installation..."
  npx --prefix ./netlify-deploy-temp netlify-cli deploy $DEPLOY_FLAG
  DEPLOY_STATUS=$?
  
  # Clean up
  rm -rf netlify-deploy-temp netlify-deploy-temp.json
fi

if [ $DEPLOY_STATUS -eq 0 ]; then
  echo -e "${GREEN}${BOLD}✓ Deployment successful!${NC}"
else
  echo -e "${RED}Deployment process completed with errors.${NC}"
  echo -e "Please check the output above for details."
fi

echo
echo -e "${GREEN}${BOLD}=== Deployment Process Complete ===${NC}"
echo
echo -e "${BLUE}Your site should now be available at: https://$SITE_NAME.netlify.app${NC}"
echo
echo -e "${YELLOW}Useful Netlify commands for future reference:${NC}"
echo -e "1. ${GREEN}netlify login${NC} - Log in to your Netlify account"
echo -e "2. ${GREEN}netlify sites:list${NC} - List your Netlify sites"
echo -e "3. ${GREEN}netlify open${NC} - Open the dashboard for your site"
echo -e "4. ${GREEN}netlify deploy --prod${NC} - Deploy to production"
echo
echo -e "For further assistance, visit: ${BLUE}https://docs.netlify.com/cli/get-started/${NC}"
