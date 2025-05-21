# Payment System Debugging Tips

This document provides troubleshooting steps for common issues with the payment system integration in Mockitup.ai.

## Common Issues and Solutions

### 1. Environment Variable Issues

**Symptoms:**
- "Missing key" errors in the console
- "Configuration error" messages
- Payment buttons not rendering

**Solutions:**
1. Verify all environment variables are set in the `.env` file
2. Run `./test-payment-system.sh` to check for missing or incorrect values
3. Ensure environment variables are prefixed with `REACT_APP_` for client-side access

```bash
# Example of properly formatted environment variables
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
REACT_APP_PAYPAL_CLIENT_ID=your_client_id
REACT_APP_PAYPAL_PLAN_ID_PRO=P-your_plan_id
```

### 2. PayPal Button Not Rendering

**Symptoms:**
- PayPal button container is empty
- Console errors related to PayPal SDK

**Solutions:**
1. Check browser console for specific error messages
2. Verify PayPal Client ID is correct
3. Ensure PayPal plan IDs are valid and active in your PayPal Developer Dashboard
4. Try clearing browser cache or using incognito mode

### 3. Stripe Payment Failures

**Symptoms:**
- Payment attempts fail with error messages
- Webhook endpoint errors

**Solutions:**
1. Check Stripe Dashboard for detailed error information
2. Verify Stripe secret key and publishable key are set correctly
3. Ensure price IDs match those in your Stripe Dashboard
4. For webhook issues, check the webhook signature and endpoint URL

### 4. Firebase Integration Issues

**Symptoms:**
- User subscription status not updating
- Authentication errors

**Solutions:**
1. Verify Firebase configuration variables
2. Check Firebase rules to ensure they allow subscription data updates
3. Verify service account credentials if using admin functionality

### 5. Babel/Parsing Errors

**Symptoms:**
- Build failures mentioning Babel or parsing errors
- "Unexpected token" errors

**Solutions:**
1. Ensure babel.config.js and .babelrc are properly configured
2. Verify all dependencies are installed: 
   ```bash
   npm install --save-dev babel-preset-expo expo @babel/preset-env
   ```
3. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

## Logging

The payment system logs all transaction attempts to the `logs` directory. To view recent logs:

```bash
ls -la logs/
cat logs/recent-transactions.log
```

For detailed debugging, enable verbose logging by setting:

```bash
# Add to .env file
PAYMENT_DEBUG_MODE=true
```

## Testing Environment

Always use test/sandbox credentials for development:

1. Stripe test mode with test cards
2. PayPal sandbox environment
3. Local webhook testing using tools like ngrok

## Need Further Help?

1. Run the comprehensive diagnostic script:
   ```bash
   ./payment-setup-all.sh
   ```

2. Check the detailed testing guide:
   ```bash
   cat PAYMENT_TESTING_GUIDE.md
   ```

3. Review the logs for specific error messages
