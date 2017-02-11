'use strict';
const _ = require('lodash');
const ws = new window.WebSocket(`ws://${window.location.host}`);

function sendAction(action) {
  if (!_.isPlainObject(action)) {
    // TODO: we could do further validation here potentially.
    throw new Error(`Actions must be objects: ${action}`);
  }
  ws.send(JSON.stringify(action));
}

function onMessage(cb) {
  ws.onmessage = cb;
}

module.exports = {
  onMessage: onMessage,
  sendAction
};