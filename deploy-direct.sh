#!/bin/bash

# Direct Netlify deployment script (non-interactive)
# This script assumes you've already authenticated with Netlify CLI

# Create build directory if it doesn't exist
if [ ! -d "build" ]; then
  npm run build
fi

# Install netlify-cli locally if needed
npm install --no-save netlify-cli

# Deploy directly
npx netlify-cli deploy --prod --dir=build

# Create a status report
echo "Deployment completed at $(date)" > netlify-status.txt
echo "Please check https://app.netlify.com/ to verify your deployment" >> netlify-status.txt
echo "Your site should be available at https://[site-name].netlify.app" >> netlify-status.txt
