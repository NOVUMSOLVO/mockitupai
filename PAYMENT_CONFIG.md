# Firebase Configuration

Create a new Firebase project at https://console.firebase.google.com/ and add the following configuration to your .env file:

```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

# Stripe Configuration

Create a Stripe account at https://stripe.com/ and add the following configuration to your .env file:

```
REACT_APP_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

# PayPal Configuration

Create a PayPal Developer account at https://developer.paypal.com/ and add the following configuration to your .env file:

```
REACT_APP_PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_SECRET=your-paypal-secret
```

These configurations are required for the payment integration to work properly. Make sure to replace the placeholder values with your actual credentials.
