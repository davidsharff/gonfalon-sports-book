'use strict';
const React = require('react');
const _ = require('lodash');
const autobind = require('autobind-decorator');
const PropBetInput = require('../components/prop-bet-input');
const {propGroupOperators, multipleChoiceLabels} = require('../../shared/constants');

const {PropTypes} = React;

@autobind
class ReadonlyPropGroup extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    onStartAdminEdit: PropTypes.func,
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
    isLoggedIn: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    onAddWinningProp: PropTypes.func.isRequired,
    userBubbleBalance: PropTypes.number,
    winningPropId: PropTypes.number
  }

  handleStartEdit() {
    if (!this.props.winningPropId) {
      this.props.onStartAdminEdit();
    }
  }

  render() {
    const groupLabelStyle = this.props.isAdmin && !this.props.winningPropId
      ? adminGroupLabelStyle
      : baseGroupLabelStyle;
    return (
      <div style={propGroupContainerStyle}>
        <div style={groupLabelStyle} onClick={this.handleStartEdit}>
          Group {this.props.groupNumber}
        </div>
        <div style={interestStyle}>{formatInterestValue(this.props.interest)}</div>
        <div style={operatorStyle}>{this.props.operator}</div>
        {
          this.props.includedProps.map(({id: propId, description, currentLine}, index) =>
            <IncludedProp
              key={propId}
              id={propId}
              description={description}
              isWinningProp={this.props.winningPropId === propId}
              hasWinningProp={!!this.props.winningPropId}
              line={currentLine}
              choiceLabel={multipleChoiceLabels[index]}
              isLoggedIn={this.props.isLoggedIn}
              onPlaceBet={(bubbles) =>
                this.props.onPlaceBet(this.props.id, propId, parseFloat(bubbles))
              }
              onAddWinningProp={this.props.onAddWinningProp}
              isAdmin={this.props.isAdmin}
              userBubbleBalance={this.props.userBubbleBalance}
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
    isWinningProp: PropTypes.bool.isRequired,
    hasWinningProp: PropTypes.bool.isRequired,
    line: PropTypes.number.isRequired,
    choiceLabel: PropTypes.string.isRequired,
    onPlaceBet: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    onAddWinningProp: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    userBubbleBalance: PropTypes.number
  }

  state = {
    isInputtingBet: false
  }

  handleToggleBetInput() {
    if (!this.props.hasWinningProp) {
      this.setState({
        isInputtingBet: !this.state.isInputtingBet
      });
    }
  }

  handlePlaceBet(bubbles) {
    this.props.onPlaceBet(bubbles);
    this.handleToggleBetInput();
  }

  handleMarkAsWon(propId) {
    this.handleToggleBetInput();
    this.props.onAddWinningProp(propId);
  }

  render() {
    const {props} = this;

    const propContainerStyle = props.hasWinningProp
      ? props.isWinningProp
        ? winningPropContainerStyle
        : losingPropContainerStyle
      : basePropContainerStyle;

    // TODO: it is horrible that the prop rows grow the width of the screen (and are clickable)
    return (
      <div style={propContainerStyle}>
        <div style={props.isLoggedIn && !props.hasWinningProp ? enabledPropRowStyle : disabledPropRowStyle}>
          <div
            style={{display: 'flex', flexDirection: 'row'}}
            onClick={() => props.isLoggedIn && this.handleToggleBetInput(props.id)}
          >
            <div style={propItemStyle}>{props.choiceLabel}</div>
            <div style={propItemStyle}>{props.description}</div>
            <div style={propItemStyle}>{(props.line > 0 ? '+' : '') + props.line}</div>
          </div>
        </div>
        {
          this.state.isInputtingBet
            ? <PropBetInput
                alignmentStyle={{paddingLeft: '15px'}}
                onPlaceBet={this.handlePlaceBet}
                onCancel={this.handleToggleBetInput}
                currentBubbleBalance={props.userBubbleBalance}
              />
            : null
        }
        {
          this.state.isInputtingBet && props.isAdmin
            ? <button style={markAsWonStyle} onClick={() => this.handleMarkAsWon(props.id)}>
                Mark as Won
              </button>
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

const baseGroupLabelStyle = {
  fontWeight: '400',
  paddingBotton: '5px'
};

const adminGroupLabelStyle = Object.assign({}, baseGroupLabelStyle, {
  cursor: 'pointer'
});

const enabledPropRowStyle = {
  display: 'flex',
  flexDirection: 'row',
  paddingTop: topSpacing,
  paddingLeft: '15px',
  cursor: 'pointer'
};

const disabledPropRowStyle = Object.assign({}, enabledPropRowStyle, {
  cursor: 'default'
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

const basePropContainerStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const markAsWonStyle = {
  marginLeft: '15px',
  marginTop: '10px',
  maxWidth: '170px'
};

const winningPropContainerStyle = Object.assign({}, basePropContainerStyle, {
  color: '#42c88a'
});

const losingPropContainerStyle = Object.assign({}, basePropContainerStyle, {
  color: '#aaa'
});

module.exports = ReadonlyPropGroup;

function formatInterestValue(interest) {
  return interest > 0
    ?  'Interest ' + interest + '%'
    : 'No interest';
}