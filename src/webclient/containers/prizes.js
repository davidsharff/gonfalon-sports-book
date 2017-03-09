'use strict';
const React = require('react');
const {connect} = require('react-redux');
const {PropTypes} = React;

@connect(({app: {prizes}}) => ({
  prizes
}))
class Prizes extends React.Component {
  static propTypes = {
    prizes: PropTypes.arrayOf(PropTypes.shape({
      tier: PropTypes.number,
      label: PropTypes.string
    }))
  }

  render() {
    return (
      <div style={containerStyle}>
        {
          this.props.prizes.map(({label, tier}, index) =>
            <div key={index} style={rowStyle}>
              <div style={tierCellStyle}>{tier}</div>
              <div>{label}</div>
            </div>
          )
        }
      </div>
    );
  }
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '20px'
};

const tierCellStyle = {
  paddingRight: '10px'
};

const rowStyle = {
  display: 'flex',
  flexDirection: 'row',
  paddingTop: '5px',
  paddingBottom: '5px'
};

module.exports = Prizes;