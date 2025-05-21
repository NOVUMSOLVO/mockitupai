#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

clear
echo -e "${GREEN}=== Mockitup.ai Application Runner and Troubleshooter ===${NC}"
echo

# Function to check if a port is in use
check_port() {
  local port=$1
  lsof -i :$port >/dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo -e "${RED}Port $port is already in use by another application!${NC}"
    echo "Try running with a different port:"
    echo "  PORT=8080 npm start"
    return 1
  else
    echo -e "${GREEN}Port $port is available${NC}"
    return 0
  fi
}

# Function to check Node.js and npm
check_environment() {
  # Check if Node.js is installed
  if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed!${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    return 1
  fi

  # Check Node.js version
  node_version=$(node -v | cut -d 'v' -f 2)
  node_major=$(echo $node_version | cut -d '.' -f 1)
  if [ $node_major -lt 14 ]; then
    echo -e "${YELLOW}Warning: Node.js version $node_version detected. Version 14.0.0 or later is recommended.${NC}"
  else
    echo -e "${GREEN}Node.js version $node_version - OK${NC}"
  fi

  # Check if npm is installed
  if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed!${NC}"
    return 1
  fi

  # Check npm version
  npm_version=$(npm -v)
  echo -e "${GREEN}npm version $npm_version - OK${NC}"
  return 0
}

# Function to run a specific server
run_server() {
  local server_type=$1
  local port=$2

  case $server_type in
    development)
      echo -e "${YELLOW}Starting development server on port $port...${NC}"
      check_port $port
      if [ $? -eq 0 ]; then
        PORT=$port npm start
      fi
      ;;
    simple)
      echo -e "${YELLOW}Starting simple server on port $port...${NC}"
      check_port $port
      if [ $? -eq 0 ]; then
        PORT=$port node dev-server.js
      fi
      ;;
    test)
      echo -e "${YELLOW}Starting connection test server on port $port...${NC}"
      check_port $port
      if [ $? -eq 0 ]; then
        # Update PORT in the test script
        sed -i '' "s/const PORT = [0-9]\\+;/const PORT = $port;/" test-connection.js
        node test-connection.js
      fi
      ;;
    production)
      echo -e "${YELLOW}Building and starting production server on port $port...${NC}"
      check_port $port
      if [ $? -eq 0 ]; then
        npm run build
        PORT=$port node server.js
      fi
      ;;
    *)
      echo -e "${RED}Unknown server type: $server_type${NC}"
      echo "Valid types: development, simple, test, production"
      return 1
      ;;
  esac
}

# Check environment first
check_environment
if [ $? -ne 0 ]; then
  echo -e "${RED}Environment check failed. Please fix the issues above and try again.${NC}"
  exit 1
fi

# Menu
echo
echo "Choose an option:"
echo "1) Start development server (React)"
echo "2) Start simple server"
echo "3) Run connection test"
echo "4) Build and run production server"
echo "5) Check environment"
echo "6) Exit"
echo

read -p "Enter your choice (1-6): " choice

case $choice in
  1)
    read -p "Port (default: 3000): " port
    port=${port:-3000}
    run_server development $port
    ;;
  2)
    read -p "Port (default: 5000): " port
    port=${port:-5000}
    run_server simple $port
    ;;
  3)
    read -p "Port (default: 5000): " port
    port=${port:-5000}
    run_server test $port
    ;;
  4)
    read -p "Port (default: 5000): " port
    port=${port:-5000}
    run_server production $port
    ;;
  5)
    echo -e "${YELLOW}Checking environment...${NC}"
    check_environment
    
    echo -e "${YELLOW}Checking port 3000...${NC}"
    check_port 3000
    
    echo -e "${YELLOW}Checking port 5000...${NC}"
    check_port 5000
    ;;
  6)
    echo "Exiting..."
    exit 0
    ;;
  *)
    echo -e "${RED}Invalid choice. Please run the script again.${NC}"
    exit 1
    ;;
esac
