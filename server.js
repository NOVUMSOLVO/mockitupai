const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');

// Load env vars
require('dotenv').config({ path: '.env' });

// Log environment variables for debugging
// console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found' : 'Not found');

// Import database connection
const connectDB = require('./server/config/db');

// Connect to database
connectDB();

// Import payment logger
const { logTransaction, logError } = require('./payment-logger');

// Import routes
const templates = require('./server/routes/templateRoutes');
const authRoute = require('./server/routes/auth'); 
const users = require('./server/routes/users');

// Import error handler
const errorHandler = require('./server/middleware/error');

// Initialize express
const app = express();

// Favicon handler with proper caching
app.get('/favicon.ico', (req, res) => {
  res.setHeader('Content-Type', 'image/x-icon');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

// Set security headers (Helmet)

// Trust proxy headers (especially for X-Forwarded-For from Render)
app.set('trust proxy', 1); // Adjust the number of proxies if needed, 1 is common for Render

// Set security headers (Helmet)

// NEW, more explicit CSP configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Allows inline <script> tags
        "'unsafe-eval'",   // Allows eval and similar methods (try to remove in production if possible)
        "https://www.googletagmanager.com", // For Google Tag Manager
        "https://apis.google.com",          // For other Google APIs (e.g., Firebase uses some)
        "https://js.stripe.com",            // For Stripe.js
        "https://checkout.stripe.com",      // For Stripe Checkout
        "https://www.paypal.com",           // For PayPal
        "https://www.paypalobjects.com",    // For PayPal resources
        "https://firebasejs.googleapis.com" // For Firebase JS SDK
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Allows inline <style> tags and style attributes
        "https://fonts.googleapis.com", // For Google Fonts
        "https://js.stripe.com",        // For Stripe.js styles
        "https://checkout.stripe.com"   // For Stripe Checkout styles
      ],
      imgSrc: [
        "'self'",
        "data:",    // Allows data: URIs for images
        "https://*", // Allows images from any HTTPS source (consider restricting further in production)
        "http://*"   // Allows images from any HTTP source (remove in production)
      ],
      connectSrc: [
        "'self'",
        "https://firebaseinstallations.googleapis.com", // Firebase Installations
        "https://firebase.googleapis.com",              // General Firebase APIs
        "https://firestore.googleapis.com",            // Firestore
        "https://identitytoolkit.googleapis.com",     // Firebase Authentication
        "https://www.googleapis.com",                // Other Google APIs
        "https://api.stripe.com",                   // Stripe API
        "https://*.stripe.com",                    // All Stripe subdomains
        "https://checkout.stripe.com",            // Stripe Checkout
        "https://api.paypal.com",                // PayPal API
        "https://*.paypal.com",                 // All PayPal subdomains
        "https://www.paypalobjects.com"        // PayPal resources
        // Add your backend API endpoint here if it's on a different origin than the frontend
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com" // For Google Fonts
      ],
      frameSrc: [
        "'self'",
        "https://js.stripe.com",
        "https://hooks.stripe.com",
        "https://checkout.stripe.com",
        "https://www.paypal.com",
        "https://www.sandbox.paypal.com",
        "https://*.paypal.com"
      ],
      objectSrc: ["'none'"], // Disallows <object>, <embed>, <applet>
      // upgradeInsecureRequests: [], // Uncomment to upgrade HTTP requests to HTTPS. Test thoroughly.
    },
  },
}));

// Enable CORS
app.use(cors()); // Consider more restrictive CORS options for production

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 200, // Adjusted max requests
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Body parsing - express.json() for JSON, express.urlencoded() for form data
// IMPORTANT: For Stripe webhooks, raw body is needed. express.json() has a `verify` option.
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf, encoding) => {
    if (req.originalUrl.startsWith('/webhook/stripe')) {
      req.rawBody = buf.toString(encoding || 'utf8');
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser with security settings
app.use(cookieParser({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
}));

// Sanitize MongoDB data
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// --- Firebase Admin SDK Initialization ---
const admin = require('firebase-admin');
let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }
} catch (e) {
  console.error('Error parsing FIREBASE_SERVICE_ACCOUNT JSON:', e);
  serviceAccount = null;
}

