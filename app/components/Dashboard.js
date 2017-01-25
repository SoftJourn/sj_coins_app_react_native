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
  ScrollView,
  InteractionManager,
  Image,
  NetInfo,
  ListView,
  Navigator,
  RecyclerViewBackedScrollView
} from 'react-native';

var { connect } = require('react-redux');
var { getFeatures, refreshToken } = require('./../actions');
//var Navigator = require('Navigator');
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
    route: Object;
    connectionInfo: string;
    isLoggedIn: boolean;
    profile: Object;
    getFeatures: () => Promise<any>;
    refreshToken: () => Promise<any>;
    features: Object;
  };

  static contextTypes = {
    openDrawer: React.PropTypes.func,
  };


  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {dataSource: ds.cloneWithRows([]), isIOS : Platform.OS === 'ios',
    animating: false};
  }

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.features !== nextProps.features) {
      global.LOG('nextProps.features ', nextProps.features.categories);
      this.setState({dataSource: this.state.dataSource.cloneWithRows(nextProps.features.categories)});
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.loadFeatures();
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

        <ListView
          style={{flex: 1}}
          dataSource={this.state.dataSource}
          //renderHeader={this.renderHeader.bind(this)}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
          automaticallyAdjustContentInsets={false}
          contentInset={{bottom:49}}
          removeClippedSubviews={false}
          //renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={this._renderSeperator}
        />

        <Spinner visible={this.state.animating} color={Style.STATUSBAR_BACKGOUND} />
      </View>
    );
  }

  _renderRow(rowData: Object, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {

    let products = rowData.products.map((product) => {
      return (
          <TouchableHighlight key={`${rowData.name}_${product.id}`} style={styles.featureItemButton} underlayColor={'transparent'} activeOpacity={0.4} onPress={(product) => { this.onBuyPress(product); }}>
            <View>
              <Image style={styles.rowIcon} source={{uri: `${global.BASE_URL}/vending/v1/${product.imageUrl}`}} />
              <Text>{product.name}</Text>
              <Text>{product.price}</Text>
            </View>

          </TouchableHighlight>
        )
    });

    return (
      <View style={styles.rowWrapper}>

        <View style={{height: 35}}>
          <Text>{rowData.name}</Text>
        </View>
        <ScrollView horizontal={true}>
          {products}
        </ScrollView>
      </View>
    );
  }

  _renderSeperator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View key={`${sectionID}-${rowID}`}
            style={{ height: 1, backgroundColor: Style.SEPARATOR_LINE }}
      />
    );
  }

  handleShowMenu() {
    this.context.openDrawer();
  }

  onBuyPress(rowData: Object) {

  }

  async loadFeatures() {
    this.setState({animating: true});
    try {
        await Promise.race([
          this.props.getFeatures(),
          global.timeout(20000)
        ]);
    } catch (e) {
      const message = e.message || e;
      console.log(message || e);

      if (e.status == 401) {
        global.LOG('Anuthorized');
        this.props.refreshToken().then(() => this.loadFeatures()).catch((e) => { alert('Attention', e.message); });
        return;
      }

      setTimeout( () => alert('Attention', message) , 300);
      return;
    } finally {
      this.setState({animating: false});
    }

  }
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
    backgroundColor: Style.ROW_BACKGROUND,
  },
  rowWrapper: {
    flex: 1
  },
  welcomeText: {
    textAlign: 'center',
    color: Style.INPUT_TEXT_COLOR,
    marginHorizontal: 5,
    marginVertical: 7,
    fontSize: Style.FONT_SIZE_BIG,
  },
  rowIcon: {
    width: 25 * Style.RATIO_X,
    height: 25 * Style.RATIO_X,
    marginHorizontal: 7 * Style.RATIO_X
  },
  featureItemButton: {
    flex: 1,
    width: 100 * Style.RATIO_X
  }
});

function select(store) {
  return {
    connectionInfo: store.device.connection,
    profile: store.profile,
    features: store.features.features
    //isLoggedIn: store.user.isLoggedIn
  };
}

function actions(dispatch) {
  return {
    //logout: () => dispatch(logout()),
    //autoLogin: () => dispatch(autoLogin()),
    getFeatures: () => dispatch(getFeatures()),
    refreshToken: () => dispatch(refreshToken())
  }
}

module.exports = connect(select, actions)(ProjectsComponent);
