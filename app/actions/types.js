/**
 * @flow
 */

'use strict';

// Constants
//export const SELECT_REPO = 'SELECT_REPO';

export type Action =
    { type: 'LOGIN_SUCCESS', data: Object} |
    { type: 'LOGGED_OUT' } |
    { type: 'CHANGE_CONNECTION', connection: string} |
    { type: 'SWITCH_TAB', tab: 'home' | 'favorites' | 'all-items' | 'profile' } |
    { type: 'GET_PROFILE', profile: Object } |
    { type: 'GET_PRODUCTS', products: Array<Object>} |
    { type: 'GET_FEATURES', features: Object} |
    { type: 'GET_FAVORITES', favorites: Array<Object>}
  ;

export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
