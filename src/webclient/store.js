'use strict';
const {createStore, combineReducers, applyMiddleware} = require('redux');
const {routeReducer, syncHistory} = require('react-router-redux');
const history = require('./history');
const appStateReducer = require('./reducers/app-state-reducer');
const localStateReducer = require('./reducers/local-state-reducer');

const combinedReducers = combineReducers({
  app: appStateReducer,
  local: localStateReducer,
  routing: routeReducer
});


const reduxRouterMiddleware = syncHistory(history);
const createStoreWithMiddleware = applyMiddleware(reduxRouterMiddleware)(createStore);

const store = createStoreWithMiddleware(combinedReducers);

module.exports = store;