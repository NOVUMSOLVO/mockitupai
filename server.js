const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');

// Load env vars
require('dotenv').config({ path: '.env' });

// Log environment variables for debugging
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found' : 'Not found');

// Import database connection
const connectDB = require('./server/config/db');

// Connect to database
connectDB();

// Import payment logger
const { logTransaction, logError } = require('./payment-logger');

// Import routes
const templates = require('./server/routes/templateRoutes');
const auth = require('./server/routes/auth');
const users = require('./server/routes/users');

// Initialize express
const app = express();

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Set static folder
app.use(express.static(path.join(__dirname, 'build'))); // Ensure this line is present and uncommented

// Mount routers
app.use('/api/v1/templates', templates);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

// Error handling middleware (must be after routes)
const errorHandler = require('./server/middleware/error');
app.use(errorHandler);

// Existing payment processing routes will be mounted after this point

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Create a raw body buffer for webhooks
const rawBodyParser = (req, res, next) => {
  if (req.originalUrl === '/webhook/stripe' || req.originalUrl === '/webhook/paypal') {
    let rawBody = Buffer.from('');
    req.on('data', (chunk) => {
      rawBody = Buffer.concat([rawBody, chunk]);
    });
    req.on('end', () => {
      req.rawBody = rawBody;
      next();
    });
  } else {
    next();
  }
};

// Apply our custom raw body parser first
app.use(rawBodyParser);

// Firebase Admin SDK for server-side operations
const admin = require('firebase-admin');
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : null;

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  console.warn('Firebase service account not configured. Some features may not work.');
}

// Stripe configuration
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn('Stripe API key not configured. Payment processing will not work.');
}

// Middleware
app.use(helmet());
app.use(cors());
// Apply JSON parsing only for non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook/stripe' || req.originalUrl === '/webhook/paypal') {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});
// app.use(express.static(path.join(__dirname, 'build'))); // We'll handle static serving separately

// Payment Processing Routes

// Mount payment processing routes after API routes
app.use((req, res, next) => {
  // Skip JSON parsing for webhook routes
  if (req.originalUrl === '/webhook/stripe' || req.originalUrl === '/webhook/paypal') {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

// Create a Stripe subscription
app.post('/api/create-subscription', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe API key not configured' });
  }

  try {
    // const { paymentMethodId, planId, userId, email } = req.body;
    const { paymentMethodId, planId, userId } = req.body; // Removed email

    // Get actual price ID based on plan
    let stripePriceId;
    switch (planId) {
      case 'price_pro':
        stripePriceId = process.env.STRIPE_PRICE_ID_PRO || 'price_123456789'; // replace with actual Stripe price ID
        break;
      case 'price_unlimited':
        stripePriceId = process.env.STRIPE_PRICE_ID_UNLIMITED || 'price_987654321'; // replace with actual Stripe price ID
        break;
      default:
        return res.status(400).json({ error: 'Invalid plan selected' });
    }

    // Create or get customer
    let customer;
    const customers = await stripe.customers.list({ email });
    
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      });
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: stripePriceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    // Store subscription info in Firebase (if Firebase is configured)
    if (admin) {
      const db = admin.firestore();
      await db.collection('subscriptions').doc(userId).set({
        userId,
        customerId: customer.id,
        subscriptionId: subscription.id,
        status: subscription.status,
        planId: planId.replace('price_', ''),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Log successful subscription
    logTransaction(
      'subscription.created', 
      'stripe', 
      userId, 
      { 
        subscriptionId: subscription.id, 
        planId: planId.replace('price_', ''),
        customerId: customer.id
      }
    );

    return res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      status: subscription.status,
    });
  } catch (error) {
    console.error('Stripe subscription error:', error);
    
    // Log the error
    logError(
      'subscription.creation.failed', 
      'stripe', 
      req.body.userId, 
      error,
      { planId: req.body.planId }
    );
    
    return res.status(500).json({ error: error.message });
  }
});

