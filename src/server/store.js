'use strict';
const {createStore} = require('redux');
const reducer = require('./reducer');

const initialAppState = {
  app: {
    propItems: []
  }
};

const store = createStore(reducer, initialAppState);

module.exports = store;