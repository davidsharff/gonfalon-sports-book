'use strict';
const {createStore} = require('redux');
const reducer = require('./reducer');

const initialAppState = {
  app: {
    liveProps: []
  }
};

const store = createStore(reducer, initialAppState);

module.exports = store;