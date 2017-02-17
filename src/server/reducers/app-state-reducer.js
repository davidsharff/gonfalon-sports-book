'use strict';
const sharedActionTypes = require('../../shared/action-types');
const serverActionTypes = require('../action-types');

function appReducer(app, action) {
  const {payload} = action;
  switch (action.type) {
    case sharedActionTypes.ADD_NEW_PROP_GROUP: {
      return Object.assign({}, app, {
        propGroups: [
          payload,
          ...app.propGroups
        ]
      });
    }
    case sharedActionTypes.EDIT_PROP_GROUP: {
      return Object.assign({}, app, {
        propGroups: app.propGroups.map((pg) =>
          pg.id === payload.id
            ? Object.assign({}, pg, payload)
            : pg
        )
      });
    }
    case sharedActionTypes.ADD_WINNING_PROP: {
      return Object.assign({}, app, {
        winningProps: [
          payload,
          ...app.winningProps
        ]
      });
    }
    case sharedActionTypes.PLACE_BET: {
      return Object.assign({}, app, {
        bets: [
          payload,
          ...app.bets
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