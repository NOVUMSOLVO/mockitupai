#!/bin/bash

# Non-interactive Netlify deployment script
# This script will deploy your application to Netlify without requiring user input

# Log file
LOG_FILE="netlify-deploy-auto-log.txt"
echo "Starting automated Netlify deployment at $(date)" > $LOG_FILE

# Check paths
CURRENT_PATH=$(pwd)
echo "Current path: $CURRENT_PATH" >> $LOG_FILE
if [[ "$CURRENT_PATH" == "/valentinechideme"* ]]; then
  echo "Warning: Incorrect path detected." >> $LOG_FILE
  CORRECT_PATH="/Users${CURRENT_PATH}"
  echo "Switching to correct path: $CORRECT_PATH" >> $LOG_FILE
  cd "$CORRECT_PATH" || {
    echo "Failed to change directory." >> $LOG_FILE
    exit 1
  }
fi

echo "Working in directory: $(pwd)" >> $LOG_FILE

# Build the project
echo "Building project..." >> $LOG_FILE
npm run build >> $LOG_FILE 2>&1
if [ $? -ne 0 ]; then
  echo "Build failed. See log for details." >> $LOG_FILE
  exit 1
else
  echo "Build completed successfully." >> $LOG_FILE
fi

# Deploy using npx
echo "Deploying to Netlify..." >> $LOG_FILE
echo "Using npx netlify-cli to deploy" >> $LOG_FILE

# Create netlify.toml if it doesn't exist
if [ ! -f "netlify.toml" ]; then
  echo "Creating netlify.toml file..." >> $LOG_FILE
  cat > netlify.toml << EOF
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF
  echo "netlify.toml file created." >> $LOG_FILE
fi

# Install netlify-cli locally just for this deployment
echo "Installing netlify-cli locally..." >> $LOG_FILE
npm install --no-save netlify-cli >> $LOG_FILE 2>&1

# Try to deploy (this will work if already authenticated, otherwise will fail)
echo "Attempting deployment..." >> $LOG_FILE
npx netlify-cli deploy --prod --dir=build >> $LOG_FILE 2>&1
DEPLOY_STATUS=$?

# Check deployment status
if [ $DEPLOY_STATUS -eq 0 ]; then
  echo "Deployment successful!" >> $LOG_FILE
else
  echo "Deployment command failed with status $DEPLOY_STATUS" >> $LOG_FILE
  echo "This might be because you're not authenticated with Netlify." >> $LOG_FILE
  echo "Please run 'npx netlify-cli login' manually first, then try again." >> $LOG_FILE
fi

echo "Deployment script completed. Check $LOG_FILE for details." >> $LOG_FILE
echo "You can view the log file with: cat $LOG_FILE"

# Write a simple HTML report
cat > netlify-deploy-report.html << EOF
<!DOCTYPE html>
<html>
<head>
  <title>Netlify Deployment Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #0069ff; }
    pre { background: #f1f1f1; padding: 10px; border-radius: 4px; overflow-x: auto; }
    .success { color: green; }
    .error { color: red; }
  </style>
</head>
<body>
  <h1>Netlify Deployment Report</h1>
  <p>Generated on $(date)</p>
  <h2>Deployment Log</h2>
  <pre>$(cat $LOG_FILE)</pre>
  
  <h2>Next Steps</h2>
  <ol>
    <li>If deployment was successful, your site should be available at https://[site-name].netlify.app</li>
    <li>If authentication failed, please run <code>npx netlify-cli login</code> in your terminal</li>
    <li>For additional help, see the <a href="https://docs.netlify.com/">Netlify documentation</a></li>
  </ol>
</body>
</html>
EOF

echo "A detailed HTML report has been created: netlify-deploy-report.html"
