/**
 * @flow
 */
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
  AppState,
  BackAndroid,
  Alert
} from 'react-native';


var { connect } = require('react-redux');
var {changeConnection} = require('./actions');
var AppNavigator = require('./AppNavigator');
import Style from "./Style";

var LoginComponent = require('./components/Login');

class PMVitalsApp extends Component {

  state: {
  };

  props: {
    changeConnection: (connection: string) => void,
    isLoggedIn: boolean;
  };

  _handlers: [() => boolean];

  constructor() {
    super();
    this.state = { };
  }

  componentDidMount() {
    NetInfo.fetch().done(this._handleConnectionInfoChange.bind(this));
    NetInfo.addEventListener(
        'change',
        this._handleConnectionInfoChange.bind(this)
    );
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(
        'change',
        this._handleConnectionInfoChange.bind(this)
    );
    AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
  }

  _handleConnectionInfoChange(connectionInfo) {
    global.LOG('connectionInfo ', connectionInfo);
    this.props.changeConnection(connectionInfo);
  }

  _handleAppStateChange(currentAppState) {
    if (currentAppState === 'active') {
      NetInfo.fetch().done(this._handleConnectionInfoChange.bind(this));
    }
    console.log(currentAppState);
  }


  render() {
    if (!this.props.isLoggedIn) {
      return <LoginComponent />
    }
    return (
      <AppNavigator />
    );
  }

}

PMVitalsApp.childContextTypes = {
  addBackButtonListener: React.PropTypes.func,
  removeBackButtonListener: React.PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Style.BACKGROUND_COLOR,
    marginTop: 0
  },
  navBar: {
    backgroundColor: 'white'
  }
});

function select(store) {
  return {
    connectionInfo: store.device.connection,
    isLoggedIn: store.user.isLoggedIn
  };
}

function actions(dispatch) {
  return {
    changeConnection: (connectionInfo) => dispatch(changeConnection(connectionInfo))
  }
}

module.exports = connect(select, actions)(PMVitalsApp);
