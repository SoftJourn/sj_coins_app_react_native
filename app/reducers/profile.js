/**
 * @flow
 */

'use strict';

import type {Action} from '../actions/types';

export type State = {
  profile: ?Object;
};

const initialState = {
  profile: {},
};

function profile(state: State = initialState, action: Action): State {
  if (action.type === 'GET_PROFILE') {
    let profile = action.profile;
    //console.log('action.data PROFILE ', profile);
    return {
      ...state,
      profile
    }
  }

  return state;
}

module.exports = profile;
