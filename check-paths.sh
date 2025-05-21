#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Path Checker for Mockitup.ai ===${NC}"
echo

# Check current directory
echo -e "${YELLOW}Current directory:${NC}"
pwd
echo

# Fix directory path if needed
CURRENT_PATH=$(pwd)
if [[ "$CURRENT_PATH" == "/valentinechideme"* ]]; then
  echo -e "${RED}Warning: You are using an incorrect path format!${NC}"
  echo -e "Current path: $CURRENT_PATH"
  CORRECT_PATH="/Users${CURRENT_PATH}"
  echo -e "Correct path should be: ${GREEN}$CORRECT_PATH${NC}"
  echo
fi

# Check user home directory
echo -e "${YELLOW}Home directory:${NC}"
echo ~
echo

# Check if the project exists in various potential locations
echo -e "${YELLOW}Checking for project in possible locations...${NC}"

locations=(
  "/Users/valentinechideme/Documents/augment-projects/mockitupai"
  "/valentinechideme/Documents/augment-projects/mockitupai"
  "~/Documents/augment-projects/mockitupai"
)

for loc in "${locations[@]}"; do
  if [ -d "$loc" ]; then
    echo -e "${GREEN}✓ Found project at: ${loc}${NC}"
  else
    echo -e "${RED}✗ Project not found at: ${loc}${NC}"
  fi
done

echo
echo -e "${YELLOW}Recommended commands to run:${NC}"
echo -e "1. ${GREEN}cd /Users/valentinechideme/Documents/augment-projects/mockitupai${NC}"
echo -e "2. ${GREEN}./start.sh${NC}"

echo
echo -e "${YELLOW}Note:${NC} Make sure to use the correct path in all your commands."
