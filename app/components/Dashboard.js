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
  RefreshControl,
  ScrollView,
  InteractionManager,
  Image,
  NetInfo,
  ListView,
  Navigator,
  RecyclerViewBackedScrollView
} from 'react-native';

var { connect } = require('react-redux');
var { getFeatures, refreshToken, getFavorites, getProducts, getProfile} = require('./../actions');
//var Navigator = require('Navigator');
import NavigationBar from 'react-native-navbar';
// We Import our Stylesheet
import Style from "./../Style";
import Spinner from '../common/Spinner';

class ProjectsComponent extends Component {
  state: {
    isIOS: boolean;
    animating: boolean;
    refreshing: boolean;
  };

  props: {
    navigator: Navigator;
    route: Object;
    connectionInfo: string;
    isLoggedIn: boolean;
    profile: Object;
    getFeatures: () => Promise<any>;
    refreshToken: () => Promise<any>;
    getProducts: () => Promise<any>;
    getFavorites: () => Promise<any>;
    getProfile: () => Promise<any>;
    features: Object;
  };

  static contextTypes = {
    openDrawer: React.PropTypes.func,
  };


  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {dataSource: ds.cloneWithRows([]), isIOS : Platform.OS === 'ios',
    animating: false, refreshing: false};
  }

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.features !== nextProps.features || this.props.products !== nextProps.products || this.props.favorites !== nextProps.favorites) {

      const {products, favorites} = nextProps;
      let categories = !!nextProps.features.categories ? nextProps.features.categories.slice() : [];

      if (products.length > 0 && !!nextProps.features.categories) {
        let lastAdded = {name: 'Last Added', products: []};
        for (let i=0; i < nextProps.features.lastAdded.length; i++ ) {
          let result = products.filter(function( obj ) {
            return obj.id == nextProps.features.lastAdded[i];
          });
          result.length > 0 && lastAdded.products.push(result[0]);
        }

        let bestSellers = {name: 'Best Sellers', products: []};
        for (let j=0; j < nextProps.features.bestSellers.length; j++ ) {
          let result = products.filter(function( obj ) {
            return obj.id == nextProps.features.bestSellers[j];
          });
          result.length > 0 && bestSellers.products.push(result[0]);
        }
        categories.unshift(bestSellers);
        categories.unshift(lastAdded);
      }

      if (favorites.length > 0) {
        let favoritesProducts = {name: 'Favorites', products: favorites};
        categories.unshift(favoritesProducts);
      }
      this.setState({dataSource: this.state.dataSource.cloneWithRows(categories)});
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.getProducts();
      this.props.getFavorites();
      this.props.getProfile();
      this.loadFeatures();
    });
  }

  render() {

    const connection = this.props.connectionInfo;
    const {profile} = this.props;
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

        <Text style={styles.profileBalance}>{`Your balance is ${profile.amount} Coins`}</Text>

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
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh.bind(this)} />}
          //renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          //renderSeparator={this._renderSeperator}
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
              <View style={styles.iconWrapper}><Image style={styles.rowIcon} source={{uri: `${global.BASE_URL}/vending/v1/${product.imageUrl}`}} /></View>
              <Text>{product.name}</Text>
              <Text style={styles.priceText}>{`${product.price} Coins`}</Text>
            </View>
          </TouchableHighlight>
        )
    });

    return (
    rowData.products.length > 0 ?
      <View style={styles.rowWrapper}>
        <View style={{height: 35, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={styles.categoryHeader}>{rowData.name}</Text>
          <TouchableHighlight  style={styles.seeAllButton} underlayColor={'transparent'} activeOpacity={0.4} onPress={(product) => { this.seeAllPress(rowData); }}>
            <Text style={styles.seeAllText}>{'See All'}</Text>
          </TouchableHighlight>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {products}
        </ScrollView>
      </View>
      : <View/>

    );
  }

  _renderSeperator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View key={`${sectionID}-${rowID}`}
            style={{ height: 1, backgroundColor: Style.SEPARATOR_LINE }}
      />
    );
  }

  _onRefresh() {
    this.setState({refreshing: true});
    setTimeout( () => this.loadFeatures(), 400);
  }

  handleShowMenu() {
    this.context.openDrawer();
  }

  onBuyPress(rowData: Object) {

  }

  seeAllPress(rowData: Object) {

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
      this.setState({animating: false, refreshing: false});
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
    backgroundColor: Style.WHITE_COLOR,
  },
  rowWrapper: {
    flex: 1,
    marginHorizontal: 7 * Style.RATIO_X
  },
  profileBalance: {
    textAlign: 'center',
    color: Style.TEXT_COLOR,
    marginHorizontal: 5,
    marginVertical: 7,
    fontSize: Style.FONT_SIZE,
  },
  rowIcon: {
    width: 70 * Style.RATIO_X,
    height: 70 * Style.RATIO_X,
    margin: 3 * Style.RATIO_X
  },
  iconWrapper: {
    width: 80 * Style.RATIO_X,
    height: 80 * Style.RATIO_X,
    borderWidth: 1,
    borderRadius: 9,
    borderColor: Style.SEPARATOR_LINE
  },
  featureItemButton: {
    flex: 1,
    width: 100 * Style.RATIO_X
  },
  categoryHeader: {
    fontWeight: 'bold',
  },
  seeAllText: {
    color: Style.BUTTON_COLOR_IOS
  },
  priceText: {
    color: Style.PRICE_COLOR
  }
});

function select(store) {
  return {
    connectionInfo: store.device.connection,
    profile: store.profile.profile,
    features: store.features.features,
    products: store.products.products,
    favorites: store.favorites.favorites
  };
}

function actions(dispatch) {
  return {
    //logout: () => dispatch(logout()),
    //autoLogin: () => dispatch(autoLogin()),
    getFeatures: () => dispatch(getFeatures()),
    getFavorites: () => dispatch(getFavorites()),
    getProducts: () => dispatch(getProducts()),
    getProfile: () => dispatch(getProfile()),
    refreshToken: () => dispatch(refreshToken())
  }
}

module.exports = connect(select, actions)(ProjectsComponent);
