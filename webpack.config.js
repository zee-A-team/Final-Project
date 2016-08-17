"use strict";
var path = require('path');
var webpack = require('webpack');

var config = {
  entry: [
    './entry.js',
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /(\.scss$|\.css$)/,
        loaders: [
          'style',
          'css',
        ],
      },
    ],
  },
};

module.exports = config;