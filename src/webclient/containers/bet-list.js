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
  username: auth.getUsername(),
  bets: app.bets.map((b) =>
    Object.assign({}, b, {
      propGroupLabel: getPropGroupLabel(app, b.propGroupId),
      propLabel: getPropLabel(app, b.propGroupId, b.propId)
    })
  )
}))

class BetList extends React.Component {
  static propTypes = {
    username: PropTypes.string,
    bets: PropTypes.arrayOf(PropTypes.shape({
      bubbles: PropTypes.number.isRequired,
      propId: PropTypes.number.isRequired,
      propLabel: PropTypes.string.isRequired,
      propGroupId: PropTypes.number.isRequired,
      propGroupLabel: PropTypes.string.isRequired,
      effectiveLine: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
      msTimeStamp: PropTypes.string.isRequired
    }))
  }

  render() {
    // TODO: settle on moment format for display and move to constants.
    return (
      <div style={containerStyle}>
        <div style={rowStyle}>
          <div style={headerCellStyle}>User</div>
          <div style={rightAlignedHeaderStyle}>Bubbles</div>
          <div style={rightAlignedHeaderStyle}>Prop Group</div>
          <div style={rightAlignedHeaderStyle}>Prop Label</div>
          <div style={rightAlignedHeaderStyle}>Effective Line</div>
          <div style={rightAlignedHeaderStyle}>Date</div>
        </div>
        {
          this.props.bets.map((bet, i) =>
            <div key={bet.msTimeStamp + i/*Legacy bets have identical stamp because of site epoch*/}
                 style={i % 2 === 0 ? rowStyle : oddRowStyle}
            >
              <div style={bet.username === this.props.username ? usernameCellStyle : cellStyle}>
                {bet.username}
              </div>
              <div style={rightAlignedCellStyle}>{bet.bubbles}</div>
              <div style={rightAlignedCellStyle}>{bet.propGroupLabel}</div>
              <div style={rightAlignedCellStyle}>{bet.propLabel}</div>
              <div style={rightAlignedCellStyle}>{bet.effectiveLine}</div>
              <div style={rightAlignedCellStyle}>
                {
                  bet.msTimeStamp === '1488653041267'
                    ? 'Legacy Bet'
                    : moment(bet.msTimeStamp, 'x').format('YYYY-MM-DD')
                }
                </div>
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
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  flex: 1
};

const usernameCellStyle = Object.assign({}, cellStyle, {
  fontStyle: 'italic'
});

const rightAlignedCellStyle = Object.assign({}, cellStyle, {
  textAlign: 'right'
});

const headerCellStyle = Object.assign({}, cellStyle, {
  fontWeight: '400'
});

const rightAlignedHeaderStyle = Object.assign({}, headerCellStyle, rightAlignedCellStyle);

module.exports = BetList;