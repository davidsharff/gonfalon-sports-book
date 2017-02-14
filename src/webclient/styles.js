'use strict';
const baseLink = {
  textDecoration: 'none'
};

module.exports = {
  linkActive: Object.assign({}, baseLink, {
    color: '#22527b',
    cursor: 'pointer'
  }),
  linkDisabled:  Object.assign({}, baseLink, {
    cursor: 'default',
    color: '#aaa'
  })
};