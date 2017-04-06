'use strict';
const _ = require('lodash');
const moment = require('moment');
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

function getUserBubbleBalance(appState, username) {
  const user = _.find(appState.users, {username});
  return user
    ? user.startingBubbles -
      calcAllBubblesBetForUser(appState, username) +
      calcTotalWinningsForUser(appState, username) +
      calcTotalInterestPayments(appState, username)
    : null;
}

module.exports = {
  calcCurrentPropLine,
  getPropGroupLabel,
  getPropLabel,
  getWinningPropIdForGroup,
  getUserBubbleBalance,
  _exportsForTests: {
    calcTotalInterestPayments,
    calcTotalInterestForBet
  }
};

function calcAllBubblesBetForUser(appState, username) {
  return _(appState.bets)
    .filter({username})
    .sumBy('bubbles');
}

function calcTotalWinningsForUser(appState, username) {
  const allBetsForUser = _.filter(appState.bets, {username});
  return _.sumBy(appState.winningProps, (wp) =>
    // Note: users can have multiple bets for the same prop.
    _.sumBy(allBetsForUser, ({propId, bubbles, effectiveLine}) =>
      propId === wp.propId
        ? bubbles + calcProfitForBet(bubbles, effectiveLine)
        : 0
    )
  );
}

function calcProfitForBet(bubbles, effectiveLine) {
  return Math.round(
    effectiveLine > 0
      ? bubbles * (effectiveLine / 100)
      : bubbles / (Math.abs(effectiveLine) / 100)
  );
}

// TODO: add timestamp for winning prop records. Otherwise, we'll calc interest forever!
function calcTotalInterestPayments(appState, username) {
  const now = moment();
  return _.sumBy(appState.bets, (bet) =>
    bet.username === username
      ? calcTotalInterestForBet(
          bet.bubbles,
          _.find(appState.propGroups, {id: bet.propGroupId}).interest / 100,
          moment(bet.msTimeStamp, 'x'), // Convert to moment object
          now
        )
      : 0
  );
}

function calcTotalInterestForBet(bubblesWagered, interest, betMoment, calcAsOfMoment) {
  if (!interest || calcAsOfMoment.diff(betMoment) < 0) {
    return 0;
  }
  const interestPerDayValue = interest * 12 / 365; // Sorry astronomical reality, I want Christmas to come a day earlier every 16 years.
  return Math.round(bubblesWagered * interestPerDayValue * calcAsOfMoment.diff(betMoment, 'days'));
}