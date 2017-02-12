'use strict';
const React = require('react');
const {connect} = require('react-redux');
const _ = require('lodash');
const HeaderBar = require('../components/header-bar');

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
        <HeaderBar />
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