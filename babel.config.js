// filepath: /Users/valentinechideme/Documents/augment-projects/mockitupai/babel.config.js
module.exports = function(api) {
  api.cache(true);
  
  // Detect environment (React vs Expo)
  const isExpo = process.env.EXPO_ENV === 'true';
  
  return {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      // Only include expo preset if we're in an Expo environment
      isExpo && 'babel-preset-expo'
    ].filter(Boolean),
    plugins: []
  };
};
