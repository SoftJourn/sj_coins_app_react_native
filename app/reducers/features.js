/**
 * @flow
 */

'use strict';

import type {Action} from '../actions/types';

export type State = {
  features: Object;
};

const initialState = {
  features: {},
};

function features(state: State = initialState, action: Action): State {
  if (action.type === 'GET_FEATURES') {
    let features = action.features;
    //console.log('action.data PRODUCTS ', profile);
    return {
      ...state,
      features
    }
  }

  return state;
}

module.exports = features;
