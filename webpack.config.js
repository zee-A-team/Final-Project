var webpack = require('webpack');

module.exports = {
  entry: {
    app: [__dirname + "/public/entry.js"],
    vendor: ['chiasm', 'model-js', 'd3', 'd3-timer', 'chiasm-component', 'chiasm-crossfilter', 'chiasm-layout', 'chiasm-links', 'chiasm-dataset-loader', 'leaflet', 'lodash'],
  },
  output: {
      path: __dirname + '/public',
      filename: "bundle.js"
  },
  module: {
      loaders: [
          {
            test: /\.css$/, loader: "style!css"
          }
      ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(/* filename= */"vendor.bundle.js")
  ]
};