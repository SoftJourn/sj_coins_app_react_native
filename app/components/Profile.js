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
  ListView,
  RecyclerViewBackedScrollView
} from 'react-native';

var { connect } = require('react-redux');
//var { } = require('./../actions');
var Navigator = require('Navigator');
import NavigationBar from 'react-native-navbar';
// We Import our Stylesheet
import Style from "./../Style";
import Spinner from '../common/Spinner';


class ProfileComponent extends Component {
  state: {
    isIOS: boolean;
    animating: boolean;
  };

  props: {
    navigator: Navigator;
    connectionInfo: string;
  };

  static contextTypes = {
    openDrawer: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {isIOS : Platform.OS === 'ios',
    animating: false, };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      //this.getProfile();
    });
  }

  componentWillReceiveProps(nextProps: Object) {

  }

  render() {
    const connection = this.props.connectionInfo;
    const isOffline = (connection.toLowerCase() === 'none' || connection.toLowerCase() === 'unknown' || !connection);

    const titleConfig = <View style={Style.globalStyle.navBarTitleView}>
      <Text lineBreakMode="tail" numberOfLines={1} style={Style.globalStyle.navBarTitleText}>{'Profile'}</Text></View>;

    return (
      <View style={styles.container}>
        <NavigationBar style={{backgroundColor: Style.NAVBAR_BACKGROUND, height: 44 * Style.RATIO_X}}
        statusBar={{style: 'light-content', tintColor: Style.STATUSBAR_BACKGOUND}}
        title={titleConfig} />
        {isOffline ? <View style={Style.globalStyle.offlineView}><Text style={Style.globalStyle.offlineText}>{Style.OFFLINE_TEXT}</Text></View> : null}

        <View>
          <Text>{'View Profile Page'}</Text>

          { !this.state.isIOS ? <TouchableHighlight style={{backgroundColor: Style.ROW_BACKGROUND, width: 150, height: 40, justifyContent: 'center', alignItems: 'center'}}
                                                    onPress={this.handleShowMenu.bind(this)}>
            <Text>{'Open Menu'}</Text>
          </TouchableHighlight> : null}
        </View>

        <Spinner visible={this.state.animating} color={Style.STATUSBAR_BACKGOUND} />
      </View>
    );
  }

  handleShowMenu() {
    this.context.openDrawer();
  }

  // async getProfile() {
  //
  //   const connection = this.props.connectionInfo;
  //   if (connection.toLowerCase() === 'none' || connection.toLowerCase() === 'unknown' || !connection) {
  //     alert('', 'Oops, you are offline!');
  //     return;
  //   }
  //
  //   this.setState({animating: true});
  //   try {
  //       await Promise.race([
  //         this.props.getAudits(this.props.projectId),
  //         new Promise((resolve, reject) => {
  //           this.startTimerForRequest(resolve, reject);
  //         })
  //       ]);
  //   } catch (e) {
  //     const message = e.message || e;
  //
  //     if (e.status == 401) {
  //       this.navigateToLogin();
  //     }
  //     setTimeout( () => alert('Attention', message) , 300);
  //     console.log(message || e);
  //     return;
  //   } finally {
  //     this.setState({animating: false});
  //   }
  //
  // }
  //
  // navigateToLogin() {
  //   setTimeout( () => {
  //     this.props.navigator.immediatelyResetRouteStack([{
  //       login: true
  //     }])
  //   }, 400);
  // }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Style.WHITE_COLOR,
  },
});

function select(store) {
  return {
    connectionInfo: store.device.connection
  };
}

function actions(dispatch) {
  return {
    //getProfile: (projectId) => dispatch(getProfile()),
  }
}

module.exports = connect(select, actions)(ProfileComponent);
