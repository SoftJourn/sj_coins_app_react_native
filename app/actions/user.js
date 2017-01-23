/**
 * @flow
 */

'use strict';

import type { Action, ThunkAction, PromiseAction } from './types';

function login(username: string, password: string) : ThunkAction {
  return (dispatch, getState) => {
    let {connection} = getState().device;
    const login = new Promise((resolve, reject) => {
      if (connection.toLowerCase() === 'none') {
        reject(new Error('Sorry, You can\'t make request while you are offline'));
      } else {
        _apiRequestLogin(username, password, resolve, reject);
      }
    });

    login.then(
      (result) => {
        dispatch(loginSuccess(result));
      }, (fail) => {
      }
    );
    return login;
  };
}

function refreshToken() : ThunkAction {
  return (dispatch, getState) => {
    let {refresh_token} = getState().user;
    const refreshToken = new Promise((resolve, reject) => {

      if (!refresh_token) {
        let message = 'Can\'t refresh token. There is no saved refresh token';
        reject( new Error(message) );
      }
      _apiRequestRefreshToken(refresh_token, resolve, reject);
    });

    refreshToken.then(
      (result) => {
        dispatch(loginSuccess(result));
      }, (fail) => {
      }
    );
    return refreshToken;
  };
}

function logout(): ThunkAction {
  return (dispatch, getState) => {
    let {access_token, refresh_token} = getState().user;
    let {connection} = getState().device;
    const logoutPromise = new Promise((resolve, reject) => {
      if (connection.toLowerCase() === 'none' || connection.toLowerCase() === 'unknown') {
        reject(new Error('Sorry, You can\'t logout while you are offline'));
      } else {
        _apiRequestLogout(access_token, refresh_token, resolve, reject);
      }
    });

    logoutPromise.then(
      (result) => {
        dispatch(userLogOut());
      }, (fail) => {
        dispatch(userLogOut());
      }
    );
    return logoutPromise;
  };
}

async function _apiRequestLogin(username, password, resolve, reject) {
  var params = {
    'username': username,
    'password': password,
    'grant_type': 'password'
  };
  global.LOG(params);
  var formData = global.prepareFormData(params);

  try {
    let response = await fetch(`${global.BASE_URL}/auth/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic dXNlcl9jcmVkOnN1cGVyc2VjcmV0'
      },
      body: formData
    });
    //console.log(response);
    var responseJson = await response.json();
    console.log(responseJson);
    if (response.status == 200) {
      resolve(responseJson);
    } else {
      let message = !!responseJson.Message ? responseJson.error : 'Something went wrong';
      reject( new Error(message) );
    }

  } catch(error) {
    console.log(error);
    reject(error);
  }
}

async function _apiRequestRefreshToken(refresh_token, resolve, reject) {
  let params = {
    'refresh_token': refresh_token,
    'grant_type' : 'refresh_token'
  };
  let formData = global.prepareFormData(params);

  try {
    let response = await fetch(`${global.BASE_URL}/auth/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic dXNlcl9jcmVkOnN1cGVyc2VjcmV0'
      },
      body: formData
    });
    let responseJson = await response.json();
    console.log(responseJson);
    if (response.status == 200) {
      resolve(responseJson);
    } else {
      let message = !!responseJson.Message ? responseJson.error : 'Something went wrong';
      reject( new Error(message) );
    }

  } catch(error) {
    console.log(error);
    reject(error);
  }
}

async function _apiRequestLogout(access_token, refresh_token, resolve, reject) {
  let params = {
    token_value: refresh_token
  };
  let formData = global.prepareFormData(params);
  try {
    let response = await fetch(`${global.BASE_URL}/auth/oauth/token/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization' : `Bearer ${access_token}`
      },
      body: formData
    });
    console.log(response);

    if (response.status == 204) {
      resolve()
    } else {
      let responseJson = await response.json();
      console.log(responseJson);
      let message = !!responseJson.Message ? responseJson.error : 'Something went wrong';
      let error: Object = new Error(message);
      error.status = response.status;
      reject( error );
    }

  } catch(error) {
    console.log(error);
    reject(error);
  }
}


function loginSuccess(data: Object): ThunkAction {
  return (dispatch, getState) => {
    global.storage.save({
      key: 'userData',
      rawData: {
        userData: data
      }
    });

    return dispatch({
      type: 'LOGIN_SUCCESS',
      data
    })
  }
}

function userLogOut(): ThunkAction {
  return (dispatch, getState) => {

    global.LOG('user LOGOUT');

    global.storage.load({
      key: 'userData',
    }).then(userData => {
      //userData.data.token = null;
      global.storage.save({
        key: 'userData',
        rawData: {
          userData: null
        }
      });
    }).catch(err => {console.log(err.message)});

    return dispatch({
      type: 'LOGGED_OUT',
    });
  }

}

module.exports = { login, logout, refreshToken };