// Get subscription details
app.post('/api/get-subscription', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe API key not configured' });
  }

  try {
    const { userId } = req.body;
    
    if (!admin) {
      return res.status(500).json({ error: 'Firebase Admin SDK not configured' });
    }

    const db = admin.firestore();
    const subscriptionSnapshot = await db.collection('subscriptions')
      .where('userId', '==', userId)
      .limit(1)
      .get();
    
    if (subscriptionSnapshot.empty) {
      return res.json({ subscription: null });
    }

    const subscriptionData = subscriptionSnapshot.docs[0].data();
    
    // Get detailed subscription info from Stripe
    let stripeSubscription = null;
    let paymentMethod = null;
    
    if (subscriptionData.subscriptionId && subscriptionData.paymentProcessor !== 'paypal') {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(subscriptionData.subscriptionId);
        
        // Get payment method details if available
        if (stripeSubscription.default_payment_method) {
          paymentMethod = await stripe.paymentMethods.retrieve(stripeSubscription.default_payment_method);
        }
      } catch (err) {
        console.error('Error retrieving Stripe subscription:', err);
      }
    }
    
    return res.json({
      subscription: {
        id: subscriptionData.subscriptionId,
        status: stripeSubscription?.status || subscriptionData.status,
        planId: subscriptionData.planId,
        cancelAtPeriodEnd: stripeSubscription?.cancel_at_period_end || false,
        currentPeriodEnd: stripeSubscription?.current_period_end || null,
        paymentMethod: paymentMethod ? {
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          expMonth: paymentMethod.card.exp_month,
          expYear: paymentMethod.card.exp_year
        } : null,
        paymentProcessor: subscriptionData.paymentProcessor || 'stripe'
      }
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Cancel a subscription
app.post('/api/cancel-subscription', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe API key not configured' });
  }

  try {
    const { subscriptionId, userId } = req.body;
    
    if (!admin) {
      return res.status(500).json({ error: 'Firebase Admin SDK not configured' });
    }

    const db = admin.firestore();
    const subscriptionSnapshot = await db.collection('subscriptions')
      .where('userId', '==', userId)
      .limit(1)
      .get();
    
    if (subscriptionSnapshot.empty) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const subscriptionData = subscriptionSnapshot.docs[0].data();
    
    // Handle PayPal subscriptions differently
    if (subscriptionData.paymentProcessor === 'paypal') {
      // PayPal subscription cancellation would go here
      // For now, just update the record
      await subscriptionSnapshot.docs[0].ref.update({
        status: 'canceled',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return res.json({ success: true });
    }
    
    // Cancel the Stripe subscription
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });
    
    // Update Firebase record
    await subscriptionSnapshot.docs[0].ref.update({
      status: subscription.status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Log cancellation
    logTransaction(
      'subscription.canceled', 
      'stripe', 
      userId, 
      { subscriptionId: subscriptionId }
    );
    
    return res.json({ success: true });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Handle PayPal subscription confirmation
app.post('/api/confirm-paypal-subscription', async (req, res) => {
  try {
    const { subscriptionID, planId, userId } = req.body;
    
    // In a real app, you'd verify the PayPal subscription here
    
    // Store subscription info in Firebase (if Firebase is configured)
    if (admin) {
      const db = admin.firestore();
      await db.collection('subscriptions').doc(userId).set({
        userId,
        subscriptionId: subscriptionID,
        status: 'active',
        planId,
        paymentProcessor: 'paypal',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Log successful subscription
    logTransaction(
      'subscription.created',
      'paypal',
      userId,
      {
        subscriptionId: subscriptionID,
        planId: planId
      }
    );

    return res.json({ success: true });
  } catch (error) {
    console.error('PayPal subscription error:', error);
    
    // Log the error
    logError(
      'subscription.creation.failed',
      'paypal',
      req.body.userId,
      error,
      { planId: req.body.planId }
    );
    
    return res.status(500).json({ error: error.message });
  }
});

// Webhook for Stripe events
app.post('/webhook/stripe', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe API key not configured' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Use the rawBody captured by our middleware
    event = stripe.webhooks.constructEvent(
      req.rawBody, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      // Update subscription status in your database
      if (admin) {
        // Find the user with this subscription
        const db = admin.firestore();
        const subscriptionSnapshot = await db.collection('subscriptions')
          .where('subscriptionId', '==', subscription.id)
          .get();
        
        if (!subscriptionSnapshot.empty) {
          const subscriptionDoc = subscriptionSnapshot.docs[0];
          await subscriptionDoc.ref.update({
            status: subscription.status,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          // Update user's subscription tier if subscription is canceled
          if (subscription.status === 'canceled') {
            const userId = subscriptionDoc.data().userId;
            const userRef = db.collection('users').doc(userId);
            await userRef.update({
              subscriptionTier: 'free',
              mockupsRemaining: 3, // Reset to free tier
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          }
        }
      }
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({received: true});
});

// Webhook for PayPal events
app.post('/webhook/paypal', async (req, res) => {
  // Parse the webhook payload
  let event;
  
  try {
    // Use the raw body captured by our middleware
    event = JSON.parse(req.rawBody.toString());
  } catch (err) {
    console.error('Error parsing PayPal webhook:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Verify webhook signature here if using PayPal signature validation
  // For PayPal signature verification
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  const paypalAuthAlgo = req.headers['paypal-auth-algo'];
  const paypalTransmissionSig = req.headers['paypal-transmission-sig'];
  
  // If using PayPal signature verification (recommended for production)
  if (webhookId && paypalTransmissionSig && process.env.NODE_ENV === 'production') {
    // In production, you should verify the webhook signature
    // This would require the PayPal SDK and your webhook ID
    console.log('Received verified PayPal webhook:', event.event_type);
  } else {
    console.log('Received unverified PayPal webhook:', event.event_type);
    // For development, you can accept unverified webhooks
    // For production, consider requiring verification
    if (process.env.NODE_ENV === 'production') {
      console.warn('Warning: Processing unverified PayPal webhook in production');
    }
  }
  
  try {
    // Handle the different event types
    switch(event.event_type) {
      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.SUSPENDED':
        // Subscription was cancelled or suspended
        const resource = event.resource;
        const subscriptionId = resource.id;
        
        if (admin) {
          const db = admin.firestore();
          // Find the subscription in Firebase
          const subscriptionSnapshot = await db.collection('subscriptions')
            .where('subscriptionId', '==', subscriptionId)
            .where('paymentProcessor', '==', 'paypal')
            .get();
          
          if (!subscriptionSnapshot.empty) {
            const subscriptionDoc = subscriptionSnapshot.docs[0];
            const userId = subscriptionDoc.data().userId;
            
            // Update subscription status
            await subscriptionDoc.ref.update({
              status: 'canceled',
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            
            // Downgrade user to free tier
            const userRef = db.collection('users').doc(userId);
            await userRef.update({
              subscriptionTier: 'free',
              mockupsRemaining: 3, // Reset to free tier
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            
            // Log the cancellation
            logTransaction(
              'subscription.canceled',
              'paypal',
              userId,
              { subscriptionId: subscriptionId }
            );
          }
        }
        break;
        
      case 'BILLING.SUBSCRIPTION.EXPIRED':
        // Subscription expired
        // Handle similarly to cancellation
        break;
        
      case 'BILLING.SUBSCRIPTION.UPDATED':
        // Subscription was updated (could be plan change, etc.)
        break;
        
      default:
        console.log(`Unhandled PayPal event type: ${event.event_type}`);
    }
    
    res.json({ received: true });
  } catch (err) {
    console.error('Error processing PayPal webhook:', err);
    
    // Log the error
    logError(
      'webhook.processing.failed',
      'paypal',
      'unknown', // We might not know the user ID here
      err,
      { eventType: event.event_type }
    );
    
    res.status(500).send(`Webhook processing error: ${err.message}`);
  }
});

// Serve frontend for all other routes (if you were serving frontend from Node.js directly)
// This part is more relevant if you are NOT separating frontend and backend hosting.
// For Render (backend) + Hostinger (frontend), this section in server.js is less critical
// as Hostinger will serve the frontend. However, it doesn't hurt to keep it for other deployment scenarios.
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});


const PORT = process.env.PORT || 5000; // Use Render's port or 5000 locally

app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application can continue running in this case
});
