#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
  local port=$1
  echo -e "${YELLOW}Checking if something is running on port ${port}...${NC}"
  
  # Try using lsof
  if command -v lsof &> /dev/null; then
    echo "Using lsof to check port..."
    lsof_output=$(lsof -i :$port -sTCP:LISTEN 2>&1)
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}✓ Port ${port} is in use - a server appears to be running${NC}"
      echo "Details:"
      echo "$lsof_output"
      return 0
    else
      echo "lsof found no server on port $port"
    fi
  else
    echo "lsof command not available"
  fi
  
  # Try using netstat as fallback
  if command -v netstat &> /dev/null; then
    echo "Using netstat to check port..."
    netstat_output=$(netstat -an | grep LISTEN | grep $port)
    if [ -n "$netstat_output" ]; then
      echo -e "${GREEN}✓ Port ${port} is in use - a server appears to be running${NC}"
      echo "Details:"
      echo "$netstat_output"
      return 0
    else
      echo "netstat found no server on port $port"
    fi
  else
    echo "netstat command not available"
  fi
  
  echo -e "${RED}✗ No server detected on port ${port}${NC}"
  return 1
}

# Function to try connecting to a server
try_connect() {
  local port=$1
  echo -e "${YELLOW}Attempting to connect to server on port ${port}...${NC}"
  
  # Try using curl
  if command -v curl &> /dev/null; then
    echo "Using curl to test connection..."
    curl_output=$(curl -v http://localhost:$port 2>&1)
    curl_status=$?
    if [ $curl_status -eq 0 ]; then
      echo -e "${GREEN}✓ Successfully connected to server on port ${port}${NC}"
      echo -e "${GREEN}✓ Try opening http://localhost:${port} in your browser${NC}"
      return 0
    else
      echo -e "${RED}× Failed to connect with curl (status $curl_status)${NC}"
      echo "Curl output:"
      echo "$curl_output"
    fi
  else
    echo "curl command not available"
  fi
  
  # Try using wget as fallback
  if command -v wget &> /dev/null; then
    echo "Using wget to test connection..."
    wget_output=$(wget -v --spider http://localhost:$port 2>&1)
    wget_status=$?
    if [ $wget_status -eq 0 ]; then
      echo -e "${GREEN}✓ Successfully connected to server on port ${port}${NC}"
      echo -e "${GREEN}✓ Try opening http://localhost:${port} in your browser${NC}"
      return 0
    fi
  fi
  
  echo -e "${RED}✗ Could not connect to server on port ${port}${NC}"
  return 1
}

echo -e "${GREEN}=== Mockitup.ai Server Check ===${NC}"
echo

# Check common ports
echo "Checking common ports for running servers..."
check_port 3000 || check_port 5000 || check_port 8080

echo
echo -e "${YELLOW}If no server was detected, try running one of the following:${NC}"
echo "1. ./start.sh     # Interactive launcher"
echo "2. npm start      # React development server"
echo "3. node test-connection.js  # Simple test server"

exit 0
