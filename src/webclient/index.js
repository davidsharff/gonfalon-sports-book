'use strict';

// TODO: Confirm if this is still necessary with newer versions of lodash.
// Work around https://github.com/lodash/lodash/issues/1798;
require('lodash').noConflict();

const React = require('react');
const ReactDOM = require('react-dom');
const {Router, Route} = require('react-router');
const {Provider} = require('react-redux');
const store = require('./store');
const Root = require('./containers/root');
const socket = require('./socket');
const history = require('./history');
const AuthService = require('./auth-service');
const NotFound  = require('./containers/not-found');
const PropList = require('./containers/prop-list');
const BetList = require('./containers/bet-list');
const Prizes = require('./containers/prizes');

const auth = new AuthService('iLsffrD705FgUGVPTgYryl5ga0Ey5CUG', 'gonfalon-sports-book.auth0.com');

if (auth.loggedIn()) {
  socket.onOpen(() => auth.sendServerAuthDetails());
}

socket.onMessage(({data: action}) => store.dispatch(JSON.parse(action)));

// TODO: one day we may want to protect routes based on admin privelages (to prevent nefarious actions)
ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Root} auth={auth}>
        <Route path="props" component={PropList} auth={auth} />
        <Route path="bets" component={BetList} auth={auth} />
        <Route path="prizes" component={Prizes} auth={auth} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'));