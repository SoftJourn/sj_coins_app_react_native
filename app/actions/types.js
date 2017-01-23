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
    { type: 'GET_PROFILE', profile: Object }
  ;

export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
