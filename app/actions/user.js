/**
 * @flow
 */

'use strict';

import type { Action, ThunkAction, PromiseAction } from './types';

function login(username: string, password: string) : ThunkAction {
  return (dispatch, getState) => {
    //let {APIURL, rememberMe} = getState().user;
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
        //result.rememberMe = rememberMe;
        //dispatch(saveAuthToken(result.token))
        //dispatch(saveUserCredentials(username, password));
        dispatch(loginSuccess(result));
      }, (fail) => {
      }
    );
    return login;
  };
}

function autoLogin() : ThunkAction {
  return (dispatch, getState) => {
    let {APIURL, rememberMe, username, password} = getState().user;
    const autoLogin = new Promise((resolve, reject) => {

      if (!username || !password) {
        let message = 'Can\'t make auto login. There are no saved user credentials';
        reject( new Error(message) );
      }
      _apiRequestLogin(username, password, APIURL, resolve, reject);
    });

    autoLogin.then(
      (result) => {
        result.rememberMe = true;
        dispatch(loginSuccess(result));
      }, (fail) => {
      }
    );
    return autoLogin;
  };
}

function logout(): ThunkAction {
  return (dispatch, getState) => {
    let {APIURL, token} = getState().user;
    let {connection} = getState().device;
    const logoutPromise = new Promise((resolve, reject) => {
      if (connection.toLowerCase() === 'none' || connection.toLowerCase() === 'unknown') {
        reject(new Error('Sorry, You can\'t logout while you are offline'));
      } else {
        _apiRequestLogout(APIURL, token, resolve, reject);
      }
    });

    logoutPromise.then(
      (result) => {
        dispatch(userLogOut());
      }, (fail) => {
      }
    );
    return logoutPromise;
  };
}

async function _apiRequestPasscode(passcode, resolve, reject) {
  var params = {
    'SiteAccessToken': passcode,
  };
  var formData = prepareFromData(params);

  try {
    let response = await fetch(`${global.BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });
    var responseJson = await response.json();
    console.log(responseJson);
    if (response.status == 200) {
       resolve(responseJson);
    } else {
      let message = !!responseJson.Message ? responseJson.Message : 'Something went wrong';
      reject( new Error(message) );
    }

  } catch(error) {
    console.error(error);
    reject(error);
  }
}

async function _apiRequestLogin(username, password, resolve, reject) {
  var params = {
    'username': username,
    'password': password,
    'grant_type': 'password'
  };

  global.LOG(params);
  var formData = prepareFromData(params);

  try {
    let response = await fetch(`${global.BASE_URL}/auth/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic dXNlcl9jcmVkOnN1cGVyc2VjcmV0'
      },
      body: formData
    });
    console.log(response);
    var responseJson = await response.json();
    console.log(responseJson);
    if (response.status == 200) {
      resolve(responseJson);

    } else {
      let message = !!responseJson.Message ? responseJson.Message : 'Something went wrong';
      reject( new Error(message) );
    }

  } catch(error) {
    console.error(error);
    reject(error);
  }
}

async function _apiRequestLogout(url, token, resolve, reject) {
  try {
    let response = await fetch(`${url}/Authorize`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        '.ASPXAUTH' : token
      }
    });
    var responseJson = await response.json();
    console.log(responseJson);
    if (response.status == 200) {
      resolve(responseJson)
    } else {
      let message = !!responseJson.Message ? responseJson.Message : 'Something went wrong';
      let error: Object = new Error(message);
      error.status = response.status;
      reject( error );
    }

  } catch(error) {
    console.error(error);
    reject(error);
  }
}

function prepareFromData(params) {
  var formBody = [];
  for (var property in params) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(params[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }

  return formBody.join("&");
}

function setRememberMe(rememberMe: boolean): Action {
  return {
    type: 'SET_REMEMBER_ME',
    rememberMe
  }
}

function loginSuccess(data: Object): ThunkAction {
  return (dispatch, getState) => {
    global.storage.save({
      key: 'userData',
      rawData: {
        data: data
      }
    });

    return dispatch({
      type: 'LOGIN_SUCCESS',
      data
    })
  }
}

function saveAuthToken(token: string): Action {
  return {
    type: 'SAVE_TOKEN',
    token
  }
}

function saveUserCredentials(username: string, password: string): Action {
  return {
    type: 'SAVE_CREDENTIALS',
    username,
    password
  }
}

function userLogOut(): ThunkAction {
  return (dispatch, getState) => {

    global.storage.load({
      key: 'userData',
    }).then(userData => {
      userData.data.token = null;
      //userData.data.rememberMe = false;
      global.storage.save({
        key: 'userData',
        rawData: {
          data: userData.data
        }
      });
    }).catch(err => {console.log(err.message)});

    //dispatch(setRememberMe(false));

    return {
      type: 'LOGGED_OUT',
    }
  }

}

module.exports = { setRememberMe, login, logout, autoLogin };
