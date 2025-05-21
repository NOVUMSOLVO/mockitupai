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
    configure: (webpackConfig) => {
      // Ensure react-refresh is resolved correctly
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'react-refresh/runtime': require.resolve('react-refresh/runtime')
      };
      return webpackConfig;
    }
  }
};
