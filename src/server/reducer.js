'use strict';
const actionTypes = require('../shared/action-types');

function appReducer(state, action) {
  const {payload} = action;
  switch (action.type) {
    case actionTypes.ADD_PROP: {
      const {id, description} = payload;
      return Object.assign({}, state, {
        app: {
          propItems: [...state.app.propItems, {id, description}]
        }
      });
    }
    case actionTypes.REDUX_INIT_ACTION: {
      // Autommatically sent by redux sent when store initializes.
      return state;
    }
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

module.exports = appReducer;