module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Conditionally apply react-refresh alias only in development
      if (env === 'development') {
        webpackConfig.resolve.alias = {
          ...webpackConfig.resolve.alias,
          'react-refresh/runtime': require.resolve('react-refresh/runtime')
        };
      }
      return webpackConfig;
    }
  }
};
