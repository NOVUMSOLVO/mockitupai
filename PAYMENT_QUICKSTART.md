# Payment System Quick Start Guide

This guide will help you quickly set up and test the payment system for your Mockitup.ai application.

## Setup in 5 Minutes

### Step 1: Run the All-in-One Setup Script

```bash
chmod +x payment-setup-all.sh
./payment-setup-all.sh
```

This script will:
- Fix permissions for all scripts
- Install required dependencies
- Set up environment variables
- Update PayPal plan IDs
- Create logging directories
- Verify the setup

### Step 2: Test the Payment System

```bash
./test-payment-system.sh
```

This will verify:
- Environment variables
- Dependencies
- Price IDs
- Firebase configuration
- Webhook configuration

### Step 3: Test the Payment Logger

```bash
./test-payment-logging.sh
```

This will test the logging functionality and show you sample logs.

### Step 4: Test the Payment API Endpoints

```bash
./test-payment-api.sh
```

This script will test all the payment API endpoints with sample data.

## Using Test Cards

### Stripe Test Cards

| Card Number | Description |
|-------------|-------------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 0002 | Declined payment |
| 4000 0000 0000 3220 | 3D Secure authentication |
| 4000 0050 6000 0009 | Dispute/chargeback test |

Expiration date: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits

### PayPal Sandbox

Use your PayPal developer sandbox accounts for testing. Create both business and personal test accounts in the PayPal Developer Dashboard.

## Troubleshooting

If you encounter issues:

1. Check the logs in the `logs` directory
2. Review the `PAYMENT_DEBUGGING.md` guide
3. Verify all environment variables are set correctly
4. Test with the included test scripts

For more detailed information:
- `PAYMENT_TESTING_GUIDE.md` - Comprehensive testing procedures
- `PAYMENT_DEBUGGING.md` - Troubleshooting common issues
- `PAYMENT_CHECKLIST.md` - Implementation checklist

## Going to Production

Before deploying to production:

1. Replace test/sandbox credentials with production credentials
2. Update webhook URLs to your production domain
3. Enable SSL for secure payment processing
4. Test with real transactions (small amounts first)
5. Monitor transaction logs for any issues
