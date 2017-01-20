/**
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Platform,
  Navigator,
  NetInfo,
  BackAndroid,
  Alert,
  StatusBar
} from 'react-native';

var { connect } = require('react-redux');
var {changeConnection} = require('./actions');

var LoginComponent = require('./components/Login');
var TabsView = require('./components/TabsView');

import Style from "./Style";

class AppNavigator extends Component {
  state: {
    initialRoute: Object;
  };

  props: {
  };

  _handlers: [() => boolean];
  navigator: Navigator;

  constructor() {
    super();
    this._handlers = [];
    this.state = { isIOS : Platform.OS === 'ios', initialRoute: {passcode: false} };
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));

    global.storage.load({
      key: 'userData',
    }).then(userData => {

      if (this.navigator) {
        if (!!userData.data.token) {
          this.navigator.immediatelyResetRouteStack([{
            dashboard: true,
            token: userData.data.token,
          }]);
        } else if (!!userData.data.url) {
          this.navigator.immediatelyResetRouteStack([{login: true}])
        }

      }
    }).catch(err => {
      console.log(err.message);

      if (this.navigator) {
        this.navigator.immediatelyResetRouteStack([{login: true}])
      }
    });
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
  }

  getChildContext() {
    return {
      addBackButtonListener: this.addBackButtonListener.bind(this),
      removeBackButtonListener: this.removeBackButtonListener.bind(this),
    };
  }

  addBackButtonListener(listener) {
    this._handlers.push(listener);
  }

  removeBackButtonListener(listener) {
    this._handlers = this._handlers.filter((handler) => handler !== listener);
  }

  handleBackButton() {

    for (let i = this._handlers.length - 1; i >= 0; i--) {
      if (this._handlers[i]()) {
        return true;
      }
    }

    if (this.navigator && this.navigator.getCurrentRoutes().length > 1) {
      let routes = this.navigator.getCurrentRoutes();
      var route = routes[routes.length - 1];
      // if (route.scene) {
      //   route.scene.getWrappedInstance().handleBackButton();
      //   return true;
      // }
      this.navigator.pop();
      return true;
    } else {
      return false;
    }
  }

  render() {
    !this.state.isIOS && StatusBar.setBackgroundColor(Style.STATUSBAR_BACKGOUND, true);

    return (
      <Navigator
        ref={(navigator) => this.navigator = navigator}
        style={styles.container}
        configureScene={(route) => {
          if (Platform.OS === 'android') {
            return Navigator.SceneConfigs.FloatFromBottomAndroid;
          }
          if (route.scanPasscode) {
            return Navigator.SceneConfigs.FloatFromBottom;
          }
          return Navigator.SceneConfigs.PushFromRight;
        }}
        initialRoute={{login: true}}
        renderScene={this.renderScene.bind(this)}
        //onDidFocus={this._onDidFocus.bind(this)}
      />
    );
  }

  _onDidFocus(route) {
    // notify child onDidFocus event
    // if (route.scene && route.ticketScanning) {
    //   route.scene.getWrappedInstance().componentDidFocus();
    // }
  }

  renderScene(route, navigator) {

    if (route.login) {
      return (<LoginComponent navigator={navigator} />);
    }

    if (route.tabs) {
      return (<TabsView navigator={navigator} />);
    }

  }

}

AppNavigator.childContextTypes = {
  addBackButtonListener: React.PropTypes.func,
  removeBackButtonListener: React.PropTypes.func,
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Style.BACKGROUND_COLOR,
  },
});

function select(store) {
  return {
    user: store.user
  };
}

module.exports = connect(select)(AppNavigator);
