# Quick Start Guide for Mockitup.ai

This guide provides quick instructions to get your Mockitup.ai application up and running.

## The Easy Way

We've created a simple launcher script that handles all setup and provides options for running the app:

```bash
# Make sure you're in the correct directory
cd /Users/valentinechideme/Documents/augment-projects/mockitupai

# Fix permissions for all scripts at once
chmod +x fix-permissions.sh && ./fix-permissions.sh

# Run the launcher
./start.sh
```

## Setting Up Manually

1. **First, add execute permissions to all scripts:**
   ```bash
   chmod +x run.sh build.sh test-connection.js dev-server.js
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Testing Your Connection

If you're having connection issues, start with a simple test:

```bash
# Make the script executable (if not already done)
chmod +x test-connection.js

# Run the test server
node test-connection.js
```

Then open your browser to http://localhost:5000 to verify your connection works. Press Ctrl+C in the terminal to stop the test server.

## Running the Application

### Option 1: Use our interactive script

```bash
./run.sh
```

This script provides a menu to choose different options.

### Option 2: Run commands directly

Start the development server:
```bash
npm start
```

Or build and serve the production version:
```bash
npm run build
npm run serve
```

## Troubleshooting

If you encounter any issues, please refer to the TROUBLESHOOTING.md file.

## Troubleshooting

If you're not sure if a server is running, use our server check script:

```bash
# Make executable first
chmod +x check-server.sh

# Run the check
./check-server.sh
```

This will detect if any server is running on common ports.

## Next Steps

After your application is running, you can:
1. Customize the UI in src/App.js
2. Deploy to services like Netlify or Vercel using our included config files
