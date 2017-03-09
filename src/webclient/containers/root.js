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
  userBubbleBalance: getUserBubbleBalance(app, auth.getUsername())
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
        <div style={descriptionStyle}>
          Welcome to the Gonfalon Sportsbook. For more information, visit the project's source
          on the <a href="http://gonfalonbubble.com/?p=28">Gonfalon Bubble</a> blog.
        </div>
      </div>
    );
  }
}

module.exports = Root;

const rootContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  margin: '10px'
};

const descriptionStyle = {
  paddingTop: '5px'
};