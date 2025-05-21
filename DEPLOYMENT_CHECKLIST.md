# Mockitup.ai Deployment Checklist

Use this checklist before deploying your Mockitup.ai application to production.

## Pre-Deployment Tests

- [ ] Run `./pre-deployment-check.sh` to verify all components
- [ ] Ensure all environment variables are correctly set in `.env` (no placeholder values)
- [ ] Test all payment flows (Stripe and PayPal)
- [ ] Verify Firebase configuration
- [ ] Check logs directory is set up properly

## Environment Variables

### Firebase
- [ ] `REACT_APP_FIREBASE_API_KEY` is set with real value
- [ ] `REACT_APP_FIREBASE_AUTH_DOMAIN` is set with real value
- [ ] `REACT_APP_FIREBASE_PROJECT_ID` is set with real value
- [ ] `REACT_APP_FIREBASE_STORAGE_BUCKET` is set with real value
- [ ] `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` is set with real value
- [ ] `REACT_APP_FIREBASE_APP_ID` is set with real value

### Stripe
- [ ] `REACT_APP_STRIPE_PUBLISHABLE_KEY` is set with real value
- [ ] `STRIPE_SECRET_KEY` is set with real value
- [ ] `STRIPE_WEBHOOK_SECRET` is set with real value
- [ ] `STRIPE_PRICE_ID_PRO` is set with real value
- [ ] `STRIPE_PRICE_ID_UNLIMITED` is set with real value

### PayPal
- [ ] `REACT_APP_PAYPAL_CLIENT_ID` is set with real value
- [ ] `PAYPAL_SECRET` is set with real value
- [ ] `REACT_APP_PAYPAL_PLAN_ID_PRO` is set with real value
- [ ] `REACT_APP_PAYPAL_PLAN_ID_UNLIMITED` is set with real value

### Firebase Admin SDK
- [ ] `FIREBASE_SERVICE_ACCOUNT` is set with a valid service account JSON

### Server Configuration
- [ ] `PORT` is set (default: 5000)
- [ ] `NODE_ENV` is set to "production" for deployment

## Build Verification

- [ ] App builds successfully with `npm run build`
- [ ] Static files are generated in the `build` folder
- [ ] No build errors or warnings

## Server Verification

- [ ] Server starts without errors
- [ ] Server connects properly to Firebase
- [ ] Stripe and PayPal webhooks are properly configured
- [ ] Server responds to health checks

## Payment System Verification

- [ ] Stripe integration is working
- [ ] PayPal integration is working
- [ ] Transaction logging is working
- [ ] Payment error handling is working

## Deployment Platform-Specific

### Netlify
- [ ] Netlify configuration (`netlify.toml`) is correct
- [ ] Environment variables are set in Netlify dashboard
- [ ] Build command is set to `npm run build`
- [ ] Functions directory is correctly specified (if using Netlify Functions)

### Vercel
- [ ] Vercel configuration (`vercel.json`) is correct
- [ ] Environment variables are set in Vercel dashboard
- [ ] Build command is set to `npm run build`

## Post-Deployment Verification

- [ ] Deployed site loads without errors
- [ ] Authentication works
- [ ] Payment processing works
- [ ] Firebase interactions work
- [ ] All routes function correctly

## Additional Notes

- If using a custom domain, ensure DNS settings are correctly configured
- Set up monitoring for the production environment
- Configure error logging and alerts
- Ensure CORS settings are appropriate for production

## Commands for Deployment

Run these commands in sequence for a successful deployment:

```bash
# 1. Run pre-deployment checks
chmod +x ./pre-deployment-check.sh
./pre-deployment-check.sh

# 2. Ensure logs directory is set up
chmod +x ./setup-logs.sh
./setup-logs.sh

# 3. Build the application
npm run build

# 4. Deploy to your chosen platform
# For Netlify:
chmod +x ./deploy-netlify.sh
./deploy-netlify.sh

# Or for Vercel:
chmod +x ./deploy-vercel.sh
./deploy-vercel.sh
```
