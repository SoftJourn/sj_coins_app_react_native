/**
 * @flow
 */

'use strict';

import type { Action, ThunkAction, PromiseAction } from './types';

function getProducts() : ThunkAction {
  return (dispatch, getState) => {
    let {connection} = getState().device;
    let {access_token} = getState().user;
    const getProducts = new Promise((resolve, reject) => {
      if (connection.toLowerCase() === 'none') {
        reject(new Error('Sorry, You can\'t make request while you are offline'));
      } else {
        _apiRequestGetProducts(access_token, resolve, reject);
      }
    });

    getProducts.then(
      (result) => {
        dispatch(getProductsSuccess(result));
      }, (fail) => {
      }
    );
    return getProducts;
  };
}

async function _apiRequestGetProducts(access_token, resolve, reject) {

  try {
    let response = await fetch(`${global.BASE_URL}/vending/v1/machines/9/products`, {
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

function getProductsSuccess(products: Array<Objects>): Action {
  return {
    type: 'GET_PRODUCTS',
    products
  }
}


module.exports = { getProducts };
