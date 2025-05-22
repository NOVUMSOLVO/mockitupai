# Deployment Guide for Render

This guide provides instructions for deploying the MockitupAI application to Render.

## Render Configuration

In the Render dashboard, configure your service with the following settings:

1.  **Runtime/Environment**: Select **Node**.
2.  **Build Command**: `npm run build`
    *   This command compiles the React frontend and prepares static assets in the `build` directory.
3.  **Start Command**: `npm start`
    *   This command executes `node server.js`, which starts the Express server. The server handles API requests and serves the static frontend assets.
4.  **Node.js Version**: Ensure Render is using a Node.js version compatible with the `engines` field in `package.json` (e.g., 20.x). You can usually set this in your service's Environment settings on Render.

## Environment Variables

You **must** set the following environment variables in your Render service's environment settings. These are crucial for the application to function correctly.

*   `NODE_ENV`: Set to `production` for optimal performance and to disable development-specific features.
*   `PORT`: Render sets this automatically. Your application (`server.js`) is already configured to use it.
*   `MONGO_URI`: Your MongoDB connection string.
*   `JWT_SECRET`: Secret key for JSON Web Token generation and verification.
*   `JWT_EXPIRE`: JWT expiration time (e.g., `30d`).
*   `JWT_COOKIE_EXPIRE`: JWT cookie expiration time in days (e.g., `30`).
*   `FIREBASE_SERVICE_ACCOUNT`: The JSON content of your Firebase service account key. This needs to be provided as a single line of JSON, or use Render's secret file feature if it's too large for a standard environment variable.
*   `STRIPE_SECRET_KEY`: Your Stripe secret API key.
*   `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable API key.
*   `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret.
*   `STRIPE_PRICE_ID_PRO`: Stripe Price ID for your "Pro" plan.
*   `STRIPE_PRICE_ID_UNLIMITED`: Stripe Price ID for your "Unlimited" plan.
*   `PAYPAL_CLIENT_ID`: Your PayPal Client ID (if PayPal integration is active).
*   `PAYPAL_CLIENT_SECRET`: Your PayPal Client Secret (if PayPal integration is active).
*   `PAYPAL_API_URL`: PayPal API URL (e.g., `https://api-m.sandbox.paypal.com` for sandbox, `https://api-m.paypal.com` for live).

**Note on `FIREBASE_SERVICE_ACCOUNT`**: If the JSON content is large, consider setting it as a "Secret File" in Render if available, and adjust `server.js` to read it from the specified path. Otherwise, ensure it's correctly formatted as a single-line JSON string when pasting into Render's environment variable settings.

## Health Checks

Render uses health checks to determine if your application has started successfully and remains healthy. `server.js` does not have a dedicated health check endpoint (e.g., `/healthz`). Render will likely default to checking if the TCP port is responsive.
If you encounter deployment issues related to health checks:
*   Ensure your application starts successfully and listens on the `PORT` provided by Render.
*   Consider adding a dedicated `/healthz` route to your `server.js` that returns a `200 OK` status if the application is healthy.

## Troubleshooting a Blank Page

If you encounter a blank page after deployment:

1.  **Check Render Logs**: Examine the build logs and runtime logs in the Render dashboard for any errors.
    *   Build errors might indicate a problem with `npm run build`.
    *   Runtime errors might show issues in `server.js` (e.g., problems connecting to the database, issues with environment variables).
2.  **Browser Developer Console**: Open your browser's developer console (usually by pressing F12) and check for:
    *   **Console Errors**: Look for JavaScript errors that might be preventing the React application from rendering.
    *   **Network Tab**: Check if `index.html` is being loaded successfully (status 200). Then, check if the linked CSS and JavaScript files (e.g., `main.<hash>.js`, `main.<hash>.css`) are also loading with a 200 status. If they show 404 errors, it indicates a path issue or that the files were not correctly placed in the `build` directory or served.
3.  **Environment Variables**: Double-check that all required environment variables are correctly set in Render and that they do not contain any typos or formatting issues (especially for multi-line variables like `FIREBASE_SERVICE_ACCOUNT` if not using secret files).

By following these guidelines, you should be able to deploy and run the application successfully on Render.
