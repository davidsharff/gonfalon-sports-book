'use strict';

// TODO: Confirm if this is still necessary with newer versions of lodash.
// Work around https://github.com/lodash/lodash/issues/1798;
require('lodash').noConflict();

const React = require('react');
const ReactDOM = require('react-dom');
const {Router, Route} = require('react-router');
const {Provider} = require('react-redux');
const store = require('./store');
const Root = require('./containers/Root');
const socket = require('./socket');
const history = require('./history');

const NotFound  = require('./containers/not-found');
const PropsList = require('./containers/props-list'); // TODO: pedantic, but should probably be "prop-list"

socket.onMessage(({data: action}) => store.dispatch(JSON.parse(action)));

// TODO: one day we may want to "hot swap" routes based on admin privelages (to prevent nefarious actions)
ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Root}>
        <Route path="props" component={PropsList} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'));