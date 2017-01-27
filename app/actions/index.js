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
const favoritesAction = require('./favorites');

module.exports = {
  ...userActions,
  ...deviceActions,
  ...navigationAction,
  ...profileAction,
  ...productsAction,
  ...featuresAction,
  ...favoritesAction
};
