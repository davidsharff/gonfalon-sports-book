'use strict';
const autobind = require('autobind-decorator');
const store = require('./store');

const {
  SET_NEW_APP_STATE,
  NOTIFY_AUTHENTICATION
} = require('../shared/action-types');

let clients = [];
class Client {
  constructor(ws) {
    this._ws = ws;
    clients = [...clients, this];
    this._ws.on('message', this._onMessage);
    this._ws.on('close', this._onClose);
    this.sendCurrentState();
    this._userId = null;
  }

  sendCurrentState() {
    this._send({
      type: SET_NEW_APP_STATE,
      payload: store.getState().app
    });
  }

  _send(action) {
    this._ws.send(JSON.stringify(action), (error) => {
      if (error) {
        console.error(error);
      }
    });
  }

  _onMessage(action) {
    // TODO: ensure it is a valid action type.
    console.log(`Action: ${action}`);
    action = JSON.parse(action);
    if (action.type === NOTIFY_AUTHENTICATION) { // TODO: move to middleware
      this._userId = action.payload.userId;
      return;
    }

    store.dispatch(action);
    broadcastNewAppState();
  }

  _onClose() {
    this._ws = null;
    clients = clients.filter((c) => c !== this);
  }
}

module.exports = autobind(Client);

function broadcastNewAppState() {
  clients.forEach((c) => c.sendCurrentState());
}