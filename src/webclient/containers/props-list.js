'use strict';
const React = require('react');
const {connect} = require('react-redux');
const autobind = require('autobind-decorator');
const socket = require('../socket');
const AdminPropGroupControls = require('../components/admin-prop-group-controls');
const {ADD_PROP} = require('../../shared/action-types');
const {createRandomId} = require('../../shared/utils');

const {PropTypes} = React;
@connect(({app}) => ({
  propItems: app.propItems,
  isAdmin: true // TODO: will be based on auth in the future, and should have resulting actions verified.
}))
@autobind
class LiveProps extends React.Component {
  static propTypes = {
    propItems: PropTypes.arrayOf(PropTypes.object),
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
          id: createRandomId(),
          description: this.state.newPropDescription
        }
      });
      this.setState({
        newPropDescription: null
      });
    }
  }

  render() {
    return (
      <div style={containerStyle}>
        <div>Current Props</div>
        {
          this.props.isAdmin
            ? <AdminPropGroupControls />
            : null
        }
        {
          this.props.propItems.map(({id, description}) =>
            <div key={id}>{description}</div>
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