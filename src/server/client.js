'use strict';
const fs = require('fs');
const _ = require('lodash');
const autobind = require('autobind-decorator');
const moment = require('moment');
const store = require('./store');
const {getEmailForUserId} = require('./selectors');
const {ADD_NEW_USER_ID, ADD_NEW_USER} = require('./action-types');
const sharedActionTypes = require('../shared/action-types');
const {STARTING_BUBBLES, adminEmails} = require('../shared/constants');

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
      type: sharedActionTypes.SET_NEW_APP_STATE,
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

    // TODO: move these middleware things to middleware
    if (action.type === sharedActionTypes.NOTIFY_AUTHENTICATION) {
      this._handleAuthentication(action.payload.userId, action.payload.email);

    } else if (action.type === sharedActionTypes.PLACE_BET) {
      action = Object.assign({}, action, {
        payload: Object.assign({}, action.payload, {
          email: getEmailForUserId(store.getState(), this.getUserId()),
          msTimeStamp: moment().format('x')
        })
      });
    }

    if (hasPermission(action.type, this.getUserId())) {
      store.dispatch(action);
      fs.writeFile('app-state.json', JSON.stringify(store.getState()));
      broadcastNewAppState();
    } else {
      console.error(`Invalid permission. UserId: ${this.getUserId()}`);
    }
  }

  _onClose() {
    this._ws = null;
    clients = clients.filter((c) => c !== this);
  }

  _handleAuthentication(userId, email) {
    this._setUserId(userId);
    const {authUsers} = store.getState().local;
    const authUser = _.find(authUsers, {userId});
    if (!authUser) {
      console.log(`New user: ${email}`);
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

  getUserId() {
    return this._userId;
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

function hasPermission(actionType, userId) {
  const adminActions = [sharedActionTypes.ADD_NEW_PROP_GROUP];
  if (adminActions.indexOf(actionType) > -1) {
    const authUser = _.find(store.getState().local.authUsers, {userId});
    if (!authUser || adminEmails.indexOf(authUser.email) === -1) {
      return false;
    }
  }
  return true;
}