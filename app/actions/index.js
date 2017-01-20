/**
 * @flow
 */

'use strict';

const userActions = require('./user');
const deviceActions = require('./device');
const navigationAction = require('./navigation');


module.exports = {
  ...userActions,
  ...deviceActions,
  ...navigationAction,
};
