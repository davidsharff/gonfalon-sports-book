'use strict';

// TODO: Confirm if this is still necessary with newer versions of lodash.
// Work around https://github.com/lodash/lodash/issues/1798;
require('lodash').noConflict();

const React = require('react');
const ReactDOM = require('react-dom');
const {Provider} = require('react-redux');
const store = require('./store');
const Root = require('./containers/Root');
const socket = require('./socket');
// TODO: toggle require when we support prod vs dev mode.
const DevTools = require('./components/devtools/devtools');

socket.onMessage(({data: action}) => store.dispatch(JSON.parse(action)));

ReactDOM.render((
  <Provider store={store}>
    <Root>
      {DevTools ? <DevTools /> : null}
     </Root>
  </Provider>
), document.getElementById('app'));