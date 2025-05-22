// Content Security Policy configuration
const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      "https://www.googletagmanager.com",
      "https://region1.google-analytics.com",
      "https://www.google-analytics.com"
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com"
    ],
    imgSrc: [
      "'self'",
      "data:",
      "https:",
      "http:",
      "https://www.google-analytics.com"
    ],
    fontSrc: [
      "'self'",
      "https://fonts.gstatic.com"
    ],
    connectSrc: [
      "'self'",
      "https://*.googleapis.com",
      "https://*.google-analytics.com",
      "https://*.firebaseio.com",
      "wss://*.firebaseio.com"
    ],
    frameSrc: [
      "'self'",
      "https://www.youtube.com",
      "https://www.google.com"
    ],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: []
  },
  reportOnly: process.env.NODE_ENV === 'development'
};

module.exports = cspConfig;
