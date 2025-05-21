# Troubleshooting Guide for Mockitup.ai Application

## Permission Issues

### "Permission denied" when running scripts

If you see an error like `zsh: permission denied: ./run.sh` when trying to run any script, you need to add execute permissions:

```bash
# The easiest way: use our fix-permissions script
chmod +x fix-permissions.sh && ./fix-permissions.sh

# Or add execute permissions manually
chmod +x run.sh start.sh build.sh check-server.sh check-paths.sh test-connection.js dev-server.js
```

Then try running the script again.

## Connection Issues

If you're experiencing connection issues (ERR_CONNECTION_REFUSED), follow these steps:

### 1. Check for Port Conflicts

```bash
# Check if port 3000 is already in use
lsof -i :3000
```

If something is using port 3000, you can either:
- Stop that process
- Change the port in your application

### 2. Try Basic Connection Test

Run the basic connection test script:

```bash
node test-connection.js
```

Then open your browser to http://localhost:3000. If this works, the issue is with your React application, not with networking.

### 3. Check Firewall Settings

Make sure your firewall isn't blocking localhost connections:

```bash
# macOS specific firewall check
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
```

### 4. Try a Different Port

Edit the port number in these files:
- server.js
- dev-server.js
- test-connection.js

Change PORT from 3000 to something like 8080 or 5000.

### 5. Use Network Tools to Debug

```bash
# Check if the host is listening on port 3000
nc -zv localhost 3000

# Try a curl request
curl -v http://localhost:3000
```

## React Application Setup

To properly set up your React application with Tailwind CSS:

### 1. Ensure Dependencies Are Installed

```bash
npm install
```

### 2. Fix Tailwind CSS Configuration

Make sure your tailwind.config.js is properly configured:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

And ensure postcss.config.js contains:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 3. Properly Import Tailwind in CSS

In your src/index.css file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Run the Development Server

```bash
# Start the React development server
npm start

# If that doesn't work, try our simple server
npm run simple-server

# For a basic connectivity test
npm run test-connection
```

### 5. Build the Production Version

```bash
npm run build
npm run serve
```

## Common Errors and Solutions

### "Unknown at rule @tailwind"

This is just a warning from your editor and doesn't affect functionality. You can:
1. Install appropriate editor extensions for Tailwind CSS
2. Ignore these warnings

### Connection Refused Errors

1. Make sure no other process is using the specified port
2. Check your network configuration
3. Temporarily disable firewall and antivirus
4. Try using a different browser

### React Build Errors

1. Clear your node_modules and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

2. Check for JavaScript errors in your console

## Path Issues

### "File not found" or "Cannot find module" errors

If you're seeing errors related to files or modules not being found, you may have path-related issues. Use our path checker script:

```bash
# Run the path checker
./check-paths.sh
```

### Using incorrect path (missing '/Users' prefix)

If you're accessing the project via `/valentinechideme/...` instead of the correct path `/Users/valentinechideme/...`, we've created a special path fixing script:

```bash
# Fix path issues
chmod +x fix-paths.sh && ./fix-paths.sh
```

This script will:
1. Detect when you're using the incorrect path
2. Create the correct path structure if needed
3. Create a symbolic link so both paths work
4. Provide instructions for permanent fixes

You can also run `./start.sh` and select option 6 to fix path issues.

### Adding permanent path alias

For convenience, add this to your `~/.zshrc` file:

```bash
alias cdmockitup='cd /Users/valentinechideme/Documents/augment-projects/mockitupai'
```

Then you can simply type `cdmockitup` to navigate to the project regardless of your current location.

## Deployment

Once your application is working locally, deploy using:

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
netlify deploy
```

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## ESLint Issues

### ESLint warnings during build

If you see ESLint warnings when building your application:

```
The href attribute requires a valid value to be accessible...
```

You can fix these with our ESLint fixer script:

```bash
# Run the ESLint fixer
chmod +x fix-eslint.sh && ./fix-eslint.sh
```

This script will:
1. Install ESLint if needed
2. Create proper ESLint configuration
3. Fix common ESLint issues in your code
4. Add ESLint disable comments where appropriate
