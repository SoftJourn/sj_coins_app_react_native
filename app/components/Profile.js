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
  Navigator,
  RecyclerViewBackedScrollView
} from 'react-native';

var { connect } = require('react-redux');
var { logout, getProfile, refreshToken } = require('./../actions');
//var Navigator = require('Navigator');
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
    logout: () => Promise<any>;
    getProfile: () => Promise<any>;
    refreshToken: () => Promise<any>;
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
      this.getProfile();
    });
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps: Object) {

  }

  render() {
    const {profile} = this.props.profile;
    const connection = this.props.connectionInfo;
    const isOffline = (connection.toLowerCase() === 'none' || connection.toLowerCase() === 'unknown' || !connection);

    const titleConfig = <View style={Style.globalStyle.navBarTitleView}>
      <Text lineBreakMode="tail" numberOfLines={1} style={Style.globalStyle.navBarTitleText}>{'Profile'}</Text></View>;

    const rightButton = <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <TouchableHighlight onPress={this.logoutPromt.bind(this)} activeOpacity={0.3} underlayColor={'transparent'}>
        <Text style={styles.barButtonText}>{'Log Out'}</Text>
      </TouchableHighlight>
    </View>;

    return (
      <View style={styles.container}>
        <NavigationBar style={{backgroundColor: Style.NAVBAR_BACKGROUND, height: 44 * Style.RATIO_X}}
        statusBar={{style: 'light-content', tintColor: Style.STATUSBAR_BACKGOUND}}
        title={titleConfig} rightButton={rightButton} />
        {isOffline ? <View style={Style.globalStyle.offlineView}><Text style={Style.globalStyle.offlineText}>{Style.OFFLINE_TEXT}</Text></View> : null}

        <View>
          <Text>{'View Profile Page'}</Text>

          { !this.state.isIOS ? <TouchableHighlight style={{backgroundColor: Style.ROW_BACKGROUND, width: 150, height: 40, justifyContent: 'center', alignItems: 'center'}}
                                                    onPress={this.handleShowMenu.bind(this)}>
            <Text>{'Open Menu'}</Text>
          </TouchableHighlight> : null}
        </View>

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.profileInfo}>{profile.name} {profile.surname}</Text>
          <Text style={styles.profileBalance}>{`${profile.amount} Coins`}</Text>
        </View>

        <Spinner visible={this.state.animating} color={Style.STATUSBAR_BACKGOUND} />
      </View>
    );
  }

  logoutPromt() {
    global.alertWithPromt(null, 'Are you sure you want to log out?', this.logOut.bind(this), null);
  }

  async logOut() {
    this.setState({animating: true});
    try {
      await Promise.race([
        this.props.logout(),
        global.timeout(15000)
      ]);
    } catch (e) {
      const message = e.message || e;
      //setTimeout( () => alert('Attention', message) , 300);
      console.log(message || e);
      this.setState({animating: false});
      return;
    } finally {
      //this.navigateToLogin();
    }
  }

  handleShowMenu() {
    this.context.openDrawer();
  }

  // navigateToLogin() {
  //   setTimeout( () => {
  //     this.props.navigator.resetTo({
  //       tabs: false,
  //       login: true
  //     })
  //   }, 400);
  // }

  async getProfile() {

    this.setState({animating: true});
    try {
        await Promise.race([
          this.props.getProfile(),
          global.timeout(20000)
        ]);
    } catch (e) {
      const message = e.message || e;

      if (e.status == 401) {
        global.LOG('Anuthorized');
        this.props.refreshToken().then(() => this.getProfile()).catch((e) => { console.log( e.message); this.logOut(); });
        return;
      }
      setTimeout( () => alert('Attention', message) , 300);
      console.log(message || e);
      return;
    } finally {
      this.setState({animating: false});
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Style.WHITE_COLOR,
  },
  barButtonText: {
    color: Style.WHITE_COLOR,
    fontSize: Style.FONT_SIZE,
    marginHorizontal: 7
  },
  profileInfo: {
    color: Style.TEXT_COLOR,
    fontSize: Style.FONT_SIZE,
    fontWeight: 'bold'
  },
  profileBalance: {
    color: Style.TEXT_COLOR,
    fontSize: Style.FONT_SIZE_BIG,
  }
});

function select(store) {
  return {
    connectionInfo: store.device.connection,
    profile: store.profile
  };
}

function actions(dispatch) {
  return {
    logout: () => dispatch(logout()),
    getProfile: () => dispatch(getProfile()),
    refreshToken: () => dispatch(refreshToken())
  }
}

module.exports = connect(select, actions)(ProfileComponent);
