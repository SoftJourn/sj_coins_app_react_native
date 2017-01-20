/**
 * @flow
 */

'use strict';

// Constants
//export const SELECT_REPO = 'SELECT_REPO';

export type Action =
    { type: 'PASSCODE', passcode: string} |
    { type: 'SET_API_URL', data: Object} |
    { type: 'SET_REMEMBER_ME', rememberMe: boolean} |
    { type: 'LOGIN_SUCCESS', data: Object} |
    { type: 'LOGGED_OUT' } |
    { type: 'SAVE_CREDENTIALS', username: string, password: string} |
    { type: 'SAVE_TOKEN', token: string} |
    { type: 'GET_PROJECTS', data: Object} |
    { type: 'GET_AUDITS', data: Object} |
    { type: 'SAVE_SURVEY', data: Object} |
    { type: 'GET_TEMPLATES', data: Object} |
    { type: 'GET_CATEGORIES', data: Object} |
    { type: 'GET_COMPANIES', data: Object} |
    { type: 'GET_PERSONNEL', data: Object} |
    { type: 'GET_STATUSES', data: Object} |
    { type: 'CHANGE_CONNECTION', connection: string} |
    { type: 'CACHE_AUDITS'} |
    { type: 'CACHE_TEMPLATES'} |
    { type: 'UPDATE_OFFLINE_AUDIT', offlineAudits: Object }|
    { type: 'SWITCH_TAB', tab: 'home' | 'favorites' | 'all-items' | 'profile' }
  ;

export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
