'use strict';

function createRandomId() {
  return Math.floor(Math.random() * 10000000000);
}

function updateItemAtIndex(array, index, updateObject) {
  return array.map((p, i) =>
      i === index
        ? Object.assign({}, p, updateObject) // TODO: it should throw if given a key not in target object.
        : p
  );
}

module.exports = {
  createRandomId,
  updateItemAtIndex
};