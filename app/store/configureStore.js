/**
 * @flow
 */

'use strict';

var {applyMiddleware, createStore} = require('redux');
var thunk = require('redux-thunk').default;
//var promise = require('./promise');
//var array = require('./array');
//var analytics = require('./analytics');
var reducers = require('../reducers');
var createLogger = require('redux-logger');
var {persistStore, autoRehydrate} = require('redux-persist');
var {AsyncStorage} = require('react-native');

var isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;

var logger = createLogger({
  predicate: (getState, action) => isDebuggingInChrome,
  collapsed: true,
  duration: true,
});

var createAppStore = applyMiddleware(thunk, logger)(createStore);

function configureStore(onComplete: ?() => void) {
  // TODO(frantic): reconsider usage of redux-persist, maybe add cache breaker
  const store = autoRehydrate()(createAppStore)(reducers);
  persistStore(store, {storage: AsyncStorage}, onComplete);
  if (isDebuggingInChrome) {
    window.store = store;
  }
  return store;
}

module.exports = configureStore;
