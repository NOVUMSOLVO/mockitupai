#!/bin/bash
# filepath: /Users/valentinechideme/Documents/augment-projects/mockitupai/payment-setup-all.sh

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Mockitup.ai Payment System Setup ===${NC}"
echo

# Step 1: Fix permissions for all scripts
echo -e "${YELLOW}Step 1: Fixing permissions for all scripts...${NC}"
chmod +x *.sh
chmod +x *.js
echo -e "${GREEN}✓ All script permissions fixed${NC}"
echo

# Step 2: Install dependencies
echo -e "${YELLOW}Step 2: Installing payment dependencies...${NC}"
bash install-payment-deps.sh
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo

# Step 3: Set up environment variables
echo -e "${YELLOW}Step 3: Setting up environment variables...${NC}"
echo

# Firebase Configuration
echo -e "${YELLOW}===== Firebase Configuration =====${NC}"
echo "Enter your Firebase API Key:"
read -r firebase_api_key
echo "Enter your Firebase Auth Domain:"
read -r firebase_auth_domain
echo "Enter your Firebase Project ID:"
read -r firebase_project_id
echo "Enter your Firebase Storage Bucket:"
read -r firebase_storage_bucket
echo "Enter your Firebase Messaging Sender ID:"
read -r firebase_messaging_sender_id
echo "Enter your Firebase App ID:"
read -r firebase_app_id

# Stripe Configuration
echo
echo -e "${YELLOW}===== Stripe Configuration =====${NC}"
echo "Enter your Stripe Publishable Key:"
read -r stripe_publishable_key
echo "Enter your Stripe Secret Key:"
read -r stripe_secret_key
echo "Enter your Stripe Webhook Secret:"
read -r stripe_webhook_secret
echo "Enter your Stripe Pro Plan Price ID:"
read -r stripe_price_id_pro
echo "Enter your Stripe Unlimited Plan Price ID:"
read -r stripe_price_id_unlimited

# PayPal Configuration
echo
echo -e "${YELLOW}===== PayPal Configuration =====${NC}"
echo "Enter your PayPal Client ID:"
read -r paypal_client_id
echo "Enter your PayPal Secret:"
read -r paypal_secret
echo "Enter your PayPal Pro Plan ID:"
read -r paypal_plan_id_pro
echo "Enter your PayPal Unlimited Plan ID:"
read -r paypal_plan_id_unlimited

# Check if .env file exists and back it up if it does
if [ -f .env ]; then
  echo "Found existing .env file, creating backup..."
  cp .env .env.backup
  echo -e "${GREEN}✓ Backed up to .env.backup${NC}"
else
  echo "Creating new .env file from template..."
  cp .env.example .env
fi

# Update .env file
echo "Updating .env file with your configurations..."

# Firebase 
sed -i '' "s|REACT_APP_FIREBASE_API_KEY=.*|REACT_APP_FIREBASE_API_KEY=$firebase_api_key|g" .env
sed -i '' "s|REACT_APP_FIREBASE_AUTH_DOMAIN=.*|REACT_APP_FIREBASE_AUTH_DOMAIN=$firebase_auth_domain|g" .env
sed -i '' "s|REACT_APP_FIREBASE_PROJECT_ID=.*|REACT_APP_FIREBASE_PROJECT_ID=$firebase_project_id|g" .env
sed -i '' "s|REACT_APP_FIREBASE_STORAGE_BUCKET=.*|REACT_APP_FIREBASE_STORAGE_BUCKET=$firebase_storage_bucket|g" .env
sed -i '' "s|REACT_APP_FIREBASE_MESSAGING_SENDER_ID=.*|REACT_APP_FIREBASE_MESSAGING_SENDER_ID=$firebase_messaging_sender_id|g" .env
sed -i '' "s|REACT_APP_FIREBASE_APP_ID=.*|REACT_APP_FIREBASE_APP_ID=$firebase_app_id|g" .env

# Stripe
sed -i '' "s|REACT_APP_STRIPE_PUBLISHABLE_KEY=.*|REACT_APP_STRIPE_PUBLISHABLE_KEY=$stripe_publishable_key|g" .env
sed -i '' "s|STRIPE_SECRET_KEY=.*|STRIPE_SECRET_KEY=$stripe_secret_key|g" .env
sed -i '' "s|STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=$stripe_webhook_secret|g" .env
sed -i '' "s|STRIPE_PRICE_ID_PRO=.*|STRIPE_PRICE_ID_PRO=$stripe_price_id_pro|g" .env
sed -i '' "s|STRIPE_PRICE_ID_UNLIMITED=.*|STRIPE_PRICE_ID_UNLIMITED=$stripe_price_id_unlimited|g" .env

# PayPal
sed -i '' "s|REACT_APP_PAYPAL_CLIENT_ID=.*|REACT_APP_PAYPAL_CLIENT_ID=$paypal_client_id|g" .env
sed -i '' "s|PAYPAL_SECRET=.*|PAYPAL_SECRET=$paypal_secret|g" .env

grep -q "REACT_APP_PAYPAL_PLAN_ID_PRO" .env || echo "REACT_APP_PAYPAL_PLAN_ID_PRO=$paypal_plan_id_pro" >> .env
# Add PayPal plan IDs if they don't exist
grep -q "REACT_APP_PAYPAL_PLAN_ID_UNLIMITED" .env || echo "REACT_APP_PAYPAL_PLAN_ID_UNLIMITED=$paypal_plan_id_unlimited" >> .env

echo -e "${GREEN}✓ Environment variables updated successfully!${NC}"

# Step 4: Create logs directory
echo
echo -e "${YELLOW}Step 4: Creating logs directory...${NC}"
mkdir -p logs
echo -e "${GREEN}✓ Logs directory created${NC}"

# Step 5: Update PayPal IDs in PayPalCheckout.js
echo
echo -e "${YELLOW}Step 5: Updating PayPal plan IDs in PayPalCheckout.js...${NC}"
# Make a backup of the original file
cp src/payments/PayPalCheckout.js src/payments/PayPalCheckout.js.bak
echo -e "${GREEN}✓ Backed up PayPalCheckout.js${NC}"

# Update the Pro plan ID
sed -i '' "s/P-12345678901234567ABCDEFG/process.env.REACT_APP_PAYPAL_PLAN_ID_PRO || 'P-12345678901234567ABCDEFG'/g" src/payments/PayPalCheckout.js

# Update the Unlimited plan ID
sed -i '' "s/P-98765432109876543HIJKLMN/process.env.REACT_APP_PAYPAL_PLAN_ID_UNLIMITED || 'P-98765432109876543HIJKLMN'/g" src/payments/PayPalCheckout.js

echo -e "${GREEN}✓ PayPal plan IDs updated${NC}"

# Step 6: Verify setup
echo
echo -e "${YELLOW}Step 6: Verifying setup...${NC}"
bash test-payment-system.sh
echo

echo -e "${GREEN}=== Payment System Setup Complete ===${NC}"
echo
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Start the server:             ${GREEN}node server.js${NC}"
echo "2. Test API endpoints:           ${GREEN}bash test-payment-api.sh${NC}"
echo "3. Check the detailed guides:    ${GREEN}PAYMENT_TESTING_GUIDE.md${NC}"
echo "4. Complete implementation:      ${GREEN}PAYMENT_CHECKLIST.md${NC}"
echo 
echo "Happy testing!"
