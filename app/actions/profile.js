/**
 * @flow
 */

'use strict';

import type { Action, ThunkAction, PromiseAction } from './types';

function getProfile() : ThunkAction {
  return (dispatch, getState) => {
    let {connection} = getState().device;
    let {access_token} = getState().user;
    const getProfile = new Promise((resolve, reject) => {
      if (connection.toLowerCase() === 'none') {
        reject(new Error('Sorry, You can\'t make request while you are offline'));
      } else {
        _apiRequestGetProfile(access_token, resolve, reject);
      }
    });

    getProfile.then(
      (result) => {
        dispatch(getProfileSuccess(result));
      }, (fail) => {
      }
    );
    return getProfile;
  };
}

async function _apiRequestGetProfile(access_token, resolve, reject) {

  try {
    let response = await fetch(`${global.BASE_URL}/coins/api/v1/account`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${access_token}`
      }
    });
    //console.log(response);
    var responseJson = await response.json();
    console.log(responseJson);
    if (response.status == 200) {
      resolve(responseJson);
    } else {
      let message = !!responseJson.error ? responseJson.error : 'Something went wrong';
      let error: Object = new Error(message);
      error.status = response.status;
      reject( error );
    }

  } catch(error) {
    console.log(error);
    reject(error);
  }
}

function getProfileSuccess(profile: Object): Action {
  return {
    type: 'GET_PROFILE',
    profile
  }
}


module.exports = { getProfile };
