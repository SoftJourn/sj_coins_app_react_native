/**
 * @flow
 */

'use strict';

var { combineReducers } = require('redux');

module.exports = combineReducers({
  user: require('./user'),
  device: require('./device'),
  navigation: require('./navigation'),
});