if (serviceAccount && Object.keys(serviceAccount).length > 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  // console.log('Firebase Admin SDK initialized.');
} else {
  console.warn('Firebase service account not configured or invalid. Server-side Firebase features may not work.');
}

// --- Stripe SDK Initialization ---
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  // console.log('Stripe SDK initialized.');
} else {
  console.warn('Stripe API key not configured. Payment processing will not work.');
}

// --- API Routes ---
app.use('/api/v1/templates', templates);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', users);

// --- Payment Processing and Webhook Routes ---

// Create a Stripe subscription
app.post('/api/create-subscription', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe API key not configured' });
  }
  try {
    const { paymentMethodId, planId, userId, email } = req.body;
    let stripePriceId;
    switch (planId) {
      case 'price_pro':
        stripePriceId = process.env.STRIPE_PRICE_ID_PRO;
        break;
      case 'price_unlimited':
        stripePriceId = process.env.STRIPE_PRICE_ID_UNLIMITED;
        break;
      default:
        return res.status(400).json({ error: 'Invalid plan selected' });
    }
    if (!stripePriceId) {
        return res.status(500).json({ error: 'Stripe Price ID for the selected plan is not configured on the server.' });
    }

    let customer;
    const customers = await stripe.customers.list({ email: email, limit: 1 });
    
    if (customers.data.length > 0) {
      customer = customers.data[0];
      // Optionally, update the customer's default payment method
      try {
        await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id });
        await stripe.customers.update(customer.id, { invoice_settings: { default_payment_method: paymentMethodId } });
      } catch (attachError) {
        console.warn('Could not attach new payment method to existing customer:', attachError.message);
        // Decide if this is a critical error or if you can proceed
      }
    } else {
      customer = await stripe.customers.create({
        email: email,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: stripePriceId }],
      expand: ['latest_invoice.payment_intent'],
      payment_behavior: 'default_incomplete', 
      proration_behavior: 'create_prorations',
    });

    if (admin.apps.length > 0) { 
      const db = admin.firestore();
      await db.collection('subscriptions').doc(userId).set({
        userId,
        customerId: customer.id,
        subscriptionId: subscription.id,
        status: subscription.status,
        planId: planId.replace('price_', ''),
        paymentProcessor: 'stripe',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    }

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
      clientSecret: subscription.latest_invoice && subscription.latest_invoice.payment_intent ? subscription.latest_invoice.payment_intent.client_secret : null,
      status: subscription.status,
    });
  } catch (error) {
    console.error('Stripe subscription error:', error);
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
    if (!admin.apps.length > 0) { 
        return res.status(500).json({ error: 'Firebase Admin SDK not configured for subscription retrieval.' });
    }

    const db = admin.firestore();
    const subscriptionSnapshot = await db.collection('subscriptions')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc') 
      .limit(1)
      .get();
    
    if (subscriptionSnapshot.empty) {
        return res.status(404).json({ error: 'No subscription found for this user.' });
    }

    const subscriptionData = subscriptionSnapshot.docs[0].data();
    let stripeSubscription = null;
    let paymentMethodDetails = null;
    
    if (subscriptionData.subscriptionId && subscriptionData.paymentProcessor === 'stripe') {
        stripeSubscription = await stripe.subscriptions.retrieve(subscriptionData.subscriptionId, {
            expand: ['default_payment_method']
        });
        if (stripeSubscription.default_payment_method && stripeSubscription.default_payment_method.card) {
            paymentMethodDetails = {
                brand: stripeSubscription.default_payment_method.card.brand,
                last4: stripeSubscription.default_payment_method.card.last4,
                exp_month: stripeSubscription.default_payment_method.card.exp_month,
                exp_year: stripeSubscription.default_payment_method.card.exp_year,
            };
        }
    }
     return res.json({ ...subscriptionData, stripeSubscription, paymentMethodDetails });
  } catch (error) {
    console.error('Error getting subscription:', error);
    logError('subscription.get.failed', 'stripe/firebase', req.body.userId, error);
    return res.status(500).json({ error: error.message });
  }
});

