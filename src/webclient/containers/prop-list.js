'use strict';
const React = require('react');
const {connect} = require('react-redux');
const autobind = require('autobind-decorator');
const _ = require('lodash');
const socket = require('../socket');
const AdminPropGroupControls = require('../components/admin-prop-group-controls');
const ReadonlyPropGroup = require('../components/readonly-prop-group');
const EditablePropGroup = require('../components/editable-prop-group');
const {calcCurrentPropLine} = require('../../shared/selectors');
const {ADD_NEW_PROP_GROUP, EDIT_PROP_GROUP, PLACE_BET, ADD_WINNING_PROP} = require('../../shared/action-types');
const utils = require('../../shared/utils');
const {adminEmails, propGroupOperators} = require('../../shared/constants');

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

  handleSavePropGroupEdit(propGroup) {
    socket.sendAction({
      type: EDIT_PROP_GROUP,
      payload: propGroup
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

  handleAddWinningProp(propGroupId, propId) {
    socket.sendAction({
      type: ADD_WINNING_PROP,
      payload: {
        propGroupId,
        propId
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
          <PropGroupWrapper
            key={pg.id}
            id={pg.id}
            onSave={this.handleSavePropGroupEdit}
            groupNumber={this.props.propGroups.length - i}
            operator={pg.operator}
            interest={pg.interest}
            includedProps={pg.includedProps}
            onPlaceBet={this.handlePlaceBet}
            isAdmin={this.props.isAdmin}
            isLoggedIn={this.props.isLoggedIn}
            onAddWinningProp={this.handleAddWinningProp}
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

@autobind
class PropGroupWrapper extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    groupNumber: PropTypes.number.isRequired,
    operator: PropTypes.oneOf(_.values(propGroupOperators)).isRequired,
    interest: PropTypes.number.isRequired,
    onSave: PropTypes.func.isRequired,
    includedProps: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      startingLine: PropTypes.number.isRequired,
      currentLine: PropTypes.number.isRequired
    })).isRequired,
    onPlaceBet: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    onAddWinningProp: PropTypes.func.isRequired
  }

  state = {
    isEditing: false
  }

  handleToggleEditing() {
    if (!this.props.isAdmin) {
      return;
    }
    this.setState({
      isEditing: !this.state.isEditing
    });
  }

  handleSavePropGroup(propGroup) {
    this.props.onSave(Object.assign({}, propGroup, {
      id: this.props.id
    }));
    this.handleToggleEditing();
  }

  handleAddWinningProp(propId) {
    this.props.onAddWinningProp(this.props.id, propId);
  }

  render() {
    const {props} = this;
    return (
      <div style={propGroupContainerStyle}>
        {
          this.state.isEditing
            ? <EditablePropGroup
                onSave={this.handleSavePropGroup}
                onCancel={this.handleToggleEditing}
                propGroup={{
                  operator: props.operator,
                  interest: props.interest,
                  includedProps: props.includedProps
                }}
              />
            : <ReadonlyPropGroup
                id={props.id}
                onStartAdminEdit={this.handleToggleEditing}
                groupNumber={props.groupNumber}
                operator={props.operator}
                interest={props.interest}
                includedProps={props.includedProps}
                onPlaceBet={props.onPlaceBet}
                isLoggedIn={props.isLoggedIn}
                isAdmin={props.isAdmin}
                onAddWinningProp={this.handleAddWinningProp}
              />
        }
      </div>
    );
  }
}

const propGroupContainerStyle = {
  display: 'flex',
  flexDirection: 'column'
};