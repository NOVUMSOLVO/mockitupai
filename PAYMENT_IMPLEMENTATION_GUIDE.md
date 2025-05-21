# Mockitup.ai Payment Implementation Guide

This guide will help you implement and test the payment system for your Mockitup.ai application.

## Overview

We've implemented a complete payment system using Stripe and PayPal for your Mockitup.ai application, with three subscription tiers:

1. **Free** - $0/month, 3 mockups/month
2. **Pro** - $10/month, 15 mockups/month
3. **Unlimited** - $50/month, unlimited mockups

## Implementation Checklist

### 1. Install Dependencies

Run the installation script to install all required packages:

```bash
chmod +x install-payment-deps.sh
./install-payment-deps.sh
```

### 2. Configuration

Create an environment file by copying the example:

```bash
cp .env.example .env
```

Then, set up the following accounts and update your .env file:

- **Firebase**: Create a project at [firebase.google.com](https://firebase.google.com)
- **Stripe**: Sign up at [stripe.com](https://stripe.com)
- **PayPal**: Create a developer account at [developer.paypal.com](https://developer.paypal.com)

### 3. Firebase Setup

1. **Create Project**: Set up a Firebase project
2. **Enable Authentication**: Activate Email/Password authentication
3. **Set Up Firestore**: Create a Firestore database with appropriate security rules
4. **Generate Admin SDK Key**: Go to Project Settings > Service Accounts > Generate new private key
5. **Add to .env**: Add Firebase Admin SDK credentials to your environment file

### 4. Stripe Setup

1. **Create Account**: Sign up for a Stripe account if you don't have one
2. **API Keys**: Find your API keys in Dashboard > Developers > API keys
3. **Create Products**:
   - Go to Products > Create Product
   - Create three products matching your tiers (Free, Pro, Unlimited)
   - For each product, create a recurring price:
     - Free: $0/month
     - Pro: $10/month
     - Unlimited: $50/month
4. **Webhooks**:
   - Go to Developers > Webhooks
   - Create endpoint with URL: `https://your-domain.com/webhook/stripe`
   - Subscribe to events: `customer.subscription.updated`, `customer.subscription.deleted`
   - Get webhook secret and add to .env as `STRIPE_WEBHOOK_SECRET`

### 5. PayPal Setup

1. **Developer Account**: Create or sign in to your PayPal Developer account
2. **Create App**: Go to REST API apps > Create App to get client ID and secret
3. **Create Subscription Plans**:
   - In the Developer Dashboard, go to Subscriptions > Products
   - Create products and plans matching your tiers
4. **Update Code**: Add your PayPal plan IDs to `src/payments/PayPalCheckout.js`

### 6. Testing Payments

#### Stripe Testing

Use these test card numbers with any future expiration date and any 3-digit CVC:

- **Successful payment**: 4242 4242 4242 4242
- **Payment requires authentication**: 4000 0025 0000 3155
- **Payment is declined**: 4000 0000 0000 9995

#### PayPal Testing

1. Create sandbox accounts at [developer.paypal.com](https://developer.paypal.com)
2. Use these accounts to test the PayPal payment flow

### 7. Verifying Features

After setup, verify these features are working:

- [ ] User can sign up and sign in
- [ ] Free users have a limit of 3 mockups
- [ ] Users can subscribe to paid plans
- [ ] Pro users get 15 mockups per month
- [ ] Unlimited users have no mockup limits
- [ ] Users can cancel their subscription
- [ ] Cancellation takes effect at the end of billing period
- [ ] Subscription status is correctly displayed in the dashboard

## Customization

You can customize the subscription plans by:

1. Editing the plans array in `src/PricingPlans.js`
2. Updating the subscription tiers in `src/AuthContext.js`
3. Modifying the mockup limits in the appropriate components

## Troubleshooting

If you encounter issues:

1. Check the payment logs at `logs/payment_transactions.log` and `logs/payment_errors.log`
2. Verify your API keys and configuration
3. Ensure Firestore rules allow appropriate access
4. Check Stripe or PayPal dashboard for payment status
5. Verify webhooks are receiving events

## Production Deployment

Before deploying to production:

1. Switch Stripe and PayPal to live mode
2. Update all API keys to production keys
3. Configure webhooks for your production domain
4. Ensure your domain has HTTPS enabled
5. Test the entire payment flow once more in production mode

## Support

For further assistance, refer to:

- [Stripe Documentation](https://stripe.com/docs)
- [PayPal Developer Documentation](https://developer.paypal.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)

Or contact our support team for help.
