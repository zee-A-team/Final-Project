var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = {
  entry: [
    './entry.js',
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  output: {
    path: __dirname + 'public',
    filename: 'bundle.js'
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
          'sass'
        ]
      }
    ],
    postcss: [
      require('autoprefixer')
    ]
  },
};
