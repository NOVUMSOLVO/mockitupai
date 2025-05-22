// Middleware for setting proper cache headers for static files
const staticCache = (req, res, next) => {
  // Cache static assets for 1 year (in production)
  const maxAge = process.env.NODE_ENV === 'production' ? 31536000 : 0;
  
  // Set cache headers for different file types
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}, immutable`);
  } else if (req.path.match(/\.(html|htm)$/)) {
    // HTML files should not be cached for long
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  } else {
    // Default cache control for other files
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  
  next();
};

module.exports = staticCache;
