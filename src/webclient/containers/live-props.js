'use strict';
const React = require('react');
const {connect} = require('react-redux');
const autobind = require('autobind-decorator');
const socket = require('../socket');
const LiveProp = require('../components/live-prop');
const {ADD_PROP} = require('../../shared/action-types');
const {createRandomId} = require('../../shared/utils');

const {PropTypes} = React;
@connect(({app}) => ({
  liveProps: app.liveProps
}))
@autobind
class LiveProps extends React.Component {
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
      <div style={containerStyle}>
        <div>Current Props</div>
        <div>
          <input
            type="text"
            value={this.state.newPropDescription}
            onChange={this.handleNewPropInput}
          />
          <button onClick={this.handleSubmitNewProp}>Add Prop</button>
        </div>
        {
          this.props.liveProps.map(({id, description}) =>
            <LiveProp key={id} description={description} />
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