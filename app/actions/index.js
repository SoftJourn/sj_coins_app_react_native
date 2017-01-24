/**
 * @flow
 */

'use strict';

const userActions = require('./user');
const deviceActions = require('./device');
const navigationAction = require('./navigation');
const profileAction = require('./profile');
const productsAction = require('./products');

module.exports = {
  ...userActions,
  ...deviceActions,
  ...navigationAction,
  ...profileAction,
  ...productsAction
};
