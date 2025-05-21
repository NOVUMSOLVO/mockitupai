#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Mockitup.ai Permission Fixer ===${NC}"
echo

# List of scripts to fix
scripts=(
  "run.sh"
  "start.sh"
  "build.sh"
  "check-server.sh"
  "check-paths.sh"
  "check-netlify-status.sh"
  "fix-paths.sh"
  "fix-eslint.sh"
  "test-app.sh"
  "test-terminal.sh"
  "dev-server.js"
  "test-connection.js"
  "server.js"
  "deploy-netlify.sh"
  "deploy-vercel.sh"
  "setup-payment-env.sh"
  "test-payment-system.sh"
  "test-payment-api.sh"
  "update-paypal-ids.sh"
  "install-payment-deps.sh"
)

# Fix permissions for each script
echo -e "${YELLOW}Setting executable permissions for all scripts...${NC}"
for script in "${scripts[@]}"; do
  if [ -f "$script" ]; then
    chmod +x "$script"
    echo -e "${GREEN}✓ Set permissions for ${script}${NC}"
  else
    echo -e "${RED}✗ Script not found: ${script}${NC}"
  fi
done

echo
echo -e "${GREEN}Permissions have been fixed. You can now run:${NC}"
echo -e "  ./start.sh        # Interactive launcher"
echo -e "  ./run.sh          # Advanced launcher"
echo -e "  ./check-server.sh # Check if server is running"
echo -e "  ./check-paths.sh  # Check correct paths"
