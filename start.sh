#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Mockitup.ai Launcher ===${NC}"
echo

# Step 1: Fix permissions
echo -e "${YELLOW}Step 1: Setting executable permissions for all scripts...${NC}"
if [ -f "fix-permissions.sh" ]; then
  chmod +x fix-permissions.sh && ./fix-permissions.sh
else
  chmod +x run.sh build.sh check-server.sh check-paths.sh test-connection.js dev-server.js server.js
fi
echo -e "${GREEN}✓ Permissions set successfully${NC}"

# Step 2: Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Step 2: Installing dependencies...${NC}"
  npm install
  echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
  echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

# Check for path issues and prompt to fix
CURRENT_PATH=$(pwd)
if [[ "$CURRENT_PATH" == "/valentinechideme"* ]]; then
  echo -e "${RED}Warning: You are using an incorrect path!${NC}"
  echo -e "Current path: $CURRENT_PATH"
  CORRECT_PATH="/Users${CURRENT_PATH}"
  echo -e "Correct path should be: ${GREEN}$CORRECT_PATH${NC}"
  
  if [ -f "fix-paths.sh" ]; then
    echo -e "${YELLOW}Would you like to fix this path issue now?${NC}"
    read -p "Fix path issue? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      echo "This requires administrative permissions."
      sudo ./fix-paths.sh
      echo "Path fixing complete. Please continue."
    fi
  fi
  echo
fi

# Step 3: Choose what to run
echo
echo -e "${YELLOW}What would you like to run?${NC}"
echo "1) Test connection (simplest)"
echo "2) Simple development server"
echo "3) Full React development server"
echo "4) Build and run production version"
echo "5) Run comprehensive tests"
echo "6) Check and fix path issues"
echo "7) Deploy to production"
echo

read -p "Enter your choice (1-7): " choice

case $choice in
  1)
    echo -e "${YELLOW}Starting connection test server...${NC}"
    echo -e "The server will find an available port automatically"
    echo -e "Check the terminal for the URL to open in your browser"
    echo -e "Press ${RED}Ctrl+C${NC} to stop the server"
    node test-connection.js
    ;;
  2)
    echo -e "${YELLOW}Starting simple development server...${NC}"
    echo -e "The server will find an available port automatically"
    echo -e "Check the terminal for the URL to open in your browser"
    echo -e "Press ${RED}Ctrl+C${NC} to stop the server"
    node dev-server.js
    ;;
  3)
    echo -e "${YELLOW}Starting React development server...${NC}"
    echo -e "The server will find an available port automatically"
    echo -e "This will open in your default browser automatically"
    echo -e "Press ${RED}Ctrl+C${NC} to stop the server"
    npm start
    ;;
  4)
    echo -e "${YELLOW}Building production version...${NC}"
    npm run build
    echo -e "${GREEN}✓ Build complete${NC}"
    echo -e "${YELLOW}Starting production server...${NC}"
    echo -e "The server will find an available port automatically"
    echo -e "Check the terminal for the URL to open in your browser"
    echo -e "Press ${RED}Ctrl+C${NC} to stop the server"
    node server.js
    ;;
  5)
    echo -e "${YELLOW}Running comprehensive tests...${NC}"
    chmod +x test-app.sh
    ./test-app.sh
    ;;
  6)
    echo -e "${YELLOW}Checking and fixing path issues...${NC}"
    chmod +x fix-paths.sh
    ./fix-paths.sh
    ;;
  7)
    echo -e "${YELLOW}Deployment options:${NC}"
    echo "1) Deploy to Netlify (Interactive Guided Process)"
    echo "2) Deploy to Vercel"
    echo "3) View detailed deployment documentation"
    echo "4) Back to main menu"
    read -p "Enter your deployment choice (1-4): " deploy_choice
    
    case $deploy_choice in
      1)
        echo -e "${YELLOW}Deploying to Netlify...${NC}"
        echo -e "${GREEN}This interactive process will:${NC}"
        echo -e "- Check your environment and fix issues"
        echo -e "- Create a new Netlify site or link to existing one"
        echo -e "- Build and deploy your application"
        echo
        echo -e "${YELLOW}Do you want to continue? (y/n)${NC}"
        read -p "> " continue_deploy
        
        if [[ $continue_deploy =~ ^[Yy]$ ]]; then
          chmod +x deploy-netlify.sh
          ./deploy-netlify.sh
          
          echo
          echo -e "${GREEN}Deployment process completed!${NC}"
          echo -e "You can view more detailed deployment documentation in the ${YELLOW}NETLIFY.md${NC} file."
        else
          echo -e "${YELLOW}Deployment cancelled. Returning to main menu...${NC}"
          exec $0
        fi
        ;;
      2)
        echo -e "${YELLOW}Deploying to Vercel...${NC}"
        chmod +x deploy-vercel.sh
        ./deploy-vercel.sh
        ;;
      3)
        echo -e "${YELLOW}Opening deployment documentation...${NC}"
        echo -e "Please read the following files for detailed deployment instructions:"
        echo -e "- ${GREEN}DEPLOYMENT.md${NC} - General deployment information"
        echo -e "- ${GREEN}NETLIFY.md${NC} - Netlify-specific deployment guide"
        
        read -p "Press Enter to continue..."
        exec $0
        ;;
      4)
        echo -e "${YELLOW}Returning to main menu...${NC}"
        exec $0
        ;;
      *)
        echo -e "${RED}Invalid deployment choice${NC}"
        exec $0
        ;;
    esac
    ;;
  *)
    echo -e "${RED}Invalid choice${NC}"
    exit 1
    ;;
esac
