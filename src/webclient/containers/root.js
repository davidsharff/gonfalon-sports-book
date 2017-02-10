'use strict';
const React = require('react');
const {connect} = require('react-redux');
const _ = require('lodash');

@connect(({app}) => ({
  hasAppState: !_.isEmpty(app)
}))
class Root extends React.Component {
  static propTypes = {
    hasAppState: React.PropTypes.bool,
    children: React.PropTypes.node
  }
  render() {
    return (
      <div style={rootContainerStyle}>
        <div style={titleStyle}>
          Welcome to the Gonfalon Sports Book!
        </div>
        {
          this.props.hasAppState
            ? this.props.children
            : null
        }
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