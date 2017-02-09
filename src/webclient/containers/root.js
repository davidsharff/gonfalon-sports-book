'use strict';
const React = require('react');
const {connect} = require('react-redux');
const autobind = require('autobind-decorator');
const socket = require('../socket');
const {ADD_PROP} = require('../../shared/action-types');
const {createRandomId} = require('../../shared/utils');

const {PropTypes} = React;
@connect((state) => ({
  liveProps: state.liveProps || []
}))
@autobind
class Root extends React.Component {
  static propTypes = {
    liveProps: PropTypes.arrayOf(PropTypes.object)
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
      <div style={rootContainerStyle}>
        <div>
          Welcome to the Gonfalon Sports Book!
        </div>
        <div>
          <div>
            <input
              type="text"
              value={this.state.newPropDescription}
              onChange={this.handleNewPropInput}
            />
            <button onClick={this.handleSubmitNewProp}>Add Prop</button>
          </div>
          <div>Current Props</div>
          {
            this.props.liveProps.map(({id, description}) =>
              <div key={id}>{description}</div>
            )
          }
        </div>
      </div>
    );
  }
}

module.exports = Root;

const rootContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif',
  fontWeight: '300'
};