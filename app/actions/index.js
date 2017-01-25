/**
 * @flow
 */

'use strict';

const userActions = require('./user');
const deviceActions = require('./device');
const navigationAction = require('./navigation');
const profileAction = require('./profile');
const productsAction = require('./products');
const featuresAction = require('./features');

module.exports = {
  ...userActions,
  ...deviceActions,
  ...navigationAction,
  ...profileAction,
  ...productsAction,
  ...featuresAction
};
