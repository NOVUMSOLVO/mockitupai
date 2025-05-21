#!/bin/bash
# Complete deployment automation script for Mockitup.ai
# This script handles all pre-deployment checks and deployment steps

echo "======================================================"
echo "🚀 MOCKITUP.AI DEPLOYMENT AUTOMATION"
echo "======================================================"
echo ""

# Change to script directory
cd "$(dirname "$0")"

# Step 1: Make all scripts executable
echo "🔧 Making all scripts executable..."
chmod +x *.sh

# Step 2: Run pre-deployment checks
echo ""
echo "🔍 Running pre-deployment checks..."
./pre-deployment-check.sh

# Step 3: Ask user if they want to continue with deployment
echo ""
read -p "Do you want to continue with deployment? (y/n): " continue_deployment
if [[ $continue_deployment != "y" && $continue_deployment != "Y" ]]; then
  echo "Deployment cancelled."
  exit 0
fi

# Step 4: Select deployment platform
echo ""
echo "📦 Select deployment platform:"
echo "1) Netlify"
echo "2) Vercel"
echo "3) Direct (Build only, no deployment)"
read -p "Enter your choice (1-3): " platform_choice

# Step 5: Setup environment for production
echo ""
echo "🌐 Setting up environment for production..."
if [ -f .env ]; then
  # Backup current .env
  cp .env .env.backup
  
  # Set NODE_ENV to production in .env
  if grep -q "NODE_ENV=" .env; then
    sed -i '' 's/NODE_ENV=.*/NODE_ENV=production/' .env
  else
    echo "NODE_ENV=production" >> .env
  fi
  
  echo "✅ Environment set to production"
else
  echo "❌ .env file not found. Please set up your environment variables."
  exit 1
fi

# Step 6: Setup logs directory
echo ""
echo "📝 Setting up logs directory..."
./setup-logs.sh

# Step 7: Build the application
echo ""
echo "🏗️ Building the application..."
npm run build

# Check if build was successful
if [ ! -d "build" ] || [ ! -f "build/index.html" ]; then
  echo "❌ Build failed. Check the errors above."
  exit 1
fi

echo "✅ Build successful"

# Step 8: Deploy based on selected platform
echo ""
case $platform_choice in
  1)
    echo "🚀 Deploying to Netlify..."
    ./deploy-netlify.sh
    ;;
  2)
    echo "🚀 Deploying to Vercel..."
    ./deploy-vercel.sh
    ;;
  3)
    echo "📦 Build completed. No deployment selected."
    echo "✅ Your application is ready in the 'build' directory."
    ;;
  *)
    echo "❌ Invalid choice. Deployment cancelled."
    exit 1
    ;;
esac

# Step 9: Post-deployment tasks
echo ""
echo "🧹 Running post-deployment tasks..."

# Restore development environment if needed
read -p "Restore environment to development mode? (y/n): " restore_env
if [[ $restore_env == "y" || $restore_env == "Y" ]]; then
  # Restore original .env
  mv .env.backup .env
  echo "✅ Environment restored to development mode"
else
  # Remove backup
  rm .env.backup
fi

echo ""
echo "======================================================"
echo "✅ DEPLOYMENT PROCESS COMPLETE"
echo "======================================================"
echo ""
echo "Next steps:"
echo "1. Verify your deployed application is working correctly"
echo "2. Check all payment flows in the production environment"
echo "3. Monitor for any errors or issues"
echo ""

# For Netlify or Vercel deployments, show the URL if available
if [[ $platform_choice == "1" && -f "netlify-status.txt" ]]; then
  DEPLOY_URL=$(grep -o 'https://[^ ]*' netlify-status.txt | head -1)
  if [ ! -z "$DEPLOY_URL" ]; then
    echo "Your application is deployed at: $DEPLOY_URL"
  fi
fi

echo "Thank you for using Mockitup.ai deployment automation!"
