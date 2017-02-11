'use strict';
const React = require('react');
const _ = require('lodash');
const autobind = require('autobind-decorator');
const {propGroupOperators} = require('../../shared/constants');

@autobind
class AdminPropGroupControls extends React.Component {

  state = {
    isAddingNewPropGroup: false
  }

  handleAddingNewPropGroup() {
    this.setState({
      isAddingNewLivePropGroup: true
    });
  }

  render() {
    return (
      <div>
        {
          this.state.isAddingNewLivePropGroup
            ? <AdminEditablePropGroup />
            : <button onClick={this.handleAddingNewPropGroup}>Add New Group</button>
        }
      </div>
    );
  }
}

module.exports = AdminPropGroupControls;

@autobind
class AdminEditablePropGroup extends React.Component {
  static propTypes = {
  }

  state = {
    groupOperator: null,
    interestValue: null,
    newProps: [{
      description: null,
      startingLine: null
    }]
  }

  handleOperatorChange(e) {
    this.setState({
      groupOperator: e.target.value
    });
  }

  handleInterestChange(e) {
    // TODO: validation? Switch to list?
    this.setState({
      interestValue: e.target.value
    });
  }

  handlePropDescriptionChange(e) {
    this.setState({
      newPropDescription: e.target.value
    });
  }

  render() {
    return (
      <div style={containerStyle}>
        <div style={rowStyle}>
          <div>Operator:&nbsp;</div>
          <select
            value={null}
            onChange={this.handleOperatorChange}
          >
            {
              _.map(_.values(propGroupOperators), (o) =>
                <option key={o} value={o}>{o}</option>
              )
            }
          </select>
        </div>
        <div style={rowStyle}>
          <div>Interest:&nbsp;</div>
          <input
            type="number"
            value={this.state.interestValue}
            onChange={this.handleInterestChange}
          />
          <span style={{marginLeft: '5px'}}>%</span>
        </div>
        <div style={propRowStyle}>
          <input
            type="text"
            value={this.state.propDescription}
            onChange={this.handleInterestChange}
          />
          <div>Starting Line:</div>
        </div>
        <div>Add New Prop</div>
      </div>
    );
  }
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  padding: '10px'
};

const rowStyle = {
  display: 'flex',
  flexDirection: 'row'
};

const propRowStyle = {
  display: 'flex',
  flexDirection: 'row',
  paddingTop: '5px',
  marginLeft: '5px'
};