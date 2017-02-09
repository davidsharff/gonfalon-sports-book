'use strict';
const {
  REDUX_INIT_ACTION,
  SET_NEW_APP_STATE
} = require('../shared/action-types');

function reducer(state={}, action) {
  switch (action.type) {
    case SET_NEW_APP_STATE: {
      return Object.assign({}, action.payload);
    }
    case REDUX_INIT_ACTION: {
      // Autommatically sent by redux sent when store initializes.
      return state;
    }
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

module.exports = reducer;