#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Terminal Command Execution Tester ===${NC}"
echo

# Function to execute a command and display its output
execute_command() {
  local command="$1"
  local description="$2"
  
  echo -e "${BLUE}==== Testing: $description ====${NC}"
  echo -e "${YELLOW}Command: $command${NC}"
  echo
  
  # Execute the command and capture output and exit status
  output=$($command 2>&1)
  exit_status=$?
  
  echo -e "${YELLOW}Command output:${NC}"
  echo "$output"
  echo
  
  if [ $exit_status -eq 0 ]; then
    echo -e "${GREEN}✓ Command executed successfully (exit status: 0)${NC}"
  else
    echo -e "${RED}× Command failed with exit status: $exit_status${NC}"
  fi
  echo
}

# Test basic commands
echo "Testing basic commands..."
execute_command "ls -la" "Directory listing"
execute_command "node -v" "Node.js version"
execute_command "npm -v" "npm version"

# Test port checking
echo "Testing port checks..."
execute_command "lsof -i :5000 || echo 'No process using port 5000'" "Check for processes on port 5000"

# Test server response
echo "Testing HTTP requests..."
execute_command "curl -s -I http://localhost:5000 || echo 'Failed to connect'" "HTTP request"

echo -e "${GREEN}=== Command Testing Complete ===${NC}"
echo
echo "If commands are executing correctly but giving no output, there might be an issue with:"
echo "1. Terminal configuration"
echo "2. Command execution in this environment"
echo "3. Permission issues"
echo 
echo "Try running commands directly in a separate terminal window"
echo
