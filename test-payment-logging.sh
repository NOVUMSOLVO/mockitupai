#!/bin/bash
# filepath: /Users/valentinechideme/Documents/augment-projects/mockitupai/test-payment-logging.sh
# Test the payment logger functionality

echo "===== Testing Payment Logger Functionality ====="

# Create logs directory if it doesn't exist
mkdir -p logs

# Run the test script
node -e '
const logger = require("./payment-logger");

// Test transaction logging
console.log("Logging test transaction...");
logger.logTransaction(
  "subscription.created", 
  "stripe", 
  "test-user-123", 
  {
    planId: "pro", 
    amount: "9.99", 
    currency: "USD",
    subscriptionId: "sub_test123"
  }
);

// Test error logging
console.log("Logging test error...");
const testError = new Error("Test payment declined");
testError.code = "card_declined";
logger.logError(
  "payment.failed",
  "stripe",
  "test-user-123",
  testError,
  {
    cardBrand: "visa",
    last4: "1234",
    attemptCount: 1
  }
);

// Show recent logs
console.log("\nRecent transaction logs:");
const recentLogs = logger.getRecentLogs(5);
console.log(`Found ${recentLogs.length} recent transaction logs`);
if (recentLogs.length > 0) {
  console.log(JSON.stringify(recentLogs[0], null, 2));
}

console.log("\nRecent error logs:");
const recentErrors = logger.getRecentLogs(5, true);
console.log(`Found ${recentErrors.length} recent error logs`);
if (recentErrors.length > 0) {
  console.log(JSON.stringify(recentErrors[0], null, 2));
}
'

echo ""
echo "===== Payment Logger Test Complete ====="
echo "Check the logs directory for transaction and error logs"
echo "For debugging issues, review these logs for more details"
