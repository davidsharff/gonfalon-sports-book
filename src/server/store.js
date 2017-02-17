'use strict';
const fs = require('fs');
const path = require('path');
const {createStore} = require('redux');
const appStateReducer = require('./reducers/app-state-reducer');
const localStateReducer = require('./reducers/local-state-reducer');

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
      winningProps: []
    }
  };
  const savedState = fs.readFileSync(path.resolve(__dirname, '../../app-state.json'), {encoding: 'utf-8'});
  return savedState
    ? JSON.parse(savedState)
    : initialState;
}