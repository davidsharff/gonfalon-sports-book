'use strict';
const React = require('react');
const {connect} = require('react-redux');
const autobind = require('autobind-decorator');
const _ = require('lodash');
const socket = require('../socket');
const AdminPropGroupControls = require('../components/admin-prop-group-controls');
const {ADD_PROP} = require('../../shared/action-types');
const utils = require('../../shared/utils');
const {propGroupOperators} = require('../../shared/constants');

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

  state = {
    newPropDescription: null
  }

  handleNewPropInput(e) {
    this.setState({
      newPropDescription: e.target.value
    });
  }

  handleSubmitNewProp(e) {
    e.preventDefault();
    if (this.state.newPropDescription) {
      socket.sendAction({
        type: ADD_PROP,
        payload: {
          id: utils.createRandomId(),
          description: this.state.newPropDescription
        }
      });
      this.setState({
        newPropDescription: null
      });
    }
  }

  render() {
    // TODO: newest first default sort.
    return (
      <div style={containerStyle}>
        {
          this.props.isAdmin
            ? <AdminPropGroupControls />
            : null
        }
        {
          this.props.propGroups.map((pg) =>
            <ReadonlyPropGroup
              key={pg.id}
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

module.exports = LiveProps;

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  padding: '10px'
};

class ReadonlyPropGroup extends React.Component {
  static propTypes = {
    operator: PropTypes.oneOf(_.values(propGroupOperators)).isRequired,
    interest: PropTypes.number.isRequired,
    includedProps: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      description: PropTypes.string,
      startingLine: PropTypes.number
    })).isRequired
  }

  render() {
    return (
      <div style={propGroupContainerStyle}>
        <div style={operatorStyle}>{this.props.operator}</div>
        <div style={interestStyle}>
          {
            this.props.interest > 0
              ?  'Interest ' + this.props.interest * 100 + '%'
              : 'No interest'
          }
        </div>
        {
          this.props.includedProps.map(({id, description, startingLine}) =>
            <div key={id} style={propRowStyle}>
              <div style={propItemStyle}>{utils.padLeft(id, '00', 3)}</div>
              <div style={propItemStyle}>{description}</div>
              <div style={propItemStyle}>{(startingLine > 0 ? '+' : '') + startingLine}</div>
            </div>
          )
        }
      </div>
    );
  }
}

const propGroupContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '20px'
};

const leftSpacing = '15px';
const topSpacing = '10px';

const propRowStyle = {
  display: 'flex',
  flexDirection: 'row',
  paddingLeft: leftSpacing,
  paddingTop: topSpacing
};

const propItemStyle = {
  marginRight: '10px'
};

const operatorStyle = {
  fontWeight: '400'
};

const interestStyle = {
  paddingLeft: leftSpacing,
  paddingTop: topSpacing,
  color: '#777'
};