'use strict';
const React = require('react');
const {connect} = require('react-redux');
const autobind = require('autobind-decorator');
const _ = require('lodash');
const socket = require('../socket');
const AdminPropGroupControls = require('../components/admin-prop-group-controls');
const {ADD_NEW_PROP_GROUP} = require('../../shared/action-types');
const utils = require('../../shared/utils');
const {propGroupOperators, multipleChoiceLabels} = require('../../shared/constants');

const {PropTypes} = React;
@connect(({app}) => ({
  propGroups: app.propGroups,
  isAdmin: true // TODO: will be based on auth in the future, and should have resulting actions verified.
}))
@autobind
class LiveProps extends React.Component {
  static propTypes = {
    propGroups: PropTypes.arrayOf(PropTypes.object),
    isAdmin: PropTypes.bool
  }

  handleSavePropGroup(propGroup) {
    socket.sendAction({
      type: ADD_NEW_PROP_GROUP,
      payload: Object.assign({}, propGroup, {
        id: utils.createRandomId()
      })
    });
  }

  render() {
    // TODO: newest first default sort.
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
            groupNumber={this.props.propGroups.length - i}
            operator={pg.operator}
            interest={pg.interest}
            includedProps={pg.includedProps}
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

module.exports = LiveProps;

class ReadonlyPropGroup extends React.Component {
  static propTypes = {
    groupNumber: PropTypes.number.isRequired,
    operator: PropTypes.oneOf(_.values(propGroupOperators)).isRequired,
    interest: PropTypes.number.isRequired,
    includedProps: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      description: PropTypes.string,
      startingLine: PropTypes.number
    })).isRequired
  }

  render() {
    // TODO: use selector to get line value
    return (
      <div style={propGroupContainerStyle}>
        <div style={groupLabelStyle}>Group {this.props.groupNumber}</div>
        <div style={interestStyle}>{formatInterestValue(this.props.interest)}</div>
        <div style={operatorStyle}>{this.props.operator}</div>
        {
          this.props.includedProps.map(({id, description, startingLine}, index) =>
            <div key={id} style={propRowStyle}>
              <div style={propItemStyle}>{multipleChoiceLabels[index]})</div>
              <div style={propItemStyle}>{description}</div>
              <div style={propItemStyle}>{(startingLine > 0 ? '+' : '') + startingLine}</div>
            </div>
          )
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

const propRowStyle = {
  display: 'flex',
  flexDirection: 'row',
  paddingTop: topSpacing,
  paddingLeft: '15px'
};

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

function formatInterestValue(interest) {
  return interest > 0
    ?  'Interest ' + interest * 100 + '%'
    : 'No interest';
}