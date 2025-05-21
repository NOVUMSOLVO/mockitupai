#!/bin/bash
# filepath: /Users/valentinechideme/Documents/augment-projects/mockitupai/test-payment-system.sh
# Test payment system for Mockitup.ai
# This script checks all components of the payment system

echo "====== Mockitup.ai Payment System Verification ======"
echo ""

# Check if .env file exists
if [ -f .env ]; then
  echo "✅ .env file exists"
else
  echo "❌ .env file not found - Creating from template"
  cp .env.example .env
  echo "   Please edit .env file with your actual credentials"
fi

# Check for required dependencies
echo ""
echo "Checking required dependencies..."
npm list @stripe/react-stripe-js @stripe/stripe-js firebase react-router-dom @paypal/react-paypal-js stripe cors dotenv firebase-admin jsonwebtoken --depth=0 || {
  echo "❌ Some dependencies are missing"
  echo "Running package installation..."
  chmod +x ./install-payment-deps.sh
  ./install-payment-deps.sh
}

# Check environment variables
echo ""
echo "Checking environment variables..."
if grep -q "your-stripe-publishable-key" .env; then
  echo "❌ Warning: Stripe publishable key appears to be a placeholder"
  echo "   Update REACT_APP_STRIPE_PUBLISHABLE_KEY in .env"
else
  echo "✅ Stripe publishable key appears to be set"
fi

if grep -q "your-stripe-secret-key" .env; then
  echo "❌ Warning: Stripe secret key appears to be a placeholder"
  echo "   Update STRIPE_SECRET_KEY in .env"
else
  echo "✅ Stripe secret key appears to be set"
fi

if grep -q "your-paypal-client-id" .env; then
  echo "❌ Warning: PayPal client ID appears to be a placeholder"
  echo "   Update REACT_APP_PAYPAL_CLIENT_ID in .env"
else
  echo "✅ PayPal client ID appears to be set"
fi

if grep -q "your-project-id" .env; then
  echo "❌ Warning: Firebase configuration appears to use placeholders"
  echo "   Update Firebase configuration in .env"
else
  echo "✅ Firebase configuration appears to be set"
fi

# Check for price IDs
echo ""
echo "Checking price IDs in implementation..."
if ! grep -q "REACT_APP_PAYPAL_PLAN_ID_PRO=" .env || grep -q "REACT_APP_PAYPAL_PLAN_ID_PRO=$" .env; then
  echo "❌ Warning: PayPal plan IDs are missing or empty in .env"
  echo "   Update the PayPal plan IDs with actual values using './update-paypal-ids.sh'"
else
  echo "✅ PayPal plan IDs appear to be set in .env"
fi

if ! grep -q "STRIPE_PRICE_ID_PRO=" .env || grep -q "STRIPE_PRICE_ID_PRO=$" .env; then
  echo "❌ Warning: Stripe price IDs are missing or empty in .env"
  echo "   Update STRIPE_PRICE_ID_PRO and STRIPE_PRICE_ID_UNLIMITED with actual values"
else
  echo "✅ Stripe price IDs appear to be set"
fi

# Check Firebase service account
echo ""
echo "Checking Firebase service account..."
if grep -q "your-project-id" .env; then
  echo "❌ Warning: Firebase service account appears to use placeholder values"
  echo "   Update FIREBASE_SERVICE_ACCOUNT in .env with your actual service account credentials"
else
  echo "✅ Firebase service account appears to be configured"
fi

# Check webhook configuration
echo ""
echo "Checking webhook configuration..."
if grep -q "whsec_your-webhook-secret" .env; then
  echo "❌ Warning: Stripe webhook secret is using a placeholder"
  echo "   Update STRIPE_WEBHOOK_SECRET in .env"
else
  echo "✅ Stripe webhook secret appears to be set"
fi

# Final recommendations
echo ""
echo "====== Babel Configuration Check ======"
echo ""
echo "Testing Babel configuration with payment component..."

# Create a test file that imports PayPalCheckout
echo "import React from 'react';
import PayPalCheckout from './src/payments/PayPalCheckout';

const TestComponent = () => {
  const mockPlan = { 
    id: 'pro', 
    name: 'Pro Plan', 
    price: '\$10/month' 
  };
  
  return (
    <PayPalCheckout 
      plan={mockPlan}
      onClose={() => console.log('closed')}
    />
  );
};

export default TestComponent;" > payment-test.jsx

# Try parsing with Babel
echo "Trying to parse payment-test.jsx..."
npx babel payment-test.jsx --out-file payment-test.compiled.js 2>/dev/null

if [ -f payment-test.compiled.js ]; then
  echo "✅ Successfully compiled payment component with Babel"
  rm -f payment-test.jsx payment-test.compiled.js
else
  echo "❌ Failed to compile payment component with Babel"
  echo "   Run ./fix-babel-configuration.sh to fix Babel issues"
fi

echo ""
echo "====== Payment System Verification Complete ======"
echo ""
echo "Recommendations:"
echo "2. Test a complete subscription flow with Stripe test cards"
echo "1. Set up test mode in Stripe and PayPal to safely verify integration"
echo "3. Test a complete subscription flow with PayPal sandbox"
echo "4. Verify subscription status updates in Firebase"
echo "5. Test cancellation flow"
echo ""
echo "Run the server to test the payment integration:"
echo "node server.js"
echo ""
echo "For production deployment, don't forget to:"
echo "1. Update webhook URLs to your production domain"
echo "2. Ensure SSL is enabled for secure payment processing"
echo "3. Test the production integration with real transactions"

# Create log directory if it doesn't exist
if [ ! -d "logs" ]; then
  mkdir logs
  echo "✅ Created logs directory for payment transaction logs"
fi

echo ""
echo "Would you like to start the test server? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  echo "Starting server..."
  node server.js
else
  echo "Exiting. Run 'node server.js' when you're ready to test."
fi
