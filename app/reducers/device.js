/**
 * @flow
 */

'use strict';

import type {Action} from '../actions/types';

export type State = {
  connection: ?string;
};

const initialState = {
  connection: '',
};

function device(state: State = initialState, action: Action): State {
  if (action.type === 'CHANGE_CONNECTION') {
    let connection = action.connection;
    console.log('action.data CHANGE_CONNECTION ', connection);
    return {
      ...state,
      connection
    }
  }

  return state;
}

module.exports = device;
