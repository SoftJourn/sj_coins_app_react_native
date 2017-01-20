/**
 * @flow
 */

'use strict';

import type {Action} from '../actions/types';

export type State = {
  passcode: ?string;
  APIURL: ?string;
  isLoggedIn: ?boolean;
  //rememberMe: ?boolean;
  token: ?string;
  username: ?string;
  password: ?string;
  UserId: ?string;
  UserName: ?string;
  LinkedItemId: ?string;
};

const initialState = {
  isLoggedIn: false,
  passcode: '',
  APIURL: '',
  //rememberMe: true,
  token: '',
  username: '',
  password:  '',
  UserId: '',
  UserName: '',
  LinkedItemId: ''
};

function user(state: State = initialState, action: Action): State {

  if (action.type === 'PASSCODE') {
    let passcode  = action.passcode;
    console.log('action.data ',passcode);
    return {
      ...state,
      passcode,
    };
  }

  if (action.type === 'SET_API_URL') {
    let APIURL  = action.data.APIURL;
    console.log('action.data ', APIURL);
    return {
      ...state,
      APIURL,
    };
  }

  // if (action.type === 'SET_REMEMBER_ME') {
  //   let rememberMe  = action.rememberMe;
  //   console.log('action.data ', rememberMe);
  //   return {
  //     ...state,
  //     rememberMe,
  //   };
  // }

  if (action.type === 'LOGIN_SUCCESS') {
    let data  = action.data;
    let {UserId, UserName, LinkedItemId } = data;
    console.log('action.data ', data);
    return {
      ...state,
      token: data.token,
      isLoggedIn: true,
      UserId,
      UserName,
      LinkedItemId
    };
  }

  if (action.type === 'LOGGED_OUT') {
    return {
      ...state,
      token: '',
      isLoggedIn: false,
      //rememberMe: false,
      UserId: '',
      UserName: '',
      LinkedItemId: ''
    };
  }

  if (action.type === 'SAVE_TOKEN') {
    let token  = action.token;
    console.log('action.data ', token);
    return {
      ...state,
      token,
    };
  }

  if (action.type === 'SAVE_CREDENTIALS') {
    let {username, password}  = action;
    console.log('action.data ', username, password);
    return {
      ...state,
      username,
      password
    };
  }

  return state;
}

module.exports = user;
