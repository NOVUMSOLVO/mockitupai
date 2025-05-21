# Running the Mockitup.ai Application

This guide provides comprehensive instructions for running the Mockitup.ai React application in different environments.

## Prerequisites

Before getting started, make sure you have:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Running in Development Mode

Development mode features hot reloading and other developer-friendly features.

### Using React Scripts

```bash
# Install dependencies (if not done already)
npm install

# Start the development server
npm start
```

Your application should now be running at http://localhost:3000.

### Using a Simple Server

If you're experiencing issues with the React development server:

```bash
# Start our simple dev server
npm run simple-server
```

This runs a simplified server that still serves your React application but with fewer features.

## Building for Production

To create an optimized production build:

```bash
# Create production build
npm run build
```

This will generate a `build` directory with optimized static files.

## Running Production Build Locally

To test your production build locally:

```bash
# After creating a production build
npm run serve
```

This runs the Express.js server that serves your production build, simulating a production environment locally.

## Testing Connection

If you're experiencing connection issues:

```bash
# Run the connection test server
npm run test-connection
```

This starts a minimal HTTP server to verify that network connections are working correctly.

## Dynamic Port Configuration

The application is configured to automatically find and use available ports:

```bash
# The server will automatically find an available port, starting from the preferred port
npm start
```

When any server starts:
1. It will try the port specified in `.env` (default: 5000)
2. If that port is unavailable, it automatically tries the next available port
3. The console will show which port is being used

For more details, see `PORT_CONFIGURATION.md`.

## Port Configuration

By default, servers run on port 3000. If you need to change this:

1. Edit the PORT variable in:
   - server.js
   - dev-server.js
   - test-connection.js

2. Or use the PORT environment variable:

```bash
PORT=5000 npm start
```

## Troubleshooting

If you encounter issues, please refer to `TROUBLESHOOTING.md` for common problems and solutions.

## Next Steps

Once your application is running correctly:

1. Customize the UI and components in src/App.js
2. Add additional pages and functionality
3. Connect to a backend API if needed
4. Deploy to your preferred hosting service

## Deployment

### Using Netlify

We've included a Netlify configuration:

```bash
npm install -g netlify-cli
netlify deploy
```

### Using Vercel

We've included a Vercel configuration:

```bash
npm install -g vercel
vercel
```

### Using GitHub Pages

```bash
npm install --save-dev gh-pages
```

Then add to package.json:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d build"
```

And deploy with:
```bash
npm run deploy
```
