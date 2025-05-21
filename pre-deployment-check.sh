#!/bin/bash
# Pre-deployment check script for Mockitup.ai
# This script runs all necessary tests before deployment

echo "====================================================="
echo "📋 MOCKITUP.AI PRE-DEPLOYMENT VERIFICATION CHECKLIST"
echo "====================================================="
echo ""

# Change to script directory
cd "$(dirname "$0")"

# Check environment variables
echo "🔍 Checking environment variables..."
if [ -f .env ]; then
  echo "  ✅ .env file exists"
  
  # Check for placeholder values
  ENV_ISSUES=0
  
  if grep -q "your-api-key" .env; then
    echo "  ⚠️ Firebase API key needs to be updated"
    ENV_ISSUES=$((ENV_ISSUES+1))
  fi
  
  if grep -q "your-stripe-publishable-key" .env; then
    echo "  ⚠️ Stripe publishable key needs to be updated"
    ENV_ISSUES=$((ENV_ISSUES+1))
  fi
  
  if grep -q "your-stripe-secret-key" .env; then
    echo "  ⚠️ Stripe secret key needs to be updated"
    ENV_ISSUES=$((ENV_ISSUES+1))
  fi
  
  if grep -q "your-paypal-client-id" .env; then
    echo "  ⚠️ PayPal client ID needs to be updated"
    ENV_ISSUES=$((ENV_ISSUES+1))
  fi
  
  if [ $ENV_ISSUES -eq 0 ]; then
    echo "  ✅ All environment variables appear to be set"
  else
    echo "  ⚠️ Found $ENV_ISSUES environment configuration issues"
  fi
else
  echo "  ❌ .env file not found - Creating from template"
  cp .env.example .env
  echo "  ⚠️ Please edit .env file with your actual credentials before deployment"
fi

echo ""
echo "🔄 Running dependency check..."
chmod +x ./fix-all-scripts.sh
./fix-all-scripts.sh

echo ""
echo "🧪 Testing server functionality..."
node test-server-standalone.js &
SERVER_PID=$!
sleep 3

# Test if server is running
if curl -s http://localhost:5000/health > /dev/null; then
  echo "  ✅ Server is running correctly"
  kill $SERVER_PID
else
  echo "  ❌ Failed to start server"
  kill $SERVER_PID 2>/dev/null
fi

echo ""
echo "📦 Testing build process..."
npm run build
if [ -d "build" ] && [ -f "build/index.html" ]; then
  echo "  ✅ Build completed successfully"
else
  echo "  ❌ Build process failed"
fi

echo ""
echo "💳 Testing payment system..."
chmod +x ./test-payment-system.sh
./test-payment-system.sh

echo ""
echo "🔍 Checking for common deployment issues..."
chmod +x ./check-paths.sh
./check-paths.sh

echo ""
echo "📁 Verifying log directories..."
if [ ! -d "logs" ]; then
  mkdir -p logs
  echo "  ✅ Created logs directory"
else
  echo "  ✅ Logs directory exists"
fi

echo ""
echo "====================================================="
echo "📝 PRE-DEPLOYMENT SUMMARY"
echo "====================================================="

# Check for build directory
if [ -d "build" ] && [ -f "build/index.html" ]; then
  echo "✅ Build files are ready for deployment"
else
  echo "❌ Build files are missing or incomplete"
fi

# Final checklist
echo ""
echo "Before deploying, ensure you have:"
echo "1. Updated all placeholder values in .env"
echo "2. Tested all payment flows"
echo "3. Verified Firebase configuration"
echo "4. Fixed any path issues (./check-paths.sh)"
echo ""
echo "To deploy, use one of these scripts:"
echo "- ./deploy-netlify.sh (for Netlify)"
echo "- ./deploy-vercel.sh (for Vercel)"
echo "- See DEPLOYMENT.md for more options"
echo ""
