'use strict';

const React = require('react');
const {Link} = require('react-router');
const {routeActions} = require('react-router-redux');
const autobind = require('autobind-decorator');
const store = require('../store');
const styles = require('../styles');

@autobind
class HeaderBar extends React.Component {
  static propTypes = {
    isAuthenticated: React.PropTypes.bool.isRequired,
    onLogin: React.PropTypes.func,
    onLogout: React.PropTypes.func,
    userBubbleBalance: React.PropTypes.number
  };

  handleLogin() {
    store.dispatch(routeActions.replace({pathName: '/'}));
    this.props.onLogin();
  }

  render() {
    // TODO: add handle redirect logins to root before calling authLock.
    return (
      <div style={headerRowStyle}>
        <Link to="/" style={mainTitleStyle}>
          Gonfalon Sportsbook (beta)
        </Link>
        <div>
          {
            this.props.userBubbleBalance !== null
              ? <div style={bubbleBalanceStyle}>Bubbles:&nbsp;{this.props.userBubbleBalance}</div>
              : null
          }
          <div style={linksContainerStyle}>
            <Link style={linkActiveStyle} to="/props">Props</Link>
            <Link style={linkActiveStyle} to="/bets">Live Bets</Link>
            {
              this.props.isAuthenticated
                ? <div style={linkActiveStyle} onClick={this.props.onLogout}>Logout</div>
                : <div style={linkActiveStyle} onClick={this.handleLogin}>Login</div>
            }
          </div>
        </div>
      </div>
    );
  }
}

module.exports = HeaderBar;

const headerRowStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottomColor: '#aaa',
  borderBottomStyle: 'solid',
  borderBottomWidth: '1px',
  padding: '10px 0 10px 0'
};

const bubbleBalanceStyle = {
  display: 'flex',
  flexDirection: 'row',
  fontSize: '10pt',
  justifyContent: 'flex-end'
};

const linksContainerStyle = {
  display: 'flex',
  flexDirection: 'row'
};

const linkItemStyle = {
  marginLeft: '15px'
};

const linkActiveStyle =  Object.assign({}, linkItemStyle, styles.linkActive);

const mainTitleStyle = Object.assign({}, styles.linkActive, {
  fontSize: '16pt',
  color: 'black'
});