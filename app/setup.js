/**
 * @flow
 */

import React, { Component } from 'react';
import { Alert, AsyncStorage} from 'react-native';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
const App = require('./App');
import Storage from 'react-native-storage'; // persistent storage

export default class Root extends React.Component {

  state: {
    isLoading?: any,
    store? : any
  };

  constructor() {
    super();

    console.disableYellowBox = true;
    this.state = {
      isLoading: true,
      store: configureStore(() => this.setState({isLoading: false})),
    };
  }

  render() {
    return (
      <Provider store={this.state.store}>
          <App />
      </Provider>
    );
  }
}

const config = {
  test: 'https://vending.softjourn.if.ua/api',
  prod: ''
};
global.BASE_URL = config.test;

global.alert = (title, message) => {
  Alert.alert(title, message);
};

global.alertWithCallback = (title, message, callback) => {
  Alert.alert(title, message, [
    {text: 'Ok', onPress: callback},
  ]);
};

global.alertWithPromt = (title, message, confirmAction, dismissAction) => {
  Alert.alert(title, message, [
    {text: 'No', onPress: dismissAction},
    {text: 'Yes', onPress: confirmAction},
  ]);
};

global.alertWithPromtAndButtons = (title, message, confirmTitle, dismissTitle, confirmAction, dismissAction) => {
  Alert.alert(title, message, [
    {text: dismissTitle, onPress: dismissAction},
    {text: confirmTitle, onPress: confirmAction},
  ]);
};

global.LOG = (...args) => {
  console.log('/------------------------------\\');
  console.log(...args);
  console.log('\\------------------------------/');
  return args[args.length - 1];
};

global.timeout = async (ms: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    let error: Object = new Error('Request Timed Out. Try again');
    error.status = 408;
    setTimeout(() => reject(error), ms);
  });
};

const storage = new Storage({

  size: 1000, // maximum capacity, default 1000
  storageBackend: AsyncStorage,

  // expire time, default 1 day(1000 * 3600 * 24 milliseconds), can be null, which means never expire.
  defaultExpires: null,
  enableCache: true,

  // if data was not found in storage or expired,
  // the corresponding sync method will be invoked and return
  // the latest data.
  sync : {
    // we'll talk about the details later.
  }
});
global.storage = storage;
