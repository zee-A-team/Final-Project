var webpack = require('webpack');

module.exports = {
  entry: {
    app: _dirname + "/public/entry.js",
  },
  output: {
      path: __dirname,
      filename: "bundle.js"
  },
  module: {
      loaders: [
          {
            test: /\.css$/, loader: "style!css",
            exclude: /node_modules/,
          }
      ],
  },
};