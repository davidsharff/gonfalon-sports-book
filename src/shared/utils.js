'use strict';

function createRandomId() {
  return Math.floor(Math.random() * 10000000000);
}

function padLeft(baseString, padString, maxLength) {
  const paddedString = padString + baseString;
  return paddedString.slice(-maxLength);
}

module.exports = {
  createRandomId,
  padLeft
};