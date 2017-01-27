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
  ToolbarAndroid,
  InteractionManager,
  Image,
  ListView,
  Navigator,
  RecyclerViewBackedScrollView
} from 'react-native';

var { connect } = require('react-redux');
var { getProducts, refreshToken } = require('./../actions');
import NavigationBar from 'react-native-navbar';
// We Import our Stylesheet
import Style from "./../Style";
import Spinner from '../common/Spinner';
import { SegmentedControls, RadioButtons } from 'react-native-radio-buttons'


class ItemsListComponent extends Component {
  state: {
    isIOS: boolean;
    animating: boolean;
    dataSource: ListView.DataSource;
    refreshing: boolean;
  };

  props: {
    navigator: Navigator;
    route: Object;
    connectionInfo: string;
    getProducts: () => Promise<any>;
    refreshToken: () => Promise<any>;
    products: Array<Object>;
  };

  static contextTypes = {
    openDrawer: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    const {products} = this.props;
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {dataSource: ds.cloneWithRows(products), isIOS : Platform.OS === 'ios',
      animating: false, refreshing: false, sortingType: 'Name' };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getItems();
    });
  }

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.products !== nextProps.products) {
      this.sortList(nextProps.products, this.state.sortingType);
      //this.setState({dataSource: this.state.dataSource.cloneWithRows(nextProps.products)});
    }
  }

  render() {

    const connection = this.props.connectionInfo;
    const isOffline = (connection.toLowerCase() === 'none' || connection.toLowerCase() === 'unknown' || !connection);

    const titleConfig = <View style={Style.globalStyle.navBarTitleView}>
      <Text lineBreakMode="tail" numberOfLines={1} style={Style.globalStyle.navBarTitleText}>{'Items List'}</Text></View>;

    return (
      <View style={styles.container}>
        <NavigationBar style={{backgroundColor: Style.NAVBAR_BACKGROUND, height: 44 * Style.RATIO_X}}
                       statusBar={{style: 'light-content', tintColor: Style.STATUSBAR_BACKGOUND}}
                       title={titleConfig}
        />
        {isOffline ? <View style={Style.globalStyle.offlineView}><Text style={Style.globalStyle.offlineText}>{Style.OFFLINE_TEXT}</Text></View> : null}

        { !this.state.isIOS ? <TouchableHighlight style={{backgroundColor: Style.ROW_BACKGROUND, width: 150, height: 40, justifyContent: 'center', alignItems: 'center'}}
                                                  onPress={this.handleShowMenu.bind(this)}>
          <Text>{'Open Menu'}</Text>
        </TouchableHighlight> : null}


        <ListView
          style={{flex: 1}}
          dataSource={this.state.dataSource}
          renderHeader={this.renderHeader.bind(this)}
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

  renderHeader() {
    const optionsAcceptable = ['Name', 'Price'];

    return (
      <View style={[styles.tableHeaderView, {marginHorizontal: this.state.isIOS ? 10 : 0}]}>
        <SegmentedControls allowFontScaling={false} options={ optionsAcceptable }
                           tint={Style.BUTTON_COLOR_IOS} selectedTint={'white'} backTint={'white'}
                           onSelection={ (sortingType) => {this.setState({sortingType}); this.sortList(this.props.products, sortingType)} }
                           optionStyle={{fontSize: Style.FONT_SIZE}}
                           renderOptions={RadioButtons.getTextOptionRenderer({fontSize: Style.FONT_SIZE}, {fontSize: Style.FONT_SIZE}, {fontSize: Style.FONT_SIZE})}
                           selectedOption={ this.state.sortingType === 'Name' ? 'Name' : 'Price' } />
    </View>
    )
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

  backButton() {
    this.props.navigator.pop();
  }

  handleShowMenu() {
    this.context.openDrawer();
  }

  onBuyPress(rowData: Object) {

  }

  _onRefresh() {
    this.setState({refreshing: true});
    setTimeout( () => this.getItems(), 400);
  }

  sortList(items, sortingType) {

    items.sort(function(a,b) {
      if (sortingType.toLowerCase() == 'price') {
        return a.price - b.price || a.name.localeCompare(b.name);
      } else {
        if(a[sortingType.toLowerCase()] < b[sortingType.toLowerCase()]) return -1;
        if(a[sortingType.toLowerCase()] > b[sortingType.toLowerCase()]) return 1;
        return 0;
      }

    });

    let sortedProducts = Object.assign({}, items);
    this.setState({dataSource: this.state.dataSource.cloneWithRows(sortedProducts)});
  }


  async getItems() {
    this.setState({animating: true});
    try {
      await Promise.race([
        this.props.getProducts(),
        global.timeout(20000)
      ]);
    } catch (e) {
      const message = e.message || e;

      if (e.status == 401) {
        global.LOG('Anuthorized');
        this.props.refreshToken().then(() => this.getItems()).catch((e) => { console.log( e.message); });
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
  tableHeaderView: {
    flex: 1,
    marginHorizontal: Platform.OS === 'ios' ? 10 : 0,
    marginVertical: Platform.OS === 'ios' ? 5 : 0,
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
  headerText: {
    marginHorizontal: 7 * Style.RATIO_X,
    color: Style.INPUT_TEXT_COLOR,
    fontSize: Style.FONT_SIZE_TITLE
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
    products: store.products.products
  };
}

function actions(dispatch) {
  return {
    getProducts: () => dispatch(getProducts()),
    refreshToken: () => dispatch(refreshToken())
  }
}

module.exports = connect(select, actions)(ItemsListComponent);
