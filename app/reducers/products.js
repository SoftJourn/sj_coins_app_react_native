/**
 * @flow
 */

'use strict';

import type {Action} from '../actions/types';

export type State = {
  products: Array<Object>;
};

// "id" : 0,
//   "price" : 5,
//   "name" : "COLA",
//   "imageUrl" : "/image.jpg",
//   "description" : "Cola with coca.",
//   "category" : {
//   "id" : 1,
//     "name" : "Drink"


const initialState = {
  products: [{}],
};

function products(state: State = initialState, action: Action): State {
  if (action.type === 'GET_PRODUCTS') {
    let products = action.products;
    //console.log('action.data PRODUCTS ', profile);
    return {
      ...state,
      products
    }
  }

  return state;
}

module.exports = products;
