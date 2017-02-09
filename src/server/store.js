'use strict';
const {createStore} = require('redux');
const reducer = require('./reducer');

const initialState = {
  liveProps: []
};

const store = createStore(reducer, initialState);

module.exports = store;