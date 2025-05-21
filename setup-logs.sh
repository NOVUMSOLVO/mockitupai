#!/bin/bash
# Setup logs directory and permissions for Mockitup.ai

echo "Setting up logs directory..."

# Change to script directory
cd "$(dirname "$0")"

# Create logs directory if it doesn't exist
if [ ! -d "logs" ]; then
  mkdir -p logs
  echo "✅ Created logs directory"
else
  echo "✅ Logs directory already exists"
fi

# Create empty log files if they don't exist
touch logs/payment_transactions.log
touch logs/payment_errors.log

# Set proper permissions
chmod 755 logs
chmod 644 logs/*.log

echo "✅ Log files and permissions set up successfully"

# Verify payment logger functionality
echo "Verifying payment logger functionality..."
node -e "
const { logTransaction, logError } = require('./payment-logger');

// Test logging a transaction
logTransaction(
  'test.transaction', 
  'test', 
  'test-user-id', 
  { testData: 'This is a test transaction' }
);

// Test logging an error
logError(
  'test.error',
  'test',
  'test-user-id',
  new Error('This is a test error'),
  { testContext: 'Testing error logging' }
);

console.log('✅ Payment logger verification completed');
"

# Check if log files have content
if grep -q "test.transaction" logs/payment_transactions.log && grep -q "test.error" logs/payment_errors.log; then
  echo "✅ Logger is functioning correctly"
else
  echo "❌ Logger verification failed"
fi

echo "Logs setup completed"
