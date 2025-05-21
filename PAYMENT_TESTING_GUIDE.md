# Payment System Testing Guide

This guide will help you thoroughly test the payment system for your Mockitup.ai application.

## Prerequisites

Before testing, ensure you have:

1. Set up your development environment with all required dependencies
2. Created accounts with Stripe and PayPal
3. Configured your Firebase project
4. Updated your `.env` file with the proper credentials

## Setup for Testing

Run the payment verification script to check your setup:

```bash
chmod +x test-payment-system.sh
./test-payment-system.sh
```

This will check:

- Required dependencies
- Environment variables
- Price IDs
- Firebase service account
- Webhook configuration

## Test Scenarios

### 1. Stripe Payment Flow

#### Test 1: Successful Subscription

1. Start the server: `node server.js`
2. Open the application in your browser (https://localhost:5000)
3. Create an account or log in
4. Navigate to the pricing page
5. Select the Pro plan
6. Choose Stripe as the payment method
7. Use Stripe test card: `4242 4242 4242 4242` with any future expiration date and any CVC
8. Complete the subscription process
9. Verify that:
   - Success message appears
   - Firestore database updates the user's subscription
   - Transaction logs record the subscription

#### Test 2: Failed Payment
1. Follow the same steps but use card number `4000 0000 0000 0002` (which will be declined)
2. Verify error handling works correctly

#### Test 3: Subscription Cancellation
1. Subscribe as in Test 1
2. Navigate to subscription management
3. Cancel subscription
4. Verify that:
   - Subscription status updates correctly
   - User tier is downgraded correctly at the end of the billing period

### 2. PayPal Payment Flow

#### Test 4: Successful PayPal Subscription
1. Start the server: `node server.js`
2. Open the application in your browser
3. Log in if needed
4. Select the Pro plan
5. Choose PayPal as the payment method
6. Complete the PayPal sandbox checkout
7. Verify that:
   - Success message appears
   - Firestore database updates the user's subscription
   - Transaction logs record the subscription

#### Test 5: PayPal Cancellation
1. Cancel the subscription through PayPal sandbox
2. Trigger the webhook (may require manual testing)
3. Verify the subscription status updates

### 3. Webhook Testing

#### Test 6: Stripe Webhooks
1. Use the Stripe CLI to trigger test webhooks
   ```bash
   stripe listen --forward-to http://localhost:5000/webhook/stripe
   ```
2. In another terminal, trigger webhook events:
   ```bash
   stripe trigger customer.subscription.updated
   stripe trigger customer.subscription.deleted
   ```
3. Verify that webhook processing works correctly

#### Test 7: PayPal Webhooks
1. Set up PayPal webhooks in the developer dashboard
2. Test webhooks using PayPal's testing tools
3. Verify webhook processing works correctly

## Checking Results

After testing, verify:

1. **Database State**: Check Firebase to confirm subscription records are correct
2. **Logs**: Review the transaction logs in the `logs` directory
3. **User Experience**: Confirm users see appropriate subscription status and limitations

## Troubleshooting

### Stripe Issues
- Check the Stripe Dashboard for events and logs
- Verify webhooks are properly configured
- Test with different cards to ensure error handling is robust

### PayPal Issues
- Check PayPal Developer Dashboard for subscription status
- Verify webhook configuration
- Test PayPal sandbox accounts are properly set up

### Firebase Issues
- Check Firebase Authentication is configured correctly
- Ensure Firestore rules allow updating subscription information
- Verify service account permissions

## Going to Production

Before deploying to production:

1. Switch from test/sandbox APIs to production
2. Update webhook URLs to your production domain
3. Ensure SSL is enabled for secure payment processing
4. Test the end-to-end flow in production with real cards (small amount)
5. Set up monitoring and alerting for payment failures
