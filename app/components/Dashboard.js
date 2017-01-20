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
  NetInfo,
  ListView,
  RecyclerViewBackedScrollView
} from 'react-native';

var { connect } = require('react-redux');
var { getProjects,logout, autoLogin, cacheAudits, cacheTemplates, changeConnection } = require('./../actions');
var Navigator = require('Navigator');
import NavigationBar from 'react-native-navbar';
// We Import our Stylesheet
import Style from "./../Style";
import Spinner from '../common/Spinner';

class ProjectsComponent extends Component {
  state: {
    isIOS: boolean;
    animating: boolean;
  };

  props: {
    navigator: Navigator;
    changeConnection: (connection: string) => void;
    route: Object;
    connectionInfo: string;
    isLoggedIn: boolean;
  };

  static contextTypes = {
    openDrawer: React.PropTypes.func,
  };


  constructor(props) {
    super(props);

    this.state = { isIOS : Platform.OS === 'ios',
    animating: false};
  }

  componentWillReceiveProps(nextProps: Object) {
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      if (this.props.isLoggedIn) {
        //this.loadProjects();
      }

    });
  }

  loadProjects() {
    NetInfo.isConnected.fetch().then(isConnected => {
      isConnected && this.getProjects();
    });
  }

  render() {

    const connection = this.props.connectionInfo;
    const isOffline = (connection.toLowerCase() === 'none' || connection.toLowerCase() === 'unknown' || !connection);

    const titleConfig = <View style={Style.globalStyle.navBarTitleView}>
      <Text>{'SJ Coins'}</Text>
    </View>;



    return (
      <View style={styles.container}>
        <NavigationBar style={{backgroundColor: Style.NAVBAR_BACKGROUND, height: 44 * Style.RATIO_X}}
        statusBar={{style: 'light-content', tintColor: Style.STATUSBAR_BACKGOUND}}
        title={titleConfig}  />
        {isOffline ? <View style={Style.globalStyle.offlineView}><Text style={Style.globalStyle.offlineText}>{Style.OFFLINE_TEXT}</Text></View> : null}

        <Text style={styles.welcomeText}>{'Welcome! '}</Text>
        { !this.state.isIOS ? <TouchableHighlight style={{backgroundColor: Style.ROW_BACKGROUND, width: 150, height: 40, justifyContent: 'center', alignItems: 'center'}}
                                                  onPress={this.handleShowMenu.bind(this)}>
          <Text>{'Open Menu'}</Text>
        </TouchableHighlight> : null}

        <Spinner visible={this.state.animating} color={Style.STATUSBAR_BACKGOUND} />
      </View>
    );
  }

  handleShowMenu() {
    this.context.openDrawer();
  }


  logoutPromt() {
    global.alertWithPromt(null, 'Are you sure you want to log out?', this.logOut.bind(this), null);
  }



  // async getProjects() {
  //   this.setState({animating: true});
  //   try {
  //       await Promise.race([
  //         this.props.getProjects(this.props.route.APIURL, this.props.route.token),
  //         global.timeout(20000)
  //       ]);
  //   } catch (e) {
  //     const message = e.message || e;
  //     console.log(message || e);
  //
  //     if (e.status == 401) {
  //         if (this.props.rememberMe) {
  //           global.LOG('Anuthorized');
  //           this.props.autoLogin().then(() => this.getProjects()).catch((e) => { alert('Attention', e.message); });
  //           return;
  //         } else {
  //           this.navigateToLogin();
  //         }
  //     }
  //
  //     setTimeout( () => alert('Attention', message) , 300);
  //     return;
  //   } finally {
  //     this.setState({animating: false});
  //   }
  //   this.setState({dataSource: this.state.dataSource.cloneWithRows(this.props.projects.Data)});
  //   this.props.cacheTemplates();
  //   this.props.cacheAudits();
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
  welcomeText: {
    textAlign: 'center',
    color: Style.INPUT_TEXT_COLOR,
    marginHorizontal: 5,
    marginVertical: 7,
    fontSize: Style.FONT_SIZE_BIG,
  },
});

function select(store) {
  return {
    connectionInfo: store.device.connection,
    //isLoggedIn: store.user.isLoggedIn
  };
}

function actions(dispatch) {
  return {
    //logout: () => dispatch(logout()),
    //autoLogin: () => dispatch(autoLogin()),
    changeConnection: (connectionInfo) => dispatch(changeConnection(connectionInfo))
  }
}

module.exports = connect(select, actions)(ProjectsComponent);
