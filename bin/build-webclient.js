#!/usr/bin/env node
'use strict';

const webpack = require('webpack');
const config = require('../webpack.config.js');
const args = require('../webpack-args');

const compiler = webpack(config);

if (args.isDevEnv) {
  compiler.watch({
    aggregateTimeout: 0,
    poll: false
  }, log);
} else {
  compiler.run(log);
}

function log(error, stats) {
  console.log(stats.toString({
    hash: false,
    version: false,
    timings: true,
    assets: false,
    chunks: true,
    chunkModules: false,
    modules: false,
    children: false,
    cached: false,
    reasons: false,
    source: false,
    errorDetails: true,
    chunkOrigins: false,
    colors: true
  }));
}