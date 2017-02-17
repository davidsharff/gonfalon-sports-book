'use strict';
const React = require('react');
const _ = require('lodash');
const autobind = require('autobind-decorator');
const PropBetInput = require('../components/prop-bet-input');
const {propGroupOperators, multipleChoiceLabels} = require('../../shared/constants');

const {PropTypes} = React;

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
    onAddWinningProp: PropTypes.func.isRequired
  }

  render() {
    const groupLabelStyle = this.props.isAdmin
      ? adminGroupLabelStyle
      : baseGroupLabelStyle;
    return (
      <div style={propGroupContainerStyle}>
        <div style={groupLabelStyle} onClick={this.props.onStartAdminEdit}>
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
              line={currentLine}
              choiceLabel={multipleChoiceLabels[index]}
              isLoggedIn={this.props.isLoggedIn}
              onPlaceBet={(bubbles) =>
                this.props.onPlaceBet(this.props.id, propId, parseFloat(bubbles))
              }
              onAddWinningProp={this.props.onAddWinningProp}
              isAdmin={this.props.isAdmin}
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
    isLoggedIn: PropTypes.bool.isRequired,
    onAddWinningProp: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired
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
    // TODO: it is horrible that the prop rows grow the width of the screen (and are clickable)
    return (
      <div style={propContainer}>
        <div style={props.isLoggedIn ? disabledPropRowStyle : enabledPropRowStyle}>
          <div
            style={{display: 'flex', flexDirection: 'row'}}
            onClick={() => props.isLoggedIn && this.handleToggleBetInput(props.id)}
          >
            <div style={propItemStyle}>{props.choiceLabel}</div>
            <div style={propItemStyle}>{props.description}</div>
            <div style={propItemStyle}>{(props.line > 0 ? '+' : '') + props.line}</div>
          </div>
          {
            props.isAdmin
              ? <div style={markAsWonStyle} onClick={() => props.onAddWinningProp(props.id)}>
                  Mark as Won
                </div>
              : null

          }
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

const markAsWonStyle = {
  paddingLeft: '5px',
  cursor: 'pointer',
  color: '#22527b',
  fontSize: '10pt'
};

module.exports = ReadonlyPropGroup;

function formatInterestValue(interest) {
  return interest > 0
    ?  'Interest ' + interest + '%'
    : 'No interest';
}