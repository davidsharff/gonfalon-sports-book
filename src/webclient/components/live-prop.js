'use strict';
const React = require('react');

const {PropTypes} = React;
class LiveProp extends React.Component {
  static propTypes = {
    description: PropTypes.string
  }

  render() {
    return (
      <div>{this.props.description}</div>
    );
  }
}

module.exports = LiveProp;