const sassConfig = require('./sass.config.js');

module.exports = {
  // Existing webpack configuration

  module: {
    rules: [
      // Existing rules

      // Add the following rule for SCSS files
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: sassConfig.sassOptions,
          },
        ],
      },
    ],
  },
};
