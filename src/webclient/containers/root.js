'use strict';
const React = require('react');
const LiveProps = require('./live-props');

class Root extends React.Component {
  render() {
    return (
      <div style={rootContainerStyle}>
        <div style={titleStyle}>
          Welcome to the Gonfalon Sports Book!
        </div>
        <LiveProps />
      </div>
    );
  }
}

module.exports = Root;

const rootContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif',
  fontWeight: '300'
};

// TODO: move common shared styles into styles.js
const titleStyle = {
  padding: '10px'
};