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
  Platform,
  TextInput,
  ToolbarAndroid,
  InteractionManager,
  Image,
  Switch,
  KeyboardAvoidingView
} from 'react-native';

var { connect } = require('react-redux');
var { login } = require('./../actions');
var Navigator = require('Navigator');
var dismissKeyboard = require('dismissKeyboard');
import NavigationBar from 'react-native-navbar';
// We Import our Stylesheet
import Style from "./../Style";
import Spinner from '../common/Spinner';


class LoginComponent extends Component {
  state: {
    isIOS: boolean;
    animating: boolean;
    username: string;
    password: string;
  };

  props: {
      navigator: Navigator;
      //rememberMe: boolean;
      user: Object,
      //setRememberMe: (rememberMe: boolean) => void;
      login: (username: string, password: string) => Promise<any>;
    };

  constructor(props) {
    super(props);
    this.state = {isIOS : Platform.OS === 'ios', animating: false,
    username: '', password: '', };
  }

  componentWillMount() {
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
    });
  }

  render() {

    const titleConfig = <View style={Style.globalStyle.navBarTitleView}>
      <Text lineBreakMode="tail" numberOfLines={1} style={Style.globalStyle.navBarTitleText}>{'Sign In'}</Text></View>;

    return (
      <View style={styles.container}>
        <NavigationBar style={{backgroundColor: Style.NAVBAR_BACKGROUND, height: 44 * Style.RATIO_X}}
        statusBar={{style: 'light-content', tintColor: Style.STATUSBAR_BACKGOUND}} title={titleConfig}/>
        <KeyboardAvoidingView behavior={'padding'} style={styles.wrapper}>

          <View style={{flex: 1, justifyContent: 'center'}}>
            <Image style={{width: 230 * Style.RATIO_X, height: 265 * Style.RATIO_X}}
              source={require('./../../resources/images/vending_machine.png')} />
          </View>

          <View style={{flex: 1}}>
            <View style={styles.inputWrapper}>
            <Image style={styles.inputImage}
              source={require('./../../resources/images/user.png')} />

              <TextInput placeholder="Login" placeholderTextColor={Style.INPUT_TEXT_COLOR}
              autoCapitalize={'none'} autoCorrect={false} clearButtonMode={'while-editing'} keyboardType={'email-address'}
              underlineColorAndroid={Style.WHITE_COLOR} style={styles.input}
              onChangeText={(username) => this.setState({username})} value={this.state.username} />
            </View>

            <View style={styles.inputWrapper}>
            <Image style={styles.inputImage}
              source={require('./../../resources/images/password.png')} />

              <TextInput placeholder="Password" placeholderTextColor={Style.INPUT_TEXT_COLOR}
              autoCapitalize={'none'} autoCorrect={false} clearButtonMode={'while-editing'} secureTextEntry={true}
              underlineColorAndroid={Style.WHITE_COLOR} style={styles.input}
              onChangeText={(password) => this.setState({password})} value={this.state.password} />
            </View>

            <TouchableHighlight style={styles.button} onPress={this.makeLogin.bind(this)} underlayColor={Style.BUTTON_ACTIVE_COLOR}>
              <Text style={styles.buttonText}>{'Submit'}</Text>
            </TouchableHighlight>
          </View>

        </KeyboardAvoidingView>

        <Spinner visible={this.state.animating} color={Style.STATUSBAR_BACKGOUND} />
      </View>
    );
  }

  makeLogin() {
    dismissKeyboard();
    this.login();
  }

  async login() {

    let errorMessage = '';
    if (this.state.username.length == 0) {
      errorMessage = 'Username cannot be empty'
    } else if (this.state.password.length == 0) {
      errorMessage = 'Password cannot be empty'
    }

    if (!!errorMessage) {
      setTimeout( () => alert('Attention', errorMessage), 300);
      return;
    }

    this.setState({animating: true});
    try {
        await Promise.race([
          this.props.login(this.state.username, this.state.password),
          global.timeout(20000)
        ]);
    } catch (e) {
      const message = e.message || e;
      console.log(message || e);
      setTimeout( () => alert('Attention', message) , 300);
      return;
    } finally {
      this.setState({animating: false});
    }

    this.props.navigator.immediatelyResetRouteStack([{
      tabs: true,
      //access_token: this.props.user.access_token
    }])

  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Style.BACKGROUND_COLOR,
  },
  wrapper :{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputWrapper: {
    flexDirection: 'row',
    width: Style.DEVICE_WIDTH*0.8,
    backgroundColor: Style.WHITE_COLOR,
    alignItems: 'center',
    paddingHorizontal: 5,
    marginVertical: 7 * Style.RATIO_X,
  },
  switchWrapper: {
    marginVertical: 7 * Style.RATIO_X,
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    height: 44 * Style.RATIO_X,
    backgroundColor: 'transparent',
    color: Style.INPUT_TEXT_COLOR,
    fontSize: Style.FONT_SIZE,
  },
  inputImage: {
    width: 25 * Style.RATIO_X,
    height: 25 * Style.RATIO_X,
    marginRight: 5
  },
  button: {
    backgroundColor: Style.BUTTON_BG_COLOR,
    width: Style.DEVICE_WIDTH*0.8,
    height: 44 * Style.RATIO_X,
    borderRadius: 10,
    justifyContent: 'center',
    marginVertical: 7 * Style.RATIO_X,
  },
  buttonText: {
    textAlign: 'center',
    color: Style.WHITE_COLOR,
    margin: 0,
    fontSize: Style.FONT_SIZE
  },
  switchText: {
    paddingHorizontal: 10,
    color: Style.WHITE_COLOR,
    fontSize: Style.FONT_SIZE
  }
});

function select(store) {
  return {
    //rememberMe: store.user.rememberMe,
    user: store.user
  };
}

function actions(dispatch) {
  return {
    //setRememberMe: (rememberMe) => dispatch(setRememberMe(rememberMe)),
    login: (username, password) => dispatch(login(username, password))
  }
}

module.exports = connect(select, actions)(LoginComponent);
