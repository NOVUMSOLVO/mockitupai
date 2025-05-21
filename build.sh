#!/bin/bash

echo "🚀 Building Mockitup.ai React application..."

# Ensure node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Create production build
echo "🔨 Creating optimized production build..."
npx react-scripts build

echo "✅ Build complete! You can now run the application with:"
echo "   npm run serve"
