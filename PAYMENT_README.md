# Mockitup.ai Payment System

This directory contains the payment integration for Mockitup.ai, allowing users to subscribe to different plans using Stripe and PayPal.

## Quick Start

Follow these steps to set up and test the payment system:

1. **Install Dependencies**

   ```bash
   chmod +x install-payment-deps.sh
   ./install-payment-deps.sh
   ```

2. **Set Up Environment Variables**

   ```bash
   chmod +x setup-payment-env.sh
   ./setup-payment-env.sh
   ```

3. **Update PayPal Plan IDs**

   ```bash
   chmod +x update-paypal-ids.sh
   ./update-paypal-ids.sh
   ```

4. **Test the Payment System**

   ```bash
   chmod +x test-payment-system.sh
   ./test-payment-system.sh
   ```

5. **Start the Server**

   ```bash
   node server.js
   ```

## Documentation

For detailed information, refer to these files:

- `PAYMENT_SETUP.md` - Detailed setup instructions
- `PAYMENT_TESTING_GUIDE.md` - Guide for testing the payment flow
- `PAYMENT_IMPLEMENTATION_GUIDE.md` - How the payment system is implemented
- `PAYMENT_CONFIG.md` - Configuration requirements
- `PAYMENT_CHECKLIST.md` - Comprehensive checklist for implementation

## Payment Flow

The payment system supports two payment processors:

1. **Stripe** - Credit card payments with subscription management
2. **PayPal** - PayPal account payments with subscription management

Users can choose between three subscription tiers:

- **Free** - $0/month, 3 mockups/month
- **Pro** - $10/month, 15 mockups/month
- **Unlimited** - $50/month, unlimited mockups

## Directory Structure

- `src/payments/` - Client-side payment components
  - `StripeCheckout.js` - Stripe payment form
  - `PayPalCheckout.js` - PayPal payment button
- `server.js` - Server-side payment processing
- `payment-logger.js` - Payment transaction logging utility
- `logs/` - Directory for transaction logs

## Testing

Use these test credentials:

### Stripe Test Cards

- **Success**: 4242 4242 4242 4242
- **Authentication Required**: 4000 0025 0000 3155
- **Payment Declined**: 4000 0000 0000 9995

Use any future expiration date and any 3-digit CVC.

### PayPal Testing

Use PayPal sandbox accounts created in your PayPal Developer dashboard.

## Troubleshooting

If you encounter any issues:

1. Check the log files in the `logs/` directory
2. Verify your API keys and configuration in `.env`
3. Run the test script again: `./test-payment-system.sh`
4. Check the Stripe or PayPal dashboards for payment status

For more detailed troubleshooting, refer to `PAYMENT_TESTING_GUIDE.md`.
