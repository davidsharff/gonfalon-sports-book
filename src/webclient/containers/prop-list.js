'use strict';
const React = require('react');
const {connect} = require('react-redux');
const _ = require('lodash');
const autobind = require('autobind-decorator');
const socket = require('../socket');
const AdminPropGroupControls = require('../components/admin-prop-group-controls');
const PropBetInput = require('../components/prop-bet-input');
const {calcCurrentPropLine} = require('../../shared/selectors');
const {ADD_NEW_PROP_GROUP, PLACE_BET} = require('../../shared/action-types');
const utils = require('../../shared/utils');
const {propGroupOperators, multipleChoiceLabels} = require('../../shared/constants');
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

// TODO: move to component directory
class ReadonlyPropGroup extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    groupNumber: PropTypes.number.isRequired,
    operator: PropTypes.oneOf(_.values(propGroupOperators)).isRequired,
    interest: PropTypes.number.isRequired,
    includedProps: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      startingLine: PropTypes.number.isRequired,
      currentLine: PropTypes.number.isRequired
    })).isRequired,
    onPlaceBet: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
  }

  render() {
    // TODO: use selector to get line value
    return (
      <div style={propGroupContainerStyle}>
        <div style={groupLabelStyle}>Group {this.props.groupNumber}</div>
        <div style={interestStyle}>{formatInterestValue(this.props.interest)}</div>
        <div style={operatorStyle}>{this.props.operator}</div>
        {
          this.props.includedProps.map(({id: propId, description, currentLine}, index) =>
            <IncludedProp
              key={propId}
              id={propId}
              description={description}
              line={currentLine}
              choiceLabel={multipleChoiceLabels[index]}
              isLoggedIn={this.props.isLoggedIn}
              onPlaceBet={(bubbles) =>
                this.props.onPlaceBet(this.props.id, propId, parseFloat(bubbles))
              }
            />
          )
        }
      </div>
    );
  }
}

@autobind
class IncludedProp extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    line: PropTypes.number.isRequired,
    choiceLabel: PropTypes.string.isRequired,
    onPlaceBet: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
  }

  state = {
    isInputtingBet: false
  }

  handleToggleBetInput() {
    this.setState({
      isInputtingBet: !this.state.isInputtingBet
    });
  }

  handlePlaceBet(bubbles) {
    this.props.onPlaceBet(bubbles);
    this.handleToggleBetInput();
  }

  render() {
    const {props} = this;
    return (
      <div style={propContainer}>
        <div
          style={props.isLoggedIn ? disabledPropRowStyle : enabledPropRowStyle}
          onClick={() => props.isLoggedIn && this.handleToggleBetInput(props.id)}
        >
          <div style={propItemStyle}>{props.choiceLabel}</div>
          <div style={propItemStyle}>{props.description}</div>
          <div style={propItemStyle}>{(props.line > 0 ? '+' : '') + props.line}</div>
        </div>
        {
           this.state.isInputtingBet
            ? <PropBetInput
                alignmentStyle={{paddingLeft: '15px'}}
                onPlaceBet={this.handlePlaceBet}
                onCancel={this.handleToggleBetInput}
                currentBubbleBalance={0}
              />
            : null
        }
      </div>
    );
  }
}

const topSpacing = '10px';

const propGroupContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: '20px'
};

const groupLabelStyle = {
  fontWeight: '400',
  paddingBotton: '5px'
};

const enabledPropRowStyle = {
  display: 'flex',
  flexDirection: 'row',
  paddingTop: topSpacing,
  paddingLeft: '15px'
};

const disabledPropRowStyle = Object.assign({}, enabledPropRowStyle, {
  cursor: 'pointer'
});

const propItemStyle = {
  marginRight: '10px'
};

const interestStyle = {
  paddingTop: topSpacing,
  color: '#777'
};

const operatorStyle = {
  paddingTop: '10px'
};

const propContainer = {
  display: 'flex',
  flexDirection: 'column'
};

function formatInterestValue(interest) {
  return interest > 0
    ?  'Interest ' + interest * 100 + '%'
    : 'No interest';
}