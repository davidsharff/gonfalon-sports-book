'use strict';
const autobind = require('autobind-decorator');

let clients = [];
class Client {
  constructor(ws) {
    this._ws = ws;
    clients = [...clients, this];
    this._ws.on('message', this._onMessage);
    this._ws.on('close', this._onClose);
    console.log('New client connection');
  }

  send(action) {
    this._ws.send(JSON.stringify(action), (error) => {
      if (error) {
        console.error(error);
      }
    });
  }

  _onMessage(action) {
    console.log(`Action received: ${action}`);
    if (this._ws) { // Avoid race condition
      this.send({type: 'TEST_SERVER_MESSAGE'});
    }
  }

  _onClose() {
    this._ws = null;
    clients = clients.filter((c) => c !== this);
  }
}

module.exports = autobind(Client);