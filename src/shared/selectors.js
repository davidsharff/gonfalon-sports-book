'use strict';
const _ = require('lodash');
const {multipleChoiceLabels} = require('./constants');

function calcCurrentPropLine(appState, propGroupId, propId) {
  const {includedProps} = _.find(appState.propGroups, {id: propGroupId});
  /*
      Logic goes here.
   */
  return _.find(includedProps, {id: propId}).startingLine;
}

function getPropGroupLabel(appState, propGroupId) {
  return 'Group ' + (appState.propGroups.length - _.findIndex(appState.propGroups, {id: propGroupId}));
}

function getPropLabel(appState, propGroupId, propId) {
  const {includedProps} = _.find(appState.propGroups, {id: propGroupId});
  return multipleChoiceLabels[_.findIndex(includedProps, {id: propId})];
}

module.exports = {
  calcCurrentPropLine,
  getPropGroupLabel,
  getPropLabel
};