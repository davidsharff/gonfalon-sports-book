'use strict';
const fs = require('fs');
const _ = require('lodash');
const autobind = require('autobind-decorator');
const moment = require('moment');
const store = require('./store');
const {getUsernameForUserId} = require('./selectors');
const {ADD_NEW_USER_ID, ADD_NEW_USER} = require('./action-types');
const sharedActionTypes = require('../shared/action-types');
const {STARTING_BUBBLES, adminUsernames} = require('../shared/constants');
const {calcCurrentPropLine} = require('../shared/selectors');

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
      this._handleAuthentication(action.payload.userId, action.payload.username);

    } else if (action.type === sharedActionTypes.PLACE_BET) {
      const {payload} = action;
      action = Object.assign({}, action, {
        payload: Object.assign({}, payload, {
          username: getUsernameForUserId(store.getState(), this.getUserId()),
          msTimeStamp: moment().format('x'),
          // TODO: got to be a better way of doing this. Balk and notify user if the line changed since submission?
          effectiveLine: calcCurrentPropLine(store.getState().app, payload.propGroupId, payload.propId)
        })
      });
    } else if (action.type === sharedActionTypes.ADD_WINNING_PROP) {
      action = Object.assign({}, action, {
        payload: Object.assign({}, action.payload, {
          msTimeStamp: moment().format('x')
        })
      });
    }

    if (isValidAction(action, this.getUserId())) {
      store.dispatch(action);
      fs.writeFile('app-state.json', JSON.stringify(store.getState()));
      broadcastNewAppState();
    } else {
      console.error(`Invalid action. UserId: ${this.getUserId()}`);
    }
  }

  _onClose() {
    this._ws = null;
    clients = clients.filter((c) => c !== this);
  }

  _handleAuthentication(userId, username) {
    this._setUserId(userId);
    const {authUsers} = store.getState().local;
    const authUser = _.find(authUsers, {userId});

    if (authUser && authUser.username !== username) {
      // TODO: Throwing for now. We need to update applicable state with new username.
      // Drunk on liberty, we could no longer handle the freedom afforded to us by the editability of our twitter handles.
      throw new Error(`New username for existing user. userId: ${userId} old username: ${authUser.username} new username: ${username}`);
    }

    if (!authUser) {
      console.log(`New user: ${username}`);
      store.dispatch({
        type: ADD_NEW_USER_ID,
        payload: {
          username,
          userId
        }
      });
      store.dispatch({
        type: ADD_NEW_USER,
        payload: {
          username,
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

function isValidAction(action, userId) {
  // TODO: these should return a useful error message.
  if (action.type === sharedActionTypes.PLACE_BET) {
    return action.payload.bubbles > 0;
  }
  return hasPermissionForAdminActions(action.type, userId);
}

function hasPermissionForAdminActions(actionType, userId) {
  const adminActions = [
    sharedActionTypes.ADD_NEW_PROP_GROUP,
    sharedActionTypes.EDIT_PROP_GROUP,
    sharedActionTypes.ADD_WINNING_PROP
  ];
  if (adminActions.indexOf(actionType) > -1) {
    const authUser = _.find(store.getState().local.authUsers, {userId});
    if (!authUser || adminUsernames.indexOf(authUser.username) === -1) {
      return false;
    }
  }
  return true;
}