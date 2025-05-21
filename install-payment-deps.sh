#!/bin/bash

echo "Installing required packages for payment integration..."

# Install client-side dependencies
npm install @stripe/react-stripe-js @stripe/stripe-js firebase react-router-dom @paypal/react-paypal-js

# Install server-side dependencies
npm install stripe cors dotenv firebase-admin jsonwebtoken

echo "All packages installed successfully!"
