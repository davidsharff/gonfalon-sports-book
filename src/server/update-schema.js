'use strict';
const utils = require('../shared/utils');

function updateSchema(state) {
  return [addBetIds, addBuyBackCollection].reduce((state, fn) => fn(state), state);
}

function addBuyBackCollection(state) {
  if (state.app.buyBacks) {
    throw new Error('Failed schema update: the buyBacks field already exists.');
  }
  return Object.assign({}, state, {
    app: Object.assign({}, state.app, {
      buyBacks: []
    })
  });
}

function addBetIds(state) {
  state.app.bets.forEach((b) => {
    if (b.id) {
      throw new Error(`Failed schema update: a bet id already exists ${b.id}.`);
    }
  });
  return Object.assign({}, state, {
    app: Object.assign({}, state.app, {
      bets: state.app.bets.map((b) =>
        Object.assign({}, b, {
          id: utils.createRandomId()
        })
      )
    })
  });
}

module.exports = updateSchema;
