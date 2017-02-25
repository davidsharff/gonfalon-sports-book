'use strict';
const _ = require('lodash');

function getUsernameForUserId(state, userId) {
  return _.find(state.local.authUsers, {userId}).username;
}

module.exports = {
  getUsernameForUserId
};