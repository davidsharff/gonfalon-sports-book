'use strict';

const React = require('react');
const autobind = require('autobind-decorator');

const {PropTypes} = React;

@autobind
class PropBetInput extends React.Component {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    onPlaceBet: PropTypes.func.isRequired,
    currentBubbleBalance: PropTypes.number.isRequired,
    alignmentStyle: PropTypes.object
  };

  state = {
    bubbleInputValue: null
  }

  handleBubbleInput(e) {
    this.setState({
      bubbleInputValue: e.target.value
    });
  }

  render() {
    const containerStyle = Object.assign({}, baseContainerStyle, this.props.alignmentStyle);
    return (
      <div style={containerStyle}>
        <div style={rowContainerStyle}>
          <input type="number" onChange={this.handleBubbleInput} placeholder="bubbles" />
          <div style={balanceLabelStyle}>Balance: {this.props.currentBubbleBalance} bubbles</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <button onClick={this.props.onPlaceBet}>Place Bet</button>
          <button onClick={this.props.onCancel} style={{marginLeft: '5px'}}>Cancel</button>
        </div>
      </div>
    );
  }
}

module.exports = PropBetInput;

const baseContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '380px'
};

const rowContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  paddingTop: '10px',
  paddingBottom: '5px',
  alignItems: 'flex-end'
};

const balanceLabelStyle = {
  fontSize: '10pt',
  color: '#aaa',
  marginLeft: '5px'
};