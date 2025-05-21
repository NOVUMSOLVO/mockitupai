# Dynamic Port Configuration for Mockitup.ai

This guide explains how the dynamic port configuration works in the Mockitup.ai application.

## Overview

The application has been configured to automatically use any available port when starting servers. This solves common issues with port conflicts, especially when you have multiple servers running or when a port is already in use by another application.

## How It Works

1. When starting any server (development, production, or test), the application will:
   - Try to use the preferred port specified in the `.env` file (default: 5000)
   - If that port is unavailable, it will automatically try the next port (5001, 5002, etc.)
   - Once an available port is found, the server will start on that port
   - The actual port being used will be displayed in the console

2. This dynamic port assignment works for all server types:
   - React development server (`npm start` or `npm run dev`)
   - Simple development server (`npm run simple-server`)
   - Production server (`npm run serve` or `node server.js`)
   - Test connection server (`npm run test-connection`)

## Configuration Files

The dynamic port configuration is implemented in the following files:

- `setupPorts.js`: Central utility for finding available ports
- `reactPortSetup.js`: React-specific port setup
- `server.js`: Production server implementation
- `dev-server.js`: Simple development server
- `test-connection.js`: Testing server

## Environment Variables

You can control the port behavior using these environment variables:

- `PORT`: The preferred starting port (default: 5000)
- `REACT_APP_USE_DYNAMIC_PORT`: Whether to use dynamic port assignment for React (default: true)

## Examples

### Starting with a Specific Preferred Port

```bash
PORT=8000 npm start
```

This will try to use port 8000, and if it's not available, it will try 8001, 8002, etc.

### Disabling Dynamic Port for React

```bash
REACT_APP_USE_DYNAMIC_PORT=false npm start
```

This will use the default React behavior for port conflicts (which still handles conflicts but in a different way).

## Troubleshooting

If you experience issues with the port configuration:

1. Check if you have multiple servers running that might be using ports
2. Ensure you have the latest version of the configuration files
3. Try restarting your computer to clear any orphaned processes
4. Check firewall settings that might be blocking ports

## Technical Implementation

The dynamic port finder works by:
1. Attempting to create a temporary server on the preferred port
2. If successful, closing that server and returning the port
3. If unsuccessful, incrementing the port number and trying again
4. This process continues until an available port is found or a maximum number of attempts is reached
