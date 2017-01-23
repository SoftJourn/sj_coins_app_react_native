/**
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  TouchableHighlight,
  Platform,
  InteractionManager,
  Navigator,
  TabBarIOS
} from 'react-native';

//var Navigator = require('Navigator');
var { switchTab } = require('../actions');
var { connect } = require('react-redux');


var DashboardComponent = require('./Dashboard');
var FavoritesComponent = require('./Favorites');
var ItemsListComponent = require('./ItemsList');
var ProfileComponent = require('./Profile');

import type {Tab} from './../reducers/navigation';

class TabsView extends React.Component {
  props: {
    onTabSelect: (tab: Tab) => void;
    navigator: Navigator;
  };

  constructor(props) {
    super(props);

    !!props.route.homeTab && this.props.onTabSelect(props.route.homeTab);
    this.state = {isIOS : true};
  }

  componentWillReceiveProps(nextProps: Object) {
    //global.LOG('WillReceive tabs props: ',nextProps.tab);
  }

  onTabSelect(tab: Tab) {
    if (this.props.tab !== tab) {
      this.props.onTabSelect(tab);
    }
  }

  render() {
    return (
      <TabBarIOS tintColor={'red'}>
        <TabBarIOS.Item
          title="Home"
          selected={this.props.tab === 'home'}
          onPress={this.onTabSelect.bind(this, 'home')}
          icon={require('./../../resources/fb_images/schedule-icon-1.png')}
          selectedIcon={require('./../../resources/fb_images/schedule-icon-1-active.png')}>
          <DashboardComponent
            navigator={this.props.navigator}
          />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Favorites"
          selected={this.props.tab === 'favorites'}
          onPress={this.onTabSelect.bind(this, 'favorites')}
          icon={require('./../../resources/fb_images/my-schedule-icon.png')}
          selectedIcon={require('./../../resources/fb_images/my-schedule-icon-active.png')}>
          <FavoritesComponent
            navigator={this.props.navigator}
          />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="All Items"
          selected={this.props.tab === 'all-items'}
          onPress={this.onTabSelect.bind(this, 'all-items')}
          icon={require('./../../resources/fb_images/maps-icon.png')}
          selectedIcon={require('./../../resources/fb_images/maps-icon-active.png')}>
          <ItemsListComponent
            navigator={this.props.navigator}
          />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Profile"
          selected={this.props.tab === 'profile'}
          onPress={this.onTabSelect.bind(this, 'profile')}
          badge={this.props.notificationsBadge || null}
          icon={require('./../../resources/fb_images/notifications-icon.png')}
          selectedIcon={require('./../../resources/fb_images/notifications-icon-active.png')}>
          <ProfileComponent
            navigator={this.props.navigator}
          />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }

}

function select(store) {
  return {
    tab: store.navigation.tab,
  };
}

function actions(dispatch) {
  return {
    onTabSelect: (tab) => dispatch(switchTab(tab)),
  };
}

module.exports = connect(select, actions)(TabsView);
