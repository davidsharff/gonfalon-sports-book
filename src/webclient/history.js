'use strict';

const {createHistory, useQueries} = require('history');
const history = useQueries(createHistory)();
module.exports = history;