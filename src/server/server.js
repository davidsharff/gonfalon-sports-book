'use strict';

const path = require('path');
const http = require('http');
const express = require('express');
const {getArgs} = require('./args');
const DIST_PATH = path.resolve(__dirname, '../../public/');

const app = express();

// TODO: problems with gzip (not encoding?). Bring back -prod arg for server and client build when fixed.
// if (!getArgs().isDevEnv) {
//   app.use(/\/static\/.*\.(js|css|html)(\?.*)?$/, (req, res, next) => {
//     res.set('Content-Encoding', 'gzip');
//     next();
//   });
// }

// Serve static files.
app.use('/static/', express.static(path.join(DIST_PATH, 'static'), {
  index: false
}));

// Serve SPA index file.
app.use('/', (req, res) => {
  res.sendFile(path.resolve(DIST_PATH, 'index.html'));
});

// Create WebSocket server.
const server = http.createServer();

// Listen.
server.on('request', app);
server.listen(getArgs().port, function () {
  console.log(`Listening on ${server.address().port}.`);
});