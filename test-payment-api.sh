#!/bin/bash
# filepath: /Users/valentinechideme/Documents/augment-projects/mockitupai/test-payment-api.sh
# Test API endpoints for the payment system

echo "====== Testing Mockitup.ai Payment API Endpoints ======"
echo ""

# Configuration
BASE_URL="http://localhost:5000"
TEST_USER_ID="test-user-123"
TEST_EMAIL="test@example.com"
TEST_PAYMENT_METHOD="pm_card_visa"
TEST_STRIPE_PRICE="price_test"
TEST_PAYPAL_SUBSCRIPTION="sub_test"

# Check if server is running
echo "Checking if server is running..."
if ! curl -s "$BASE_URL" > /dev/null; then
  echo "❌ Server is not running. Starting server in the background..."
  node server.js > server.log 2>&1 &
  SERVER_PID=$!
  echo "Server started with PID: $SERVER_PID"
  echo "Waiting for server to start..."
  sleep 5
else
  echo "✅ Server is running"
fi

# Create temporary directory for response files
mkdir -p temp_responses

# Test 1: Create Stripe Subscription
echo ""
echo "=== Test 1: Create Stripe Subscription ==="
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "{\"paymentMethodId\":\"$TEST_PAYMENT_METHOD\",\"planId\":\"$TEST_STRIPE_PRICE\",\"userId\":\"$TEST_USER_ID\",\"email\":\"$TEST_EMAIL\"}" \
  "$BASE_URL/api/create-subscription" > temp_responses/create_subscription.json

if grep -q "subscriptionId" temp_responses/create_subscription.json; then
  echo "✅ Create Subscription API call successful"
  SUBSCRIPTION_ID=$(grep -o '"subscriptionId":"[^"]*' temp_responses/create_subscription.json | sed 's/"subscriptionId":"//')
  echo "   Subscription ID: $SUBSCRIPTION_ID"
else
  echo "❌ Create Subscription API call failed"
  cat temp_responses/create_subscription.json
fi

# Test 2: Get Subscription
echo ""
echo "=== Test 2: Get Subscription ==="
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$TEST_USER_ID\"}" \
  "$BASE_URL/api/get-subscription" > temp_responses/get_subscription.json

if grep -q "subscription" temp_responses/get_subscription.json; then
  echo "✅ Get Subscription API call successful"
else
  echo "❌ Get Subscription API call failed"
  cat temp_responses/get_subscription.json
fi

# Test 3: Cancel Subscription
echo ""
echo "=== Test 3: Cancel Subscription ==="
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "{\"subscriptionId\":\"$SUBSCRIPTION_ID\",\"userId\":\"$TEST_USER_ID\"}" \
  "$BASE_URL/api/cancel-subscription" > temp_responses/cancel_subscription.json

if grep -q "success" temp_responses/cancel_subscription.json; then
  echo "✅ Cancel Subscription API call successful"
else
  echo "❌ Cancel Subscription API call failed"
  cat temp_responses/cancel_subscription.json
fi

# Test 4: Confirm PayPal Subscription
echo ""
echo "=== Test 4: Confirm PayPal Subscription ==="
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "{\"subscriptionID\":\"$TEST_PAYPAL_SUBSCRIPTION\",\"planId\":\"pro\",\"userId\":\"$TEST_USER_ID\",\"email\":\"$TEST_EMAIL\"}" \
  "$BASE_URL/api/confirm-paypal-subscription" > temp_responses/confirm_paypal.json

if grep -q "success" temp_responses/confirm_paypal.json; then
  echo "✅ Confirm PayPal Subscription API call successful"
else
  echo "❌ Confirm PayPal Subscription API call failed"
  cat temp_responses/confirm_paypal.json
fi

# Test 5: Stripe Webhook
echo ""
echo "=== Test 5: Stripe Webhook ==="
echo "Note: This test will fail without a valid Stripe signature. Use Stripe CLI for proper testing."
echo "To properly test webhooks, run: stripe listen --forward-to http://localhost:5000/webhook/stripe"

# Test 6: PayPal Webhook
echo ""
echo "Note: This test will fail without a valid PayPal event body. Use PayPal Developer tools for proper testing."
echo "=== Test 6: PayPal Webhook ==="

# Clean up
echo ""
echo "Clean up temporary files..."
rm -rf temp_responses

# Kill server if we started it
if [ -n "$SERVER_PID" ]; then
  echo "Stopping server (PID: $SERVER_PID)..."
  kill $SERVER_PID
fi

echo ""
echo "====== API Endpoint Testing Complete ======"
echo ""
echo "For more comprehensive testing:"
echo "1. Set up actual test accounts in Stripe and PayPal"
echo "2. Update the test values in this script with real test IDs"
echo "3. Use Stripe CLI for webhook testing"
echo "4. Follow the guidelines in PAYMENT_TESTING_GUIDE.md"
