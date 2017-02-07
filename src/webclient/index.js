'use strict';

// Work around https://github.com/lodash/lodash/issues/1798;
// TODO: Confirm if this is still necessary with newer versions of lodash.
require('lodash').noConflict();

const React = require('react');
const ReactDOM = require('react-dom');

ReactDOM.render((
  <div>
    Hello, world! I'm the Gonfalon Sports Book.
  </div>
), document.getElementById('app'));

