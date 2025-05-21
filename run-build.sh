#!/bin/bash

# Set the PATH to include /usr/local/bin
export PATH="/usr/local/bin:$PATH"

# Verify Node.js and npm are accessible
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Run the build with the correct Node.js options
export NODE_OPTIONS=--openssl-legacy-provider
npm run build
