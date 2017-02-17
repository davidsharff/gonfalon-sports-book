'use strict';
const _ = require('lodash');

function getEmailForUserId(state, userId) {
  return _.find(state.local.authUsers, {userId}).email;
}

module.exports = {
  getEmailForUserId
};