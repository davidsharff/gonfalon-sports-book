'use strict';
const sharedActionTypes = require('../../shared/action-types');
const serverActionTypes = require('../action-types');

function appReducer(app, action) {
  const {payload} = action;
  switch (action.type) {
    case sharedActionTypes.ADD_NEW_PROP_GROUP: {
      return Object.assign({}, app, {
        propGroups: [
          payload, // Prepending because of "newest first" nature of displays.
          ...app.propGroups
        ]
      });
    }
    case serverActionTypes.ADD_NEW_USER: {
      return Object.assign({}, app, {
        users: [...app.users, payload]
      });
    }
    case sharedActionTypes.REDUX_INIT_ACTION: {
      // Autommatically sent by redux sent when store initializes.
      return app;
    }
    default:
      return app;
  }
}

module.exports = appReducer;