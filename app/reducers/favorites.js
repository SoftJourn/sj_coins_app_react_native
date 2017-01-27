/**
 * @flow
 */

'use strict';

import type {Action} from '../actions/types';

export type State = {
  favorites: Array<Object>;
};

const initialState = {
  favorites: [],
};

function favorites(state: State = initialState, action: Action): State {
  if (action.type === 'GET_FAVORITES') {
    let favorites = action.favorites;
    //console.log('action.data favorites ', favorites);
    return {
      ...state,
      favorites
    }
  }

  return state;
}

module.exports = favorites;
