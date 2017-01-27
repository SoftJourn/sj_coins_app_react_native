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
  ListView,
  Image,
  RefreshControl,
  Alert,
  StatusBar,
  InteractionManager,
  Navigator,
  KeyboardAvoidingView
} from 'react-native';

var { connect } = require('react-redux');
var { getFavorites, refreshToken } = require('./../actions');
import NavigationBar from 'react-native-navbar';
// We Import our Stylesheet
import Style from "./../Style";
import Spinner from '../common/Spinner';

class FavoritesComponent extends Component {

  state: {
    animating: boolean;
    isIOS : boolean;
    dataSource: ListView.DataSource;
    refreshing: boolean;
  };

  props: {
    style: any;
    navigator: Navigator;
    getFavorites: () => Promise<any>;
    refreshToken: () => Promise<any>;
    favorites: Array<Object>;
    };

  static contextTypes = {
    openDrawer: React.PropTypes.func,
  };


  constructor(props) {
    super(props);
    const {favorites} = this.props;
    global.LOG(favorites);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {dataSource: ds.cloneWithRows(favorites), animating: false, isIOS : Platform.OS === 'ios',
      refreshing: false, };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getFavorites();
    });
  }

  componentWillReceiveProps(nextProps: Object) {
    global.LOG(nextProps.favorites);
    if (this.props.favorites !== nextProps.favorites) {
      this.setState({dataSource: this.state.dataSource.cloneWithRows(nextProps.favorites)});
    }
  }

  componentWillMount() {

  }

  componentWillUnmount() {

  }


  render() {

    const connection = this.props.connectionInfo;
    const isOffline = (connection.toLowerCase() === 'none' || connection.toLowerCase() === 'unknown' || !connection);

    const titleConfig = <View style={Style.globalStyle.navBarTitleView}>
      <Text lineBreakMode="tail" numberOfLines={1} style={Style.globalStyle.navBarTitleText}>{'Favorites'}</Text></View>;

    return (
      <View style={styles.container}>
        <NavigationBar style={{backgroundColor: Style.NAVBAR_BACKGROUND, height: 44 * Style.RATIO_X}}
        statusBar={{style: 'light-content', tintColor: Style.STATUSBAR_BACKGOUND}} title={titleConfig}/>
        {isOffline ? <View style={Style.globalStyle.offlineView}><Text style={Style.globalStyle.offlineText}>{Style.OFFLINE_TEXT}</Text></View> : null}

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
          renderSeparator={this._renderSeperator}
        />



        <Spinner visible={this.state.animating} color={Style.STATUSBAR_BACKGOUND} />
      </View>
    );
  }

  handleShowMenu() {
    this.context.openDrawer();
  }

  _renderRow(rowData: Object, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
    return (
      <View style={styles.rowWrapper}>
        <View style={{justifyContent: 'center', margin: 1}}>
          <Image style={styles.rowIcon} source={{uri: `${global.BASE_URL}/vending/v1/${rowData.imageUrl}`}} />
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text>{rowData.name}</Text>
          <Text style={styles.priceText}>{`${rowData.price} Coins`}</Text>
        </View>

        <View>
          <TouchableHighlight style={styles.buyButton} underlayColor={'transparent'} activeOpacity={0.4} onPress={(rowData) => { this.onBuyPress(rowData); }}>
            <Text style={styles.buyButtonText}>{'Buy'}</Text>
          </TouchableHighlight>
        </View>

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

  _onRefresh() {
    this.setState({refreshing: true});
    setTimeout( () => this.getFavorites(), 400);
  }

  async getFavorites() {
    this.setState({animating: true});
    try {
      await Promise.race([
        this.props.getFavorites(),
        global.timeout(20000)
      ]);
    } catch (e) {
      const message = e.message || e;

      if (e.status == 401) {
        global.LOG('Anuthorized getFavorites');
        this.props.refreshToken().then(() => this.getFavorites()).catch((e) => { console.log( e.message); });
        return;
      }
      setTimeout( () => alert('Attention', message) , 300);
      console.log(message || e);
      return;
    } finally {
      this.setState({animating: false, refreshing: false});
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Style.WHITE_COLOR,
  },
  rowWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    //alignItems: 'center'
  },
  rowIcon: {
    width: 40 * Style.RATIO_X,
    height: 40 * Style.RATIO_X,
    marginHorizontal: 7 * Style.RATIO_X
  },
  buyButton: {
    height: 40 * Style.RATIO_X,
    justifyContent: 'center',
    marginHorizontal: 7 * Style.RATIO_X
  },
  buyButtonText: {
    color: Style.BUTTON_COLOR_IOS
  },
  rowText: {
    marginHorizontal: 7 * Style.RATIO_X,
    fontSize: Style.FONT_SIZE
  },
  priceText: {
    color: Style.PRICE_COLOR
  }

});

function select(store) {
  return {
    connectionInfo: store.device.connection,
    favorites: store.favorites.favorites
  };
}

function actions(dispatch) {
  return {
    getFavorites: () => dispatch(getFavorites()),
    refreshToken: () => dispatch(refreshToken())
  }
}

module.exports = connect(select, actions)(FavoritesComponent);
