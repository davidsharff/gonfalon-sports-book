'use strict';
const {createStore, combineReducers, applyMiddleware} = require('redux');
const {routeReducer, syncHistory} = require('react-router-redux');
const history = require('./history');
const reducer = require('./reducer');

const combinedReducers = combineReducers({
  app: reducer,
  routing: routeReducer
});

const reduxRouterMiddleware = syncHistory(history);
const createStoreWithMiddleware = applyMiddleware(reduxRouterMiddleware)(createStore);

const store = createStoreWithMiddleware(combinedReducers);

module.exports = store;