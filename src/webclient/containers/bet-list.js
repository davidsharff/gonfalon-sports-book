'use strict';
const React = require('react');
const {connect} = require('react-redux');
const moment = require('moment');
const {
  getPropGroupLabel,
  getPropLabel
} = require('../../shared/selectors');

const {PropTypes} = React;

@connect(({app}, {route: {auth}}) => ({
  email: auth.getEmail(),
  bets: app.bets.map((b) =>
    Object.assign({}, b, {
      propGroupLabel: getPropGroupLabel(app, b.propGroupId),
      propLabel: getPropLabel(app, b.propGroupId, b.propId)
    })
  )
}))

class BetList extends React.Component {
  static propTypes = {
    email: PropTypes.string,
    bets: PropTypes.arrayOf(PropTypes.shape({
      bubbles: PropTypes.number.isRequired,
      propId: PropTypes.number.isRequired,
      propLabel: PropTypes.string.isRequired,
      propGroupId: PropTypes.number.isRequired,
      propGroupLabel: PropTypes.string.isRequired,
      effectiveLine: PropTypes.number.isRequired,
      email: PropTypes.string.isRequired,
      msTimeStamp: PropTypes.string.isRequired
    }))
  }

  render() {
    // TODO: settle on moment format for display and move to constants.
    return (
      <div style={containerStyle}>
        <div style={rowStyle}>
          <div style={headerCellStyle}>User</div>
          <div style={headerCellStyle}>Bubbles</div>
          <div style={headerCellStyle}>Prop Group</div>
          <div style={headerCellStyle}>Prop Label</div>
          <div style={headerCellStyle}>Effective Line</div>
          <div style={headerCellStyle}>Date/Time</div>
        </div>
        {
          this.props.bets.map((bet, i) =>
            <div key={bet.msTimeStamp} style={i % 2 === 0 ? rowStyle : oddRowStyle}>
              <div style={bet.email === this.props.email ? userEmailCellStyle : cellStyle}>
                {bet.email}
              </div>
              <div style={cellStyle}>{bet.bubbles}</div>
              <div style={cellStyle}>{bet.propGroupLabel}</div>
              <div style={cellStyle}>{bet.propLabel}</div>
              <div style={cellStyle}>{bet.effectiveLine}</div>
              <div style={cellStyle}>{moment(bet.msTimeStamp, 'x').format('YYYY-MM-DD hh:mm')}</div>
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
  padding: '20px'
};

const rowStyle = {
  display: 'flex',
  flexDirection: 'row',
  paddingTop: '5px',
  paddingBottom: '5px'
};

const oddRowStyle = Object.assign({}, rowStyle, {
  backgroundColor: '#eee'
});

const cellStyle = {
  width: '300px'
};

const userEmailCellStyle = Object.assign({}, cellStyle, {
  color: '#42f480'
});

const headerCellStyle = Object.assign({}, cellStyle, {
  fontWeight: '400'
});

module.exports = BetList;