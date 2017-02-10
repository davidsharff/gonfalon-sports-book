'use strict';
const {
  SET_NEW_APP_STATE
} = require('../shared/action-types');

function reducer(state={}, action) {
  switch (action.type) {
    case SET_NEW_APP_STATE: {
      return action.payload;
    }
    default:
      return state;
  }
}

module.exports = reducer;