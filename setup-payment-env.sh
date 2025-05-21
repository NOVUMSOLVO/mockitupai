#!/bin/bash
# filepath: /Users/valentinechideme/Documents/augment-projects/mockitupai/setup-payment-env.sh
# Set up payment environment variables interactively

echo "====== Mockitup.ai Payment Environment Setup ======"
echo ""
echo "This script will help you set up the required environment variables"
echo "for the payment system. You'll need your Stripe and PayPal accounts ready."
echo ""

# Check if .env exists and back it up if it does
if [ -f .env ]; then
  echo "Found existing .env file, creating backup..."
  cp .env .env.backup
  echo "✅ Backed up to .env.backup"
else
  echo "Creating new .env file from template..."
  cp .env.example .env
fi

# Firebase Configuration
echo ""
echo "===== Firebase Configuration ====="
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
echo ""
echo "===== Stripe Configuration ====="
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
echo ""
echo "===== PayPal Configuration ====="
echo "Enter your PayPal Client ID:"
read -r paypal_client_id
echo "Enter your PayPal Secret:"
read -r paypal_secret
echo "Enter your PayPal Pro Plan ID:"
read -r paypal_plan_id_pro
echo "Enter your PayPal Unlimited Plan ID:"
read -r paypal_plan_id_unlimited

# Confirm Firebase Admin SDK
echo ""
echo "===== Firebase Admin SDK ====="
echo "Do you want to update the Firebase Service Account? (y/n)"
read -r update_service_account
if [[ "$update_service_account" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  echo "Please paste your Firebase Service Account JSON (paste then press Ctrl+D):"
  firebase_service_account=$(cat)
fi

# Server Configuration
echo ""
echo "===== Server Configuration ====="
echo "Enter the server port (default: 5000):"
read -r server_port
server_port=${server_port:-5000}
echo "Enter the environment (development/production):"
read -r node_env
node_env=${node_env:-development}

# Update .env file
update_env_var() {
  local key=$1
  local value=$2
  
  # Check if the OS is macOS (Darwin) or Linux
  if [[ "$(uname)" == "Darwin" ]]; then
    # macOS version of sed
    sed -i '' "s|$key=.*|$key=$value|g" .env 2>/dev/null || echo "$key=$value" >> .env
  else
    # Linux/GNU version of sed
    sed -i "s|$key=.*|$key=$value|g" .env 2>/dev/null || echo "$key=$value" >> .env
  fi
}

# Update Firebase variables
update_env_var "REACT_APP_FIREBASE_API_KEY" "$firebase_api_key"
update_env_var "REACT_APP_FIREBASE_AUTH_DOMAIN" "$firebase_auth_domain"
update_env_var "REACT_APP_FIREBASE_PROJECT_ID" "$firebase_project_id"
update_env_var "REACT_APP_FIREBASE_STORAGE_BUCKET" "$firebase_storage_bucket"
update_env_var "REACT_APP_FIREBASE_MESSAGING_SENDER_ID" "$firebase_messaging_sender_id"
update_env_var "REACT_APP_FIREBASE_APP_ID" "$firebase_app_id"

# Update Stripe variables
update_env_var "REACT_APP_STRIPE_PUBLISHABLE_KEY" "$stripe_publishable_key"
update_env_var "STRIPE_SECRET_KEY" "$stripe_secret_key"
update_env_var "STRIPE_WEBHOOK_SECRET" "$stripe_webhook_secret"
update_env_var "STRIPE_PRICE_ID_PRO" "$stripe_price_id_pro"
update_env_var "STRIPE_PRICE_ID_UNLIMITED" "$stripe_price_id_unlimited"

# Update PayPal variables
update_env_var "REACT_APP_PAYPAL_CLIENT_ID" "$paypal_client_id"
update_env_var "PAYPAL_SECRET" "$paypal_secret"
update_env_var "REACT_APP_PAYPAL_PLAN_ID_PRO" "$paypal_plan_id_pro"
update_env_var "REACT_APP_PAYPAL_PLAN_ID_UNLIMITED" "$paypal_plan_id_unlimited"

  # Replace the Firebase service account JSON, escaping special characters
if [[ "$update_service_account" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  escaped_service_account=$(echo "$firebase_service_account" | sed 's/"/\\"/g' | sed 's/$/\\n/' | tr -d '\n')
  update_env_var "FIREBASE_SERVICE_ACCOUNT" "$escaped_service_account"
fi

update_env_var "PORT" "$server_port"
update_env_var "NODE_ENV" "$node_env"

echo ""
echo "✅ Environment variables updated successfully!"
echo ""
echo "Next steps:"
echo "1. Update PayPal plan IDs in PayPalCheckout.js using:"
echo "   ./update-paypal-ids.sh"
echo ""
echo "2. Test the payment system with:"
echo "   ./test-payment-system.sh"
echo ""
echo "3. Start the server with:"
echo "   node server.js"
echo ""
echo "====== Environment Setup Complete ======"
