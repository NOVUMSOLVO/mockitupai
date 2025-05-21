#!/bin/bash
# Test script to verify server functionality

echo "Running server test..."
echo "======================="

# Change directory to script location
cd "$(dirname "$0")"

# Make sure we have all dependencies installed
echo "Checking dependencies..."
npm install --no-audit > /dev/null

# Run the test server
echo "Starting test server..."
node test-server-standalone.js
