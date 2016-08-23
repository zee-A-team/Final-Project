const webpack = require('webpack');
const LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
  entry: [
    './entry.js',
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new LiveReloadPlugin()
  ],
  output: {
    path: `${__dirname}public`,
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
