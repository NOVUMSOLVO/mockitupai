# Payment Integration Guide for Mockitup.ai

This guide will help you set up the payment integration for your Mockitup.ai application using Stripe and PayPal.

## 1. Install Required Dependencies

Run the installation script we've prepared:

```bash
chmod +x ./install-payment-deps.sh
./install-payment-deps.sh
```

This will install all necessary libraries for Stripe and PayPal integration.

## 2. Set Up Environment Variables

Copy the `.env.example` file to `.env` in the root directory:

```bash
cp .env.example .env
```

Then, fill in the required credentials:

1. **Firebase Configuration:** Create a project at [console.firebase.google.com](https://console.firebase.google.com/)
2. **Stripe Configuration:** Create an account at [stripe.com](https://stripe.com/)
3. **PayPal Configuration:** Create a developer account at [developer.paypal.com](https://developer.paypal.com/)

## 3. Set Up Firebase Admin SDK

For server-side Firebase operations, you'll need to:

1. Go to your Firebase project settings
2. Navigate to "Service accounts"
3. Click "Generate new private key"
4. Save the JSON file securely
5. Set the content as an environment variable named `FIREBASE_SERVICE_ACCOUNT` (as a JSON string)

## 4. Create Stripe Products and Prices

1. Log into your Stripe Dashboard
2. Go to Products > Create Product
3. Create three products:
   - **Free Plan**
     - Name: Free
     - Price: $0/month (recurring)
     - Save the Price ID for later use
   - **Pro Plan**
     - Name: Pro
     - Price: $10/month (recurring)
     - Save the Price ID for later use
   - **Unlimited Plan**
     - Name: Unlimited
     - Price: $50/month (recurring)
     - Save the Price ID for later use

4. Update the price IDs in `src/payments/StripeCheckout.js` and in `server.js`

## 5. Create PayPal Subscription Plans

1. Log into your PayPal Developer Dashboard
2. Go to REST API apps
3. Create a new app or use an existing one
4. Navigate to Subscriptions > Products
5. Create products and plans for your three subscription tiers
6. Update the plan IDs in `src/payments/PayPalCheckout.js`

## 6. Set Up Stripe Webhook (Important!)

1. In your Stripe Dashboard, go to Developers > Webhooks
2. Create a webhook endpoint with URL: `https://your-domain.com/webhook/stripe`
3. Subscribe to events:
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Get the signing secret and add it to your `.env` file as `STRIPE_WEBHOOK_SECRET`

## 7. Deploying to Production

When deploying to production:

1. Set all environment variables on your hosting platform
2. Ensure your domain has HTTPS enabled for secure payment processing
3. Update webhook URLs to your production domain

## 8. Testing

Before going live:

1. Use Stripe test mode and test cards to verify the subscription flow
2. Use PayPal sandbox mode to test PayPal integration
3. Verify that subscription status is properly updated in your Firebase database
4. Test the cancellation flow and ensure users are properly downgraded to the free tier

## Support

If you encounter any issues with the payment integration, refer to:

- [Stripe Documentation](https://stripe.com/docs)
- [PayPal Developer Documentation](https://developer.paypal.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)

Or contact our support team for assistance.
