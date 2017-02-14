'use strict';
const actionTypes = require('../shared/action-types');

function appReducer(state, action) {
  const {payload} = action;
  switch (action.type) {
    case actionTypes.ADD_NEW_PROP_GROUP: {
      return Object.assign({}, state, {
        app: {
          propGroups: [
            payload, // Prepending because of "newest first" nature of displays.
            ...state.app.propGroups
          ]
        }
      });
    }
    case actionTypes.REDUX_INIT_ACTION: {
      // Autommatically sent by redux sent when store initializes.
      return state;
    }
    default:
      throw new Error(`Unknown action: ${JSON.stringify(action)}`);
  }
}

module.exports = appReducer;