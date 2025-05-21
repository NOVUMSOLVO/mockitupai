#!/bin/bash
# Build verification script for Mockitup.ai
# This script checks the production build output for common issues

echo "=================================================="
echo "🔍 MOCKITUP.AI BUILD VERIFICATION"
echo "=================================================="
echo ""

# Change to script directory
cd "$(dirname "$0")"

# Check if build directory exists
if [ ! -d "build" ]; then
  echo "❌ Build directory not found. Run 'npm run build' first."
  exit 1
fi

echo "✅ Build directory found"

# Check key files
echo ""
echo "Checking key files..."

KEY_FILES=(
  "build/index.html"
  "build/static/js/main.*.js"
  "build/static/css/main.*.css"
  "build/manifest.json"
)

MISSING_FILES=0
for pattern in "${KEY_FILES[@]}"; do
  # Use find to handle wildcard patterns
  if [[ "$pattern" == *"*"* ]]; then
    if ! find build -path "$pattern" -type f | grep -q .; then
      echo "❌ Missing: $pattern"
      MISSING_FILES=$((MISSING_FILES+1))
    else
      echo "✅ Found: $pattern"
    fi
  else
    if [ ! -f "$pattern" ]; then
      echo "❌ Missing: $pattern"
      MISSING_FILES=$((MISSING_FILES+1))
    else
      echo "✅ Found: $pattern"
    fi
  fi
done

if [ $MISSING_FILES -gt 0 ]; then
  echo ""
  echo "❌ Found $MISSING_FILES missing files in the build."
else
  echo ""
  echo "✅ All key files are present in the build."
fi

# Check file sizes
echo ""
echo "Checking bundle sizes..."

# Get main JS file
MAIN_JS=$(find build/static/js -name "main.*.js" -type f)
if [ ! -z "$MAIN_JS" ]; then
  JS_SIZE=$(du -h "$MAIN_JS" | cut -f1)
  echo "Main JS bundle size: $JS_SIZE"
  
  # Warning if JS bundle is large
  JS_SIZE_BYTES=$(du -b "$MAIN_JS" | cut -f1)
  if [ $JS_SIZE_BYTES -gt 2000000 ]; then  # Larger than ~2MB
    echo "⚠️ Warning: Main JS bundle is quite large, consider code splitting."
  fi
fi

# Get main CSS file
MAIN_CSS=$(find build/static/css -name "main.*.css" -type f)
if [ ! -z "$MAIN_CSS" ]; then
  CSS_SIZE=$(du -h "$MAIN_CSS" | cut -f1)
  echo "Main CSS bundle size: $CSS_SIZE"
fi

# Check for source maps in production
echo ""
echo "Checking for source maps..."
SOURCE_MAPS=$(find build/static -name "*.map" | wc -l)
if [ $SOURCE_MAPS -gt 0 ]; then
  echo "⚠️ Warning: Found $SOURCE_MAPS source map files in the build."
  echo "   Consider removing source maps for production deployment."
else
  echo "✅ No source maps found in production build."
fi

# Check for environment variables in built files
echo ""
echo "Checking for sensitive information in built files..."

# Keywords to check for in built JS files
SENSITIVE_PATTERNS=(
  "your-api-key"
  "your-stripe-publishable-key"
  "your-stripe-secret-key"
  "your-paypal-client-id"
  "your-private-key"
  "firebase"
  "service_account"
)

FOUND_SENSITIVE=0
for pattern in "${SENSITIVE_PATTERNS[@]}"; do
  if grep -q "$pattern" build/static/js/*; then
    echo "⚠️ Warning: Found potential sensitive pattern '$pattern' in JS files."
    FOUND_SENSITIVE=$((FOUND_SENSITIVE+1))
  fi
done

if [ $FOUND_SENSITIVE -gt 0 ]; then
  echo "⚠️ Found $FOUND_SENSITIVE potential sensitive patterns in built files."
  echo "   Please review your code to ensure no secrets are exposed."
else
  echo "✅ No obvious sensitive information found in built files."
fi

# Verify test-connection.html was included in the build
echo ""
echo "Checking for test connection file..."
if [ -f "build/test-connection.html" ]; then
  echo "✅ test-connection.html is included in the build."
else
  echo "⚠️ test-connection.html is missing from the build."
fi

echo ""
echo "=================================================="
echo "📊 BUILD VERIFICATION SUMMARY"
echo "=================================================="

if [ $MISSING_FILES -eq 0 ] && [ $FOUND_SENSITIVE -eq 0 ]; then
  echo "✅ Build verification PASSED"
else
  echo "⚠️ Build verification completed with warnings"
fi

echo ""
echo "Next steps:"
echo "1. Run the pre-deployment check: ./pre-deployment-check.sh"
echo "2. Test the build: npm run serve (to serve the build folder)"
echo "3. Deploy using ./deploy-automation.sh"
echo ""
