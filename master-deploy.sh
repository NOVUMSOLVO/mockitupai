#!/bin/bash
# Master deployment script for Mockitup.ai
# This script runs all tests and prepares the app for deployment

echo "======================================================="
echo "🚀 MOCKITUP.AI MASTER DEPLOYMENT SCRIPT"
echo "======================================================="
echo ""

# Change to script directory
cd "$(dirname "$0")"

# Make all scripts executable
chmod +x *.sh

# Step 1: Environment Check
echo "🔍 Step 1/7: Checking environment..."
if [ ! -f .env ]; then
  echo "❌ .env file not found."
  echo "Creating from template..."
  cp .env.example .env
  echo "⚠️ Please edit .env with your credentials before proceeding."
  exit 1
fi

# Check key environment variables
ENV_ISSUES=0
ENV_VARS=(
  "REACT_APP_FIREBASE_API_KEY"
  "REACT_APP_STRIPE_PUBLISHABLE_KEY"
  "STRIPE_SECRET_KEY"
  "REACT_APP_PAYPAL_CLIENT_ID"
  "FIREBASE_SERVICE_ACCOUNT"
)

for var in "${ENV_VARS[@]}"; do
  if ! grep -q "^$var=" .env || grep -q "^$var=your-" .env; then
    echo "⚠️ $var is missing or appears to be a placeholder"
    ENV_ISSUES=$((ENV_ISSUES+1))
  fi
done

if [ $ENV_ISSUES -gt 0 ]; then
  echo "⚠️ Found $ENV_ISSUES environment issues. Please fix before deployment."
  read -p "Continue anyway? (y/n): " continue_env
  if [[ $continue_env != "y" && $continue_env != "Y" ]]; then
    exit 1
  fi
else
  echo "✅ Environment variables look good."
fi

# Step 2: Setup Logs
echo ""
echo "📝 Step 2/7: Setting up logs..."
./setup-logs.sh

# Step 3: Run Test Server
echo ""
echo "🧪 Step 3/7: Testing server..."
node test-server-standalone.js &
SERVER_PID=$!
sleep 3

# Test server health endpoint
if curl -s http://localhost:5000/health > /dev/null; then
  echo "✅ Server is running correctly."
  kill $SERVER_PID
else
  echo "❌ Server test failed."
  kill $SERVER_PID 2>/dev/null
  read -p "Continue anyway? (y/n): " continue_server
  if [[ $continue_server != "y" && $continue_server != "Y" ]]; then
    exit 1
  fi
fi

# Step 4: Payment System Test
echo ""
echo "💳 Step 4/7: Testing payment system..."
./test-payment-system.sh

# Step 5: Build Application
echo ""
echo "🏗️ Step 5/7: Building application..."
NODE_ENV=production npm run build

# Step 6: Verify Build
echo ""
echo "🔍 Step 6/7: Verifying build..."
./verify-build.sh

# Step 7: Prepare for Deployment
echo ""
echo "📦 Step 7/7: Preparing for deployment..."

# Choose deployment platform
echo "Select deployment platform:"
echo "1) Netlify"
echo "2) Vercel"
echo "3) Direct (no deployment, just build)"
read -p "Enter your choice (1-3): " platform_choice

case $platform_choice in
  1)
    echo "Deploying to Netlify..."
    ./deploy-netlify.sh
    ;;
  2)
    echo "Deploying to Vercel..."
    ./deploy-vercel.sh
    ;;
  3)
    echo "Build complete. No deployment selected."
    echo "Your application is ready in the 'build' directory."
    ;;
  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac

echo ""
echo "======================================================="
echo "✅ DEPLOYMENT PREPARATION COMPLETE"
echo "======================================================="
echo ""
echo "Your application has been tested and prepared for deployment."
echo "Please refer to DEPLOYMENT_CHECKLIST.md for post-deployment verification steps."
echo ""

# For deployed sites, show URL if available
if [[ $platform_choice == "1" && -f "netlify-status.txt" ]]; then
  deploy_url=$(grep -o 'https://[^ ]*' netlify-status.txt | head -1)
  if [ ! -z "$deploy_url" ]; then
    echo "Your application is deployed at: $deploy_url"
  fi
fi

echo "Thank you for using Mockitup.ai master deployment script!"
