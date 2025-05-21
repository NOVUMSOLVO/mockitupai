# Payment Integration Checklist

Use this checklist to ensure you've completed all necessary steps for the Mockitup.ai payment integration.

## Environment Setup

- [ ] Created `.env` file with required variables
- [ ] Installed all required dependencies via `install-payment-deps.sh`
- [ ] Created logs directory for payment transaction logging

## Firebase Configuration

- [ ] Created Firebase project
- [ ] Enabled Authentication with Email/Password
- [ ] Set up Firestore database with proper rules
- [ ] Generated Firebase Admin SDK service account key
- [ ] Added Firebase configuration to `.env` file
- [ ] Tested Firebase Authentication

## Stripe Configuration

- [ ] Created Stripe account
- [ ] Retrieved Stripe API keys (publishable and secret)
- [ ] Added Stripe keys to `.env` file
- [ ] Created product for Pro plan ($10/month)
- [ ] Created product for Unlimited plan ($50/month)
- [ ] Added Stripe price IDs to `.env` file
- [ ] Set up Stripe webhook endpoint
- [ ] Added webhook secret to `.env` file
- [ ] Tested Stripe checkout with test card

## PayPal Configuration

- [ ] Created PayPal Developer account
- [ ] Created app to get client ID and secret
- [ ] Added PayPal credentials to `.env` file
- [ ] Created subscription plans in PayPal
- [ ] Updated PayPal plan IDs in `PayPalCheckout.js`
- [ ] Tested PayPal checkout with sandbox account

## Server Configuration

- [ ] Verified `server.js` is properly configured
- [ ] Tested API endpoint `/api/create-subscription`
- [ ] Tested API endpoint `/api/get-subscription`
- [ ] Tested API endpoint `/api/cancel-subscription`
- [ ] Tested API endpoint `/api/confirm-paypal-subscription`
- [ ] Verified webhook endpoints are working

## Client-side Testing

- [ ] Verified PricingPlans.js displays correct plans
- [ ] Tested user registration and login
- [ ] Tested subscription flow with Stripe
- [ ] Tested subscription flow with PayPal
- [ ] Verified subscription status updates in user dashboard
- [ ] Tested mockup limits based on subscription tier
- [ ] Tested subscription cancellation flow

## Production Readiness

- [ ] Switched to production API keys
- [ ] Updated webhook URLs to production domain
- [ ] Configured HTTPS for secure payment processing
- [ ] Set up monitoring for payment failures
- [ ] Created backup and recovery plan for subscription data

## Final Verification

- [ ] Ran `test-payment-system.sh` script with no errors
- [ ] Manually verified complete end-to-end payment flow
- [ ] Checked logs for successful transactions
- [ ] Verified proper error handling for failed payments

## Post-Launch Monitoring

- [ ] Set up alerts for payment failures
- [ ] Created process for handling disputed charges
- [ ] Established subscription renewal monitoring
- [ ] Implemented regular log review process

---

Last verification date: __________________

Verified by: __________________
