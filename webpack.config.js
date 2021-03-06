'use strict';

const config = require('./.config');
const webpack = require('webpack');

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
  plugins: [
    new webpack.DefinePlugin({
      __BASE_URL: `'${config.baseURL}'`
    }),
    new webpack.DefinePlugin({
      __githubOAuthClientId: `'${config.githubOAuthClientId}'`
    })
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          sources: false
        }
      },
      {
        test: /\.css$/i,
        type: 'asset/source'
      }
    ]
  }
};