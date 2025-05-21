/**
 * Payment transaction logging utility
 * Use this to track payment actions and debug issues
 */

const fs = require('fs');
const path = require('path');
const logDir = path.join(__dirname, 'logs');

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Log file paths
const PAYMENT_LOG = path.join(logDir, 'payment_transactions.log');
const ERROR_LOG = path.join(logDir, 'payment_errors.log');

/**
 * Log a payment transaction
 * @param {string} action - The payment action (e.g., 'subscription.created')
 * @param {string} provider - The payment provider ('stripe' or 'paypal')
 * @param {string} userId - The user ID
 * @param {Object} data - Additional transaction data
 */
function logTransaction(action, provider, userId, data = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    action,
    provider,
    userId,
    ...data
  };
  
  fs.appendFileSync(
    PAYMENT_LOG, 
    JSON.stringify(logEntry) + '\n'
  );
}

/**
 * Log a payment error
 * @param {string} action - The action that failed
 * @param {string} provider - The payment provider ('stripe' or 'paypal')
 * @param {string} userId - The user ID (if available)
 * @param {Error} error - The error object
 * @param {Object} additionalData - Any additional context
 */
function logError(action, provider, userId, error, additionalData = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    action,
    provider,
    userId: userId || 'unknown',
    error: {
      message: error.message,
      stack: error.stack,
      code: error.code || error.statusCode
    },
    additionalData
  };
  
  fs.appendFileSync(
    ERROR_LOG, 
    JSON.stringify(logEntry) + '\n'
  );
}

/**
 * Get recent payment logs
 * @param {number} count - Number of recent logs to retrieve
 * @param {boolean} errorsOnly - Whether to get only error logs
 * @returns {Array} - Array of log entries
 */
function getRecentLogs(count = 10, errorsOnly = false) {
  const logFile = errorsOnly ? ERROR_LOG : PAYMENT_LOG;
  
  if (!fs.existsSync(logFile)) {
    return [];
  }
  
  try {
    const logs = fs.readFileSync(logFile, 'utf8')
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
    
    return logs.slice(-count).reverse();
  } catch (err) {
    console.error('Error reading logs:', err);
    return [];
  }
}

module.exports = {
  logTransaction,
  logError,
  getRecentLogs
};