// Cancel a subscription
app.post('/api/cancel-subscription', async (req, res) => {
  if (!stripe) { return res.status(500).json({ error: 'Stripe API key not configured' }); }
  try {
    const { userId, subscriptionId } = req.body; 
     if (!admin.apps.length > 0) { return res.status(500).json({ error: 'Firebase Admin SDK not configured.' }); }
     if (!subscriptionId) { return res.status(400).json({ error: 'Subscription ID is required.'}); }

    const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
    });

    const db = admin.firestore();
    // Find the document by subscriptionId to update it, or use userId if it's the doc ID
    const subQuery = await db.collection('subscriptions').where('subscriptionId', '==', subscriptionId).limit(1).get();
    if (!subQuery.empty) {
        const docIdToUpdate = subQuery.docs[0].id;
        await db.collection('subscriptions').doc(docIdToUpdate).update({
            status: canceledSubscription.status, 
            cancel_at_period_end: true,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    } else {
        console.warn(`Subscription ${subscriptionId} not found in Firestore to update cancellation status.`);
        // Optionally, still return success to client as Stripe succeeded
    }
    
    logTransaction('subscription.canceled', 'stripe', userId, { subscriptionId });
    return res.json({ status: canceledSubscription.status, cancel_at_period_end: true });
  } catch (error) {
    console.error('Stripe cancellation error:', error);
    logError('subscription.cancel.failed', 'stripe', req.body.userId, error, { subscriptionId: req.body.subscriptionId });
    return res.status(500).json({ error: error.message });
  }
});

