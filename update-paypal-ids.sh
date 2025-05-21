#!/bin/bash
# filepath: /Users/valentinechideme/Documents/augment-projects/mockitupai/update-paypal-ids.sh
# Update PayPal Plan IDs

echo "====== PayPal Plan ID Updater ======"
echo ""
echo "This script will update the PayPal plan IDs in your .env file"
echo "with the actual plan IDs from your PayPal account."
echo ""
echo "Please enter your Pro plan ID from PayPal:"
read -r pro_plan_id
echo "Please enter your Unlimited plan ID from PayPal:"
read -r unlimited_plan_id

# Check if the input is empty
if [ -z "$pro_plan_id" ] || [ -z "$unlimited_plan_id" ]; then
  echo "❌ Plan IDs cannot be empty. Exiting."
  exit 1
fi

# Backup original file
cp .env .env.backup
echo "✅ Created backup of original .env file (.env.backup)"

# Update the plan IDs in .env file
sed -i '' "s|REACT_APP_PAYPAL_PLAN_ID_PRO=.*|REACT_APP_PAYPAL_PLAN_ID_PRO=$pro_plan_id|g" .env 2>/dev/null || echo "REACT_APP_PAYPAL_PLAN_ID_PRO=$pro_plan_id" >> .env
sed -i '' "s|REACT_APP_PAYPAL_PLAN_ID_UNLIMITED=.*|REACT_APP_PAYPAL_PLAN_ID_UNLIMITED=$unlimited_plan_id|g" .env 2>/dev/null || echo "REACT_APP_PAYPAL_PLAN_ID_UNLIMITED=$unlimited_plan_id" >> .env

echo "✅ Updated PayPal plan IDs in .env file"
echo ""
echo "Don't forget to also update your Stripe price IDs in your .env file:"
echo "- STRIPE_PRICE_ID_PRO"
echo "- STRIPE_PRICE_ID_UNLIMITED"
echo ""
echo "====== PayPal Plan ID Update Complete ======" 
