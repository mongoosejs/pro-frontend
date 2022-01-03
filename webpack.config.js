'use strict';

module.exports = {
  mode: 'development',
  entry: {
    app: `${__dirname}/src/main.js`
  },
  target: 'web',
  output: {
    path: `${__dirname}/public`,
    filename: 'bundle.js'
  },
  optimization: {
    minimize: false
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          sources: false
        }
      }
    ]
  }
};