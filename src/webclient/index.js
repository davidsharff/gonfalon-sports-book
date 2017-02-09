'use strict';

// TODO: Confirm if this is still necessary with newer versions of lodash.
// Work around https://github.com/lodash/lodash/issues/1798;
require('lodash').noConflict();

const React = require('react');
const ReactDOM = require('react-dom');

const ws = new window.WebSocket(`ws://${window.location.host}`);

ws.onmessage = ({data: action}) => console.log(action);
ws.onopen  = () => console.log('opening socket');

// Test sending message to server.
setTimeout(() => ws.send(JSON.stringify({type: 'TEST_CLIENT_MESSAGE'})), 1000);

ReactDOM.render((
  <div>
    <div>Hello, world! I'm the Gonfalon Sports Book.</div>
  </div>
), document.getElementById('app'));