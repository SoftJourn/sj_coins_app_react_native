/**
 * @flow
 */

'use strict';

import type {Action} from '../actions/types';

export type State = {
  isLoggedIn: ?boolean;
  access_token : ?string;
  token_type : ?string;
  refresh_token : ?string;
  expires_in : ?any;
  scope : ?string;
};

const initialState = {
  isLoggedIn: false,
  access_token : '',
  token_type : '',
  refresh_token : '',
  expires_in : 0,
  scope : ''
};

function user(state: State = initialState, action: Action): State {

  if (action.type === 'LOGIN_SUCCESS') {
    let data  = action.data;
    let {access_token, token_type, refresh_token, expires_in, scope} = data;
    //console.log('action.data ', data);
    return {
      ...state,
      isLoggedIn: true,
      access_token,
      token_type,
      refresh_token,
      expires_in,
      scope
    };
  }

  if (action.type === 'LOGGED_OUT') {
    console.log('LOGGED_OUT');
    return {
      ...state,
      isLoggedIn: false,
      access_token : '',
      token_type : '',
      refresh_token : '',
      expires_in : 0,
      scope : ''
    };
  }

  return state;
}

module.exports = user;
