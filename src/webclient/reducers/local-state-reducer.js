'use strict';
const {
  SET_IS_ADMIN
} = require('../action-types');

function localStateReducer(state={isAdmin: false}, action) {
  switch (action.type) {
    case SET_IS_ADMIN: {
      return Object.assign({}, state, {
        isAdmin: action.payload
      });
    }
    default:
      return state;
  }
}

module.exports = localStateReducer;