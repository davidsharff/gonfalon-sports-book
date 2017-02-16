'use strict';
const _ = require('lodash');

function calcCurrentPropLine(appState, propGroupId, propId) {
  const {includedProps} = _.find(appState.propGroups, {id: propGroupId});
  /*
      Logic goes here.
   */
  return _.find(includedProps, {id: propId}).startingLine;
}

module.exports = {calcCurrentPropLine};