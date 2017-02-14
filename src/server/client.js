'use strict';
const _ = require('lodash');
const autobind = require('autobind-decorator');
const store = require('./store');
const {ADD_NEW_USER_ID, ADD_NEW_USER} = require('./action-types');
const {
  SET_NEW_APP_STATE,
  NOTIFY_AUTHENTICATION
} = require('../shared/action-types');
const {STARTING_BUBBLES} = require('../shared/constants');

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
      this._handleAuthentication(action.payload.userId, action.payload.email);
      return;
    }

    store.dispatch(action);
    broadcastNewAppState();
  }

  _onClose() {
    this._ws = null;
    clients = clients.filter((c) => c !== this);
  }

  _handleAuthentication(userId, email) {
    const {authUsers} = store.getState().local;
    const authUser = _.find(authUsers, {userId});
    if (!authUser) {
      console.log('adding user details');
      store.dispatch({
        type: ADD_NEW_USER_ID,
        payload: {
          email,
          userId
        }
      });
      store.dispatch({
        type: ADD_NEW_USER,
        payload: {
          email,
          startingBubbles: STARTING_BUBBLES
        }
      });
    }
  }

  _setUserId(userId) {
    if (!userId) {
      throw new Error('Must provided userId. To clear, use _clearUserId() instead');
    }
    this._userId = userId;
  }

  _clearUserId() {
    this._userId = null;
  }
}

module.exports = autobind(Client);

function broadcastNewAppState() {
  clients.forEach((c) => c.sendCurrentState());
}