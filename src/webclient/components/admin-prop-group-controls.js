'use strict';
const React = require('react');
const autobind = require('autobind-decorator');
const EditablePropGroup = require('./editable-prop-group');

const {PropTypes} = React;

@autobind
class AdminPropGroupControls extends React.Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired
  }

  state = {
    isAddingNewPropGroup: false
  }

  handleAddingNewPropGroup() {
    this.setState({
      isAddingNewLivePropGroup: true
    });
  }

  handleSavePropGroup(propGroup) {
    this.props.onSave(propGroup);
    this.setState({
      isAddingNewLivePropGroup: false
    });
  }

  handleCancelPropGroup() {
    this.setState({
      isAddingNewLivePropGroup: false
    });
  }

  render() {
    return (
      <div style={editableGroupContainerStyle}>
        {
          this.state.isAddingNewLivePropGroup
            ? <EditablePropGroup
                onSave={this.handleSavePropGroup}
                onCancel={this.handleCancelPropGroup}
              />
            : <button style={{marginBottom: '10px'}} onClick={this.handleAddingNewPropGroup}>Add New Group</button>
        }
      </div>
    );
  }
}

const editableGroupContainerStyle = {
  paddingBottom: '20px'
};

module.exports = AdminPropGroupControls;