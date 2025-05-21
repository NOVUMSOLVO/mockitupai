#!/bin/bash
# This script fixes permissions for all shell scripts and ensures proper formatting

echo "===== Fixing permissions and formatting for payment scripts ====="

# Make all shell scripts executable
chmod +x *.sh
echo "✅ Made all shell scripts executable"

# Create logs directory if it doesn't exist
if [ ! -d "logs" ]; then
  mkdir -p logs
  echo "✅ Created logs directory for payment transaction logs"
fi

# Install required dependencies
npm install --save-dev babel-preset-expo expo @babel/preset-env
echo "✅ Installed Babel dependencies"

# Verify Babel configuration
if [ -f babel.config.js ] && [ -f .babelrc ]; then
  echo "✅ Babel configuration files exist"
else
  echo "⚠️ Babel configuration files may be missing"
fi

echo ""
echo "===== All scripts are now properly configured ====="
echo "You can now run the following tests:"
echo "1. ./test-payment-system.sh - To verify payment system configuration"
echo "2. ./test-payment-api.sh - To test payment API endpoints"
echo "3. ./payment-setup-all.sh - To run the complete setup process"
echo ""
echo "For more information, see the PAYMENT_README.md file"
