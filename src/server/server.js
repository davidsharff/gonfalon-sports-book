'use strict';

const path = require('path');
const http = require('http');
const express = require('express');
const WebSocketServer = require('ws').Server;
const {getArgs} = require('./args');
const Client = require('./client');
const DIST_PATH = path.resolve(__dirname, '../../public/');

const app = express();

// TODO: add gzip eventually.

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
const wss = new WebSocketServer({ server: server });
wss.on('connection', (ws) => new Client(ws));


// Listen.
server.on('request', app);
server.listen(getArgs().port, function () {
  console.log(`Listening on ${server.address().port}.`);
});