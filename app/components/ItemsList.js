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
//var {  } = require('./../actions');
var Navigator = require('Navigator');
import NavigationBar from 'react-native-navbar';
// We Import our Stylesheet
import Style from "./../Style";
import Spinner from '../common/Spinner';


class ItemsListComponent extends Component {
  state: {
    isIOS: boolean;
    animating: boolean;
    dataSource: ListView.DataSource;
  };

  props: {
    navigator: Navigator;
    route: Object;
    connectionInfo: string;
  };

  static contextTypes = {
    openDrawer: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {dataSource: ds.cloneWithRows([]), isIOS : Platform.OS === 'ios',
      animating: false, };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      //this.getItems();
    });
  }

  componentWillReceiveProps(nextProps: Object) {
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
                       title={titleConfig} />
        {isOffline ? <View style={Style.globalStyle.offlineView}><Text style={Style.globalStyle.offlineText}>{Style.OFFLINE_TEXT}</Text></View> : null}

        { !this.state.isIOS ? <TouchableHighlight style={{backgroundColor: Style.ROW_BACKGROUND, width: 150, height: 40, justifyContent: 'center', alignItems: 'center'}}
                                                  onPress={this.handleShowMenu.bind(this)}>
          <Text>{'Open Menu'}</Text>
        </TouchableHighlight> : null}

        <ListView
          dataSource={this.state.dataSource}
          //renderHeader={this.renderHeader.bind(this)}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={this._renderSeperator}
        />

        <Spinner visible={this.state.animating} color={Style.STATUSBAR_BACKGOUND} />
      </View>
    );
  }

  // renderHeader() {
  //   return (<View style={styles.tableHeaderView}>
  //     <View style={{flex: 0.6}}><Text style={styles.headerText}>{'Name'}</Text></View>
  //     <View style={{flex: 0.4}}><Text style={styles.headerText}>{'Created Date'}</Text></View>
  //   </View>)
  // }

  _renderRow(rowData: Object, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
    return (
      <TouchableHighlight style={styles.row} underlayColor={'transparent'} activeOpacity={0.4} onPress={() => { this._pressRow(rowData); }}>
        <View style={styles.rowWrapper}>

        </View>
      </TouchableHighlight>
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

  _pressRow(rowData: Object) {

    //this.props.navigator.push({});
  }



  // async getItems() {
  //   this.setState({animating: true});
  //   try {
  //     await Promise.race([
  //       this.props.getItemsData(),
  //       global.timeout(20000)
  //     ]);
  //   } catch (e) {
  //     const message = e.message || e;
  //
  //     if (e.status == 401) {
  //       //this.navigateToLogin();
  //     }
  //     setTimeout( () => alert('Attention', message) , 300);
  //     console.log(message || e);
  //     return;
  //   } finally {
  //     this.setState({animating: false});
  //   }
  //
  //   let templates = this.props.templates.Data;
  //   this.setState({dataSource: this.state.dataSource.cloneWithRows(templates)});
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
  tableHeaderView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Style.HEADER_BACKGROUND,
    height: 48 * Style.RATIO_X,
  },
  row: {
    height: 44 * Style.RATIO_X
  },
  rowWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  rowIcon: {
    width: 12 * Style.RATIO_X,
    height: 22 * Style.RATIO_X,
    marginHorizontal: 7 * Style.RATIO_X
  },
  headerText: {
    marginHorizontal: 7 * Style.RATIO_X,
    color: Style.INPUT_TEXT_COLOR,
    fontSize: Style.FONT_SIZE_TITLE
  },
  rowText: {
    marginHorizontal: 7 * Style.RATIO_X,
    fontSize: Style.FONT_SIZE
  }
});

function select(store) {
  return {
    connectionInfo: store.device.connection
  };
}

function actions(dispatch) {
  return {
    //autoLogin: () => dispatch(autoLogin())
  }
}

module.exports = connect(select, actions)(ItemsListComponent);
