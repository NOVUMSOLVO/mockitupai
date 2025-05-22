// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', 
    `default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://region1.google-analytics.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https: http:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.googleapis.com https://*.google-analytics.com https://*.firebaseio.com wss://*.firebaseio.com;
    frame-ancestors 'none';
    form-action 'self';
    base-uri 'self'`
    .replace(/\s{2,}/g, ' ').trim()
  );

  // Cache control for static assets
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  next();
};

module.exports = { securityHeaders };
