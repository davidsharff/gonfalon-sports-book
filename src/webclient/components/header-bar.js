'use strict';

const React = require('react');
const {Link} = require('react-router');
const styles = require('../styles');


class HeaderBar extends React.Component {
  render() {
    // TODO: use router link components
    return (
      <div style={rowStyle}>
        <div style={mainTitleStyle}>
          Gonfalon Sportsbook
        </div>
        <div style={linksContainerStyle}>
          <Link style={linkActiveStyle} to="props">Props</Link>
          <Link style={linkDisabledStyle} to="/" disabled>Live Bets</Link>
          <Link style={linkDisabledStyle} to="/">About</Link>
          <Link style={linkDisabledStyle} to="/">Logout</Link>
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
  margin: '0 5px 0px 5px'
};

const linkActiveStyle =  Object.assign({}, linkItemStyle, styles.linkActive);

const linkDisabledStyle =  Object.assign({}, linkItemStyle, styles.linkDisabled);

const mainTitleStyle = Object.assign({}, styles.linkActive, {
  fontSize: '16pt',
  color: 'black'
});