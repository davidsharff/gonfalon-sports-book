'use strict';

const React = require('react');
const {Link} = require('react-router');
const styles = require('../styles');


class HeaderBar extends React.Component {
  static propTypes = {
    isAuthenticated: React.PropTypes.bool.isRequired,
    onLogin: React.PropTypes.func,
    onLogout: React.PropTypes.func
  };
  render() {
    // TODO: the admin/props link keeps appending to the url.
    return (
      <div style={rowStyle}>
        <div style={mainTitleStyle}>
          Gonfalon Sportsbook
        </div>
        <div style={linksContainerStyle}>
          <Link style={linkActiveStyle} to="/props">Props</Link>
          <Link style={linkDisabledStyle} to="/">Live Bets</Link>
          <Link style={linkDisabledStyle} to="/">About</Link>
          {
            this.props.isAuthenticated
              ? <div style={linkActiveStyle} onClick={this.props.onLogout}>Logout</div>
              : <div style={linkActiveStyle} onClick={this.props.onLogin}>Login</div>
          }
        </div>
      </div>
    );
  }
}

module.exports = HeaderBar;

const rowStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottomColor: '#aaa',
  borderBottomStyle: 'solid',
  borderBottomWidth: '1px',
  marginLeft: '10px',
  marginRight: '10px',
  padding: '10px 0 10px 0'
};

const linksContainerStyle = {
  display: 'flex',
  flexDirection: 'row'
};

const linkItemStyle = {
  marginLeft: '15px'
};

const linkActiveStyle =  Object.assign({}, linkItemStyle, styles.linkActive);

const linkDisabledStyle =  Object.assign({}, linkItemStyle, styles.linkDisabled);

const mainTitleStyle = Object.assign({}, styles.linkActive, {
  fontSize: '16pt',
  color: 'black'
});