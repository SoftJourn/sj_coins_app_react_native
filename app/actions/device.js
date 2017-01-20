/**
 * @flow
 */

'use strict';

import type { Action, ThunkAction, PromiseAction } from './types';
//var GLOBAL = require('./../Globals');

function changeConnection(connection: string): Action {
  return {
    type: 'CHANGE_CONNECTION',
    connection,
  };
}

module.exports = { changeConnection };
