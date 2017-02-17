'use strict';
const React = require('react');
const {connect} = require('react-redux');
const autobind = require('autobind-decorator');
const socket = require('../socket');
const AdminPropGroupControls = require('../components/admin-prop-group-controls');
const ReadonlyPropGroup = require('../components/readonly-prop-group');
const {calcCurrentPropLine} = require('../../shared/selectors');
const {ADD_NEW_PROP_GROUP, PLACE_BET} = require('../../shared/action-types');
const utils = require('../../shared/utils');
const {adminEmails} = require('../../shared/constants');

const {PropTypes} = React;
@connect(({app}, {route: {auth}}) => ({
  propGroups: app.propGroups.map((pg) =>
    Object.assign({}, pg, {
      includedProps: pg.includedProps.map((prop) =>
        Object.assign({}, prop, {currentLine: calcCurrentPropLine(app, pg.id, prop.id)})
      )
    })
  ),
  // Easily spoofed but all admin actions verified on server.
  isAdmin: adminEmails.indexOf(localStorage.getItem('email')) > -1,
  isLoggedIn: auth.loggedIn()
}))
@autobind
class PropList extends React.Component {
  static propTypes = {
    propGroups: PropTypes.arrayOf(PropTypes.object),
    isAdmin: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
  }

  handleSavePropGroup(propGroup) {
    socket.sendAction({
      type: ADD_NEW_PROP_GROUP,
      payload: Object.assign({}, propGroup, {
        id: utils.createRandomId()
      })
    });
  }

  handlePlaceBet(propGroupId, propId, bubbles) {
    socket.sendAction({
      type: PLACE_BET,
      payload: {
        propGroupId,
        propId,
        bubbles
      }
    });
  }


  render() {
    return (
      <div style={containerStyle}>
        {
          this.props.isAdmin
              ? <AdminPropGroupControls
                  onSave={this.handleSavePropGroup}
                />
            : null
        }
        {
          this.props.propGroups.map((pg, i) =>
          <ReadonlyPropGroup
            key={pg.id}
            id={pg.id}
            groupNumber={this.props.propGroups.length - i}
            operator={pg.operator}
            interest={pg.interest}
            includedProps={pg.includedProps}
            onPlaceBet={this.handlePlaceBet}
            isLoggedIn={this.props.isLoggedIn}
          />
          )
        }
      </div>
    );
  }
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  padding: '10px'
};

module.exports = PropList;