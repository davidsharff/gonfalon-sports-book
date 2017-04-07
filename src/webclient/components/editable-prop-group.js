'use strict';
const React = require('react');
const _ = require('lodash');
const autobind = require('autobind-decorator');
const {propGroupOperators} = require('../../shared/constants');
const utils = require('../../shared/utils');

const {PropTypes} = React;

@autobind
class EditablePropGroup extends React.Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel:  PropTypes.func.isRequired,
    propGroup: PropTypes.object
  }

  state = {
    operator: null,
    interest: 0,
    includedProps: []
  }

  componentDidMount() {
    if (this.props.propGroup) {
      const {operator, interest, includedProps} = this.props.propGroup;
      this.setState({
        operator,
        interest,
        includedProps
      });
    }
  }

  handleSave() {
    this.props.onSave(Object.assign({}, this.state, {
      interest: parseFloat(this.state.interest),
      includedProps: this.state.includedProps.map((p) =>
        Object.assign({}, p, {
          startingLine: parseInt(p.startingLine)
        })
      )
    }));
  }

  handleCancel() {
    this.props.onCancel();
  }

  handleOperatorChange(e) {
    this.setState({
      operator: e.target.value
    });
  }

  handleInterestChange(e) {
    // TODO: validation? Switch to list?
    this.setState({
      interest: e.target.value
    });
  }

  handlePropDescriptionChange(e, propIndex) {
    // TODO: make sure targeting w/ index won't bite us once deletes are supported.
    this.setState({
      includedProps: utils.updateItemAtIndex(this.state.includedProps, propIndex, {
        description: e.target.value
      })
    });
  }

  handleStartingLineChange(e, propIndex) {
    this.setState({
      includedProps: utils.updateItemAtIndex(this.state.includedProps, propIndex, {
        startingLine: e.target.value
      })
    });
  }

  handleAddNewProp() {
    this.setState({
      includedProps: [
        ...this.state.includedProps, {
          id: utils.createRandomId(),
          description: null,
          startingLine: 100
        }
      ]
    });
  }

  render() {
    return (
      <div style={containerStyle}>
        <div style={rowStyle}>
          <button onClick={this.handleSave} style={{marginRight: '5px'}}>Save</button>
          <button onClick={this.handleCancel}>Cancel</button>
        </div>
        <div style={labelAndInputStyle}>
          <div style={labelStyle}>Operator</div>
          <div>
            <select
              value={this.state.operator}
              onChange={this.handleOperatorChange}
            >
              <option />
              {
                _.map(_.values(propGroupOperators), (o) =>
                  <option key={o} value={o}>{o}</option>
                )
              }
            </select>
          </div>
        </div>
        <div style={labelAndInputStyle}>
          <div style={labelStyle}>Interest</div>
          <div style={rowStyle}>
            <input
              type="number"
              value={this.state.interest}
              onChange={this.handleInterestChange}
              style={interestInputStyle}
            />
            <div style={{marginLeft: '5px'}}>%</div>
          </div>
        </div>
        {
          this.state.includedProps.map(({description, startingLine}, index) =>
            <div style={labelAndInputStyle} key={index /* May bite us if we allow deletes*/}>
              <div style={labelStyle}>Prop {index + 1} Description</div>
              <textarea
                value={description}
                onChange={((e) => this.handlePropDescriptionChange(e, index))}
                style={propTextAreaStyle}
              />
              <div style={labelStyle}>Prop {index + 1} Starting Line</div>
              <input
                type="number"
                value={startingLine}
                onChange={(e) => this.handleStartingLineChange(e, index)}
                style={lineInputStyle}
              />
            </div>
          )
        }
        <button onClick={this.handleAddNewProp} style={newPropButtonStyle}>Add New Prop</button>
      </div>
    );
  }
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#fafafa'
};

const rowStyle = {
  display: 'flex',
  flexDirection: 'row'
};

const labelStyle = {
  marginBottom: '5px'
};

const labelAndInputStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '10px'
};

const propTextAreaStyle = {
  maxWidth: '450px',
  minWidth: '100px',
  height: '60px',
  marginBottom: '5px'
};

const interestInputStyle = {
  width: '40px'
};

const lineInputStyle = {
  width: '40px',
  marginBottom: '5px'
};

const newPropButtonStyle = {
  marginTop: '15px',
  maxWidth: '170px'
};

module.exports = EditablePropGroup;