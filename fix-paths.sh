#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Mockitup.ai Path Fixer ===${NC}"
echo

# Determine if we're using the incorrect path
CURRENT_DIR=$(pwd)
INCORRECT_PATH="/valentinechideme"
CORRECT_PATH="/Users/valentinechideme"

# Check if we're in the incorrect path
if [[ "$CURRENT_DIR" == *"$INCORRECT_PATH"* ]]; then
  echo -e "${YELLOW}Detected incorrect path:${NC} $CURRENT_DIR"
  
  # Create the correct path if needed
  CORRECT_FULL_PATH=${CURRENT_DIR//$INCORRECT_PATH/$CORRECT_PATH}
  echo -e "${GREEN}Correct path should be:${NC} $CORRECT_FULL_PATH"
  
  # Check if the correct path exists
  if [ -d "$CORRECT_FULL_PATH" ]; then
    echo -e "${GREEN}✓ Correct directory exists${NC}"
    echo
    echo -e "${YELLOW}Changing to correct directory...${NC}"
    cd "$CORRECT_FULL_PATH"
    echo -e "${GREEN}✓ Changed to:${NC} $(pwd)"
    echo
    echo -e "${YELLOW}Creating symbolic link for convenience...${NC}"
    
    # Create parent directories if they don't exist
    mkdir -p "$(dirname "$INCORRECT_PATH")"
    
    # Remove existing symbolic link if it exists
    if [ -L "$INCORRECT_PATH" ]; then
      rm "$INCORRECT_PATH"
    fi
    
    # Create symbolic link
    ln -s "$CORRECT_PATH" "$INCORRECT_PATH" 2>/dev/null || echo -e "${RED}× Failed to create symbolic link (may require sudo)${NC}"
    
    echo -e "${GREEN}✓ Set up complete!${NC}"
    echo
    echo -e "Both paths should now work:"
    echo -e "  ${YELLOW}$CORRECT_PATH${NC}"
    echo -e "  ${YELLOW}$INCORRECT_PATH${NC}"
  else
    echo -e "${RED}× Correct directory doesn't exist!${NC}"
    echo
    echo -e "${YELLOW}Creating directory structure...${NC}"
    mkdir -p "$CORRECT_FULL_PATH"
    
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}✓ Created directory: $CORRECT_FULL_PATH${NC}"
      echo -e "${YELLOW}Copying files from current directory...${NC}"
      
      # Copy all files and folders
      cp -R ./* "$CORRECT_FULL_PATH/" 2>/dev/null
      cp -R ./.* "$CORRECT_FULL_PATH/" 2>/dev/null
      
      echo -e "${GREEN}✓ Files copied${NC}"
      echo
      echo -e "${YELLOW}Please use the correct path going forward:${NC}"
      echo -e "${GREEN}cd $CORRECT_FULL_PATH${NC}"
    else
      echo -e "${RED}× Failed to create directory structure${NC}"
      echo
      echo -e "${YELLOW}Please manually correct your path:${NC}"
      echo -e "${GREEN}cd $CORRECT_FULL_PATH${NC}"
    fi
  fi
else
  echo -e "${GREEN}✓ You're already using the correct path: $CURRENT_DIR${NC}"
fi

echo
echo -e "${GREEN}=== Path Fix Complete ===${NC}"
echo
echo -e "To ensure correct paths in future sessions, add this to your ~/.zshrc file:"
echo -e "${YELLOW}alias cdmockitup='cd $CORRECT_PATH/Documents/augment-projects/mockitupai'${NC}"
echo