const webpack = require('webpack');

module.exports = {
  entry: [
    './entry.js',
  ],
  output: {
    path: `${__dirname}/public`,
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      test: /.js?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    },
    {
      test: /(\.scss$|\.css$)/,
      loaders: [
        'style',
        'css',
        'sass',
      ],
    },
    ],
    postcss: [
      require('autoprefixer'),
    ],
  },
};
