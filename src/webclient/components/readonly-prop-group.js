'use strict';
const React = require('react');
const _ = require('lodash');
const autobind = require('autobind-decorator');
const moment = require('moment');
const PropBetInput = require('../components/prop-bet-input');
const {propGroupOperators, multipleChoiceLabels} = require('../../shared/constants');

const {PropTypes} = React;

// TODO: "ReadOnly" no longer a good name
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
      currentLine: PropTypes.number.isRequired,
      lineMovements: PropTypes.arrayOf(PropTypes.shape({
        delta: PropTypes.number.isRequired,
        msTimeStamp: PropTypes.string.isRequired
      }))
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
    return (
      <div style={propGroupContainerStyle}>
        <div style={groupLabelStyle}>
          <span>Group {this.props.groupNumber}</span>
          {
            this.props.isAdmin && !this.props.winningPropId
              ? <i
                  style={pencilIconStyle}
                  className="fa fa-pencil"
                  aria-hidden="true"
                  onClick={this.handleStartEdit}
                />
              : null
          }
        </div>
        <div style={operatorStyle}>{this.props.operator}</div>
        <div style={interestStyle}>{formatInterestValue(this.props.interest)}</div>
        {
          this.props.includedProps.map(({id: propId, description, currentLine, startingLine, lineMovements}, index) =>
            <IncludedProp
              key={propId}
              id={propId}
              description={description}
              isWinningProp={this.props.winningPropId === propId}
              hasWinningProp={!!this.props.winningPropId}
              currentLine={currentLine}
              startingLine={startingLine}
              lineMovements={lineMovements}
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
    currentLine: PropTypes.number.isRequired,
    startingLine: PropTypes.number.isRequired,
    lineMovements: PropTypes.arrayOf(PropTypes.shape({
      delta: PropTypes.number.isRequired,
      msTimeStamp: PropTypes.string.isRequired
    })),
    choiceLabel: PropTypes.string.isRequired,
    onPlaceBet: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    onAddWinningProp: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    userBubbleBalance: PropTypes.number
  }

  state = {
    isInputtingBet: false,
    isViewingLineMovement: false
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

  handleMarkAsWon(propId) { // TODO: why not read param from props?
    this.handleToggleBetInput();
    this.props.onAddWinningProp(propId);
  }

  handleToggleViewLineMovement() {
    // TODO: consolidate this and similiar checks into methods
    if (this.props.isAdmin || this.props.lineMovements.length) {
      this.setState({
        isViewingLineMovement: !this.state.isViewingLineMovement
      });
    }
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
        <div style={flexRowStyle}>
          <div style={props.isLoggedIn && !props.hasWinningProp ? enabledPropRowStyle : disabledPropRowStyle}>
            <div style={flexRowStyle} onClick={() => props.isLoggedIn && this.handleToggleBetInput(props.id)}>
              <div style={propItemStyle}>{props.choiceLabel}</div>
              <div style={propItemStyle}>{props.description}</div>
            </div>
            <div
              style={props.isAdmin || props.lineMovements.length ? expandableLineStyle : propItemStyle}
              onClick={this.handleToggleViewLineMovement}
            >
              {(props.currentLine > 0 ? '+' : '') + props.currentLine}
            </div>
          </div>
        </div>
        {
          this.state.isViewingLineMovement
            ? <div style={lineMovementContainerStyle}>
                <div style={{marginBottom: '4px'}}>
                  Opening line: {(props.startingLine > 0 ? '+' : '') + props.startingLine}
                </div>
                <div style={flexRowStyle}>
                  <div style={lineDeltaStyle}>Change</div>
                  <div style={lineTimeStampStyle}>Date</div>
                </div>
                {
                  props.lineMovements.map(({delta, msTimeStamp}) =>
                    <div style={lineMovementRowStyle} key={msTimeStamp}>
                      <div style={lineDeltaStyle}>
                        {
                          (delta > 0 ? '+' : '') + delta
                        }
                      </div>
                      <div style={lineTimeStampStyle}>{moment(msTimeStamp, 'x').format('M-D-YYYY')}</div>
                    </div>
                  )
                }
              </div>
            : null
        }
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

const flexRowStyle = {
  display: 'flex',
  flexDirection: 'row'
};

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
  marginTop: '5px',
  maxWidth: '170px'
};

const winningPropContainerStyle = Object.assign({}, basePropContainerStyle, {
  color: '#42c88a'
});

const losingPropContainerStyle = Object.assign({}, basePropContainerStyle, {
  color: '#aaa'
});

const pencilIconStyle = {
  paddingLeft: '15px'
};

const expandableLineStyle = Object.assign({}, propItemStyle, {
  textDecoration: 'underline',
  cursor: 'pointer'
});

const lineMovementContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginLeft: '33px',
  marginTop: '5px'
};

const lineMovementRowStyle = {
  display: 'flex',
  flexDirection: 'row'
};

const lineMovementItemStyle = {
  padding: '4px 2px 0 2px',
  textAlign: 'right',
  background: '#eee'
};

const lineDeltaStyle = Object.assign({}, lineMovementItemStyle, {
  width: '54px',
  paddingRight: '35px'
});

const lineTimeStampStyle = Object.assign({}, lineMovementItemStyle, {
  width: '75px'
});

module.exports = ReadonlyPropGroup;

function formatInterestValue(interest) {
  return interest > 0
    ?  'Interest ' + interest + '%'
    : 'No interest';
}