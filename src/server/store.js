'use strict';
const fs = require('fs');
const path = require('path');
const {createStore} = require('redux');
const appStateReducer = require('./reducers/app-state-reducer');
const localStateReducer = require('./reducers/local-state-reducer');
const {getArgs} = require('./args');
const updateSchema = require('./update-schema');

const store = createStore(createReducer, getInitialState());

module.exports = store;

function createReducer(state, action) {
  return {
    app: appStateReducer(state.app, action),
    local: localStateReducer(state.local, action)
  };
}

function getInitialState() {
  const initialState = {
    local: {
      authUsers: []
    },
    app: {
      users: [],
      propGroups: [],
      bets: [],
      winningProps: [],
      prizes: [],
      lineAdjustments: []
    }
  };
  let savedState;
  try {
    savedState = fs.readFileSync(path.resolve(__dirname, '../../app-state.json'), {encoding: 'utf-8'});
  } catch (e) {
    if (e.code !== 'ENOENT' /* ok if file does not exist */) {
      throw e;
    }
  }
  const ret = savedState
    ? JSON.parse(savedState)
    : initialState;

  return getArgs().updateSchema
    ? updateSchema(ret)
    : ret;
}