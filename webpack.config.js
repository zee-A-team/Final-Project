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
    {
      test: /\.(woff|svg|ttf|eot)([\?]?.*)$/, loader: "file-loader?name=[name].[ext]"},
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'file?hash=sha512&digest=hex&name=[hash].[ext]',
        'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
      ],
    },



    ],
    postcss: [
      require('autoprefixer'),
    ],
  },
};