// Handle PayPal subscription confirmation
app.post('/api/confirm-paypal-subscription', async (req, res) => {
  try {
    const { orderID, userId, planId } = req.body;
    console.log('Received PayPal confirmation request:', { orderID, userId, planId });

    if (admin.apps.length > 0) {
        const db = admin.firestore();
        await db.collection('subscriptions').doc(userId).set({
            userId,
            paypalOrderId: orderID, 
            planId: planId,
            status: 'active', 
            paymentProcessor: 'paypal',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        logTransaction('subscription.created', 'paypal', userId, { orderID, planId });
        res.json({ status: 'success', message: 'PayPal subscription confirmed (simulated)' });
    } else {
        throw new Error('Firebase Admin not initialized for PayPal confirmation.');
    }
  } catch (error) {
    console.error('PayPal confirmation error:', error);
    logError('paypal.subscription.confirm.failed', 'paypal', req.body.userId, error);
    return res.status(500).json({ error: error.message });
  }
});

// --- Webhook Handlers ---

// Webhook for Stripe events
app.post('/webhook/stripe', async (req, res) => {
  if (!stripe) { return res.status(400).send('Stripe webhook error: Stripe not configured.'); }
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  if (!req.rawBody) {
    console.error('Stripe Webhook Error: Raw body not available. Ensure express.json verify option is correctly set up.');
    return res.status(400).send('Webhook Error: Raw body not available.');
  }
  if (!sig) {
    console.error('Stripe Webhook Error: No stripe-signature header.');
    return res.status(400).send('Webhook Error: Missing stripe-signature.');
  }
  if (!endpointSecret) {
    console.error('Stripe Webhook Error: STRIPE_WEBHOOK_SECRET not set on server.');
    return res.status(500).send('Webhook configuration error.');
  }

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error(`Stripe Webhook Signature Verification Error: ${err.message}`);
    logError('webhook.stripe.signature_error', 'stripe', null, err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`Stripe event received: ${event.type}`);
  try {
    if (!admin.apps.length > 0) {
        console.error('Firebase Admin not initialized. Cannot process webhook event in Firestore.');
        // Decide if you should still send 200 to Stripe or a 500
        return res.status(500).json({ error: 'Firebase Admin not configured for webhook processing.'});
    }
    const db = admin.firestore();
    const data = event.data.object;
    let userIdToUpdate, customerId, subscriptionIdToUpdate;

    // Helper to find user and update subscription
    const findUserAndUpdateSubscription = async (subId, updatePayload) => {
        const subQuery = await db.collection('subscriptions').where('subscriptionId', '==', subId).limit(1).get();
        if (!subQuery.empty) {
            const docId = subQuery.docs[0].id;
            userIdToUpdate = subQuery.docs[0].data().userId;
            await db.collection('subscriptions').doc(docId).update({
                ...updatePayload,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            return userIdToUpdate;
        }
        return null;
    };

    switch (event.type) {
      case 'invoice.payment_succeeded':
        subscriptionIdToUpdate = data.subscription;
        customerId = data.customer;
        if (subscriptionIdToUpdate) {
            const stripeSub = await stripe.subscriptions.retrieve(subscriptionIdToUpdate);
            userIdToUpdate = await findUserAndUpdateSubscription(subscriptionIdToUpdate, {
                status: stripeSub.status,
                current_period_end: admin.firestore.Timestamp.fromMillis(stripeSub.current_period_end * 1000),
            });
            if (userIdToUpdate) {
              logTransaction('webhook.invoice.payment_succeeded', 'stripe', userIdToUpdate, { subscriptionIdToUpdate, customerId });
            }
        }
        break;
      case 'invoice.payment_failed':
        subscriptionIdToUpdate = data.subscription;
        customerId = data.customer;
        if (subscriptionIdToUpdate) {
            // It's good practice to retrieve the subscription to confirm its state
            // and to ensure you have the most up-to-date information.
            const stripeSub = await stripe.subscriptions.retrieve(subscriptionIdToUpdate); 
            userIdToUpdate = await findUserAndUpdateSubscription(subscriptionIdToUpdate, { 
                status: stripeSub.status, // Use status from the retrieved subscription
                // Optionally, update other fields like 'last_payment_attempt_failed_reason' if available and needed
            });
            if (userIdToUpdate) {
                logError('webhook.invoice.payment_failed', 'stripe', userIdToUpdate, data, { subscriptionIdToUpdate, customerId, status: stripeSub.status });
            }
        }
        break;
      case 'customer.subscription.updated':
        // For subscription updates, data is the subscription object itself
        subscriptionIdToUpdate = data.id; 
        customerId = data.customer;
        if (subscriptionIdToUpdate) {
            // data should be the updated subscription object from Stripe
            userIdToUpdate = await findUserAndUpdateSubscription(subscriptionIdToUpdate, {
                status: data.status,
                planId: data.items.data[0].price.lookup_key || data.items.data[0].price.id, 
                cancel_at_period_end: data.cancel_at_period_end,
                current_period_end: admin.firestore.Timestamp.fromMillis(data.current_period_end * 1000),
            });
            if (userIdToUpdate) {
                logTransaction('webhook.customer.subscription.updated', 'stripe', userIdToUpdate, { subscriptionIdToUpdate, customerId, status: data.status });
            }
        }
        break;
      case 'customer.subscription.deleted':
        // For subscription deletions, data is the subscription object itself (now canceled)
        subscriptionIdToUpdate = data.id;
        customerId = data.customer;
        if (subscriptionIdToUpdate) {
             // data should be the (now canceled) subscription object from Stripe
            userIdToUpdate = await findUserAndUpdateSubscription(subscriptionIdToUpdate, {
                status: data.status, // Should be 'canceled' or similar
                // Consider clearing or marking fields like current_period_end as appropriate
            });
            if (userIdToUpdate) {
                logTransaction('webhook.customer.subscription.deleted', 'stripe', userIdToUpdate, { subscriptionIdToUpdate, customerId, status: data.status });
            }
        }
        break;
      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }

    // Always respond with 200 to acknowledge receipt of the event
    res.status(200).send('Event received');
  } catch (error) {
    console.error('Error processing webhook event:', error);
    logError('webhook.stripe.processing_error', 'stripe', null, error);
    return res.status(500).send('Webhook processing error');
  }
});

// Error handler middleware (last middleware)
app.use(errorHandler);

// Serve frontend static files
// Serve static files from the React app
const publicPath = path.join(__dirname, 'build');
app.use(express.static(publicPath, {
  etag: true,
  lastModified: true,
  maxAge: '1y',
  setHeaders: (res, path) => {
    // Cache static assets for 1 year
    if (path.endsWith('.css') || path.endsWith('.js') || path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.gif') || path.endsWith('.svg') || path.endsWith('.ico') || path.endsWith('.woff') || path.endsWith('.woff2') || path.endsWith('.ttf') || path.endsWith('.eot')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
