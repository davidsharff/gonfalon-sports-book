'use strict';

function createRandomId() {
  return Math.floor(Math.random() * 10000000000);
}

module.exports = {
  createRandomId
};