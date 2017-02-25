/*eslint-env node */
'use strict';

const path = require('path');
const SplitByPathPlugin = require('webpack-split-by-path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const args = require('./webpack-args');
module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src/webclient/index.js')
  },
  output: {
    path: path.join(__dirname, 'public/static'),
    publicPath: '/static/',
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  plugins: [
    new SplitByPathPlugin([
      {
        name: 'vendor',
        path: /.*\/node_modules\/.*\.(js|json)$/
      }
    ]),
    new webpack.DefinePlugin({
      // Use string substitution so the minifier will remove unused code.
      // Some libraries (React, Redux, etc.) look at process.env.NODE_ENV,
      // so we supply it.
      'process.env': {
        NODE_ENV: `"${(args.isDevEnv ? 'development' : 'production')}"`
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/webclient/index.html',
      filename: '../index.html',
      title: 'Gonfalon Sports Book',
      // TODO: favicon needs a hash. Need to relearn how to define in index.html directly with custom "[hash]" syntax.
      favicon: './src/webclient/assets/gsb-dice-bubble-favicon.png',
      hash: true
    }),
    ...(args.isDevEnv
      ? [new webpack.SourceMapDevToolPlugin()]
      : [new webpack.optimize.UglifyJsPlugin()]
    )
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /(node_modules)/,
        query: { // Babel config options
          plugins: [
            'babel-plugin-transform-es2015-destructuring',
            'transform-es2015-parameters',
            'transform-decorators-legacy', // Must go before class properties.
            'transform-class-properties',
            'transform-object-rest-spread'
          ],
          presets: [
            'react',
            ...(
              args.target === 'compatible' ? ['es2015'] : []
            )
          ]
        }
      }
    ]
  }
};