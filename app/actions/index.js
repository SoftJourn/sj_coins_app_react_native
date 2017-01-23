/**
 * @flow
 */

'use strict';

const userActions = require('./user');
const deviceActions = require('./device');
const navigationAction = require('./navigation');
const profileAction = require('./profile');

module.exports = {
  ...userActions,
  ...deviceActions,
  ...navigationAction,
  ...profileAction
};
