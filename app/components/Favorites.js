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
  Image,
  Keyboard,
  Alert,
  StatusBar,
  InteractionManager,
  KeyboardAvoidingView
} from 'react-native';
import ReactNative from 'react-native';

var { connect } = require('react-redux');
var Navigator = require('Navigator');
import NavigationBar from 'react-native-navbar';
// We Import our Stylesheet
import Style from "./../Style";
import Spinner from '../common/Spinner';

class FavoritesComponent extends Component {

  state: {
    animating: boolean;
    isIOS : boolean;
  };

  props: {
      style: any;
      navigator: Navigator;
    };

  static contextTypes = {
    openDrawer: React.PropTypes.func,
  };


  constructor(props) {
    super(props);
    this.state = { animating: false, isIOS : Platform.OS === 'ios' };
  }

  componentWillMount() {

  }

  componentWillUnmount() {

  }


  render() {

    const titleConfig = <View style={Style.globalStyle.navBarTitleView}>
      <Text lineBreakMode="tail" numberOfLines={1} style={Style.globalStyle.navBarTitleText}>{'Favorites'}</Text></View>;

    return (
      <View style={styles.container}>
        <NavigationBar style={{backgroundColor: Style.NAVBAR_BACKGROUND, height: 44 * Style.RATIO_X}}
        statusBar={{style: 'light-content', tintColor: Style.STATUSBAR_BACKGOUND}} title={titleConfig}/>
        <KeyboardAvoidingView behavior={'padding'} style={styles.wrapper}>

          <View style={{flex: 1}}>
            <Text>{'Favorites View'}</Text>

            { !this.state.isIOS ? <TouchableHighlight style={{backgroundColor: Style.ROW_BACKGROUND, width: 150, height: 40, justifyContent: 'center', alignItems: 'center'}}
                                                      onPress={this.handleShowMenu.bind(this)}>
              <Text>{'Open Menu'}</Text>
            </TouchableHighlight> : null}
          </View>



        </KeyboardAvoidingView>

        <Spinner visible={this.state.animating} color={Style.STATUSBAR_BACKGOUND} />
      </View>
    );
  }

  handleShowMenu() {
    this.context.openDrawer();
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

});

function select(store) {
  return {

  };
}

function actions(dispatch) {
  return {

  }
}

module.exports = connect(select, actions)(FavoritesComponent);
