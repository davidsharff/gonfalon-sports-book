'use strict';
const {REDUX_INIT_ACTION} = require('../../shared/action-types');
const serverActionTypes = require('../action-types');

function localReducer(local, action) {
  const {payload} = action;
  switch (action.type) {
    case serverActionTypes.ADD_NEW_USER_ID: {
      return Object.assign({}, local, {
        authUsers: [...local.authUsers, payload]
      });
    }
    case REDUX_INIT_ACTION: {
      // Autommatically sent by redux sent when store initializes.
      return local;
    }
    default:
      return local;
  }
}

module.exports = localReducer;