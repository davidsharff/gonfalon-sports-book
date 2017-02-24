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


function getWinningPropIdForGroup(appState, propGroupId) {
  if (_.filter(appState.winningProps, {propGroupId}).length > 2) {
    throw new Error(`Found multiple winning props for group: ${propGroupId}`);
  }
  const winningPropRecord = _.find(appState.winningProps, {propGroupId});
  return winningPropRecord ? winningPropRecord.propId : null;
}

function getUserBubbleBalance(appState, email) { // TODO: change to userId since we don't know if it will be email/twitter/etc.
  const user = _.find(appState.users, {email});
  return user
    ? user.startingBubbles - getUserTotalBets(appState, email)
    : null;
}

module.exports = {
  calcCurrentPropLine,
  getPropGroupLabel,
  getPropLabel,
  getWinningPropIdForGroup,
  getUserBubbleBalance
};

function getUserTotalBets(appState, email) {
  return _(appState.bets)
    .filter({email})
    .sumBy('bubbles');
}