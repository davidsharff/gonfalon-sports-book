'use strict';
const React = require('react');
const {connect} = require('react-redux');
const _ = require('lodash');
const HeaderBar = require('../components/header-bar');
const {getUserBubbleBalance} = require('../../shared/selectors');

@connect(({app}, {route: {auth}}) => ({
  isAuthenticated: auth.loggedIn(),
  handleLogin: auth.login,
  handleLogout: auth.logout,
  hasAppState: !_.isEmpty(app),
  userBubbleBalance: getUserBubbleBalance(app, auth.getEmail())
}))
class Root extends React.Component {
  static propTypes = {
    hasAppState: React.PropTypes.bool,
    children: React.PropTypes.node,
    isAuthenticated: React.PropTypes.bool,
    handleLogin: React.PropTypes.func,
    handleLogout: React.PropTypes.func,
    userBubbleBalance: React.PropTypes.number
  }
  render() {
    return (
      <div style={rootContainerStyle}>
        <HeaderBar
          isAuthenticated={this.props.isAuthenticated}
          onLogin={this.props.handleLogin}
          onLogout={this.props.handleLogout}
          userBubbleBalance={this.props.userBubbleBalance}
        />
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