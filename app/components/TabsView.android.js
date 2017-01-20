/**
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableHighlight,
  Platform,
  InteractionManager,
} from 'react-native';

import DrawerLayout from '../common/DrawerLayout';
import MenuItem from '../common/MenuItem';
var Navigator = require('Navigator');
var { switchTab } = require('../actions');
var { connect } = require('react-redux');

import type {Tab} from './../reducers/navigation';
var DashboardComponent = require('./Dashboard');
var FavoritesComponent = require('./Favorites');
var ItemsListComponent = require('./ItemsList');
var ProfileComponent = require('./Profile');

class TabsView extends React.Component {
  props: {
    onTabSelect: (tab: Tab) => void;
    navigator: Navigator;
  };

  constructor(props) {
    super(props);

    this.openDrawer = this.openDrawer.bind(this);
  }

  getChildContext() {
    return {
      openDrawer: this.openDrawer,
    };
  }

  openDrawer() {
    this.refs.drawer.openDrawer();
  }

  onTabSelect(tab: Tab) {
    if (this.props.tab !== tab) {
      this.props.onTabSelect(tab);
    }
    this.refs.drawer.closeDrawer();
  }

  renderNavigationView() {

    return (
      <View style={styles.drawer}>
        <Image
          style={styles.header}
          source={require('./../../resources/fb_images/drawer-header.png')}>
        </Image>

        <MenuItem
          title="Home"
          selected={this.props.tab === 'home'}
          onPress={this.onTabSelect.bind(this, 'home')}
          icon={require('./../../resources/fb_images/schedule-icon-1.png')}
          selectedIcon={require('./../../resources/fb_images/schedule-icon-1-active.png')}
        />
        <MenuItem
          title="Favorites"
          selected={this.props.tab === 'favorites'}
          onPress={this.onTabSelect.bind(this, 'favorites')}
          icon={require('./../../resources/fb_images/maps-icon.png')}
          selectedIcon={require('./../../resources/fb_images/maps-icon-active.png')}
        />
        <MenuItem
          title="All Items"
          selected={this.props.tab === 'all-items'}
          onPress={this.onTabSelect.bind(this, 'all-items')}
          badge={this.props.notificationsBadge}
          icon={require('./../../resources/fb_images/notifications-icon.png')}
          selectedIcon={require('./../../resources/fb_images/notifications-icon-active.png')}
        />
        <MenuItem
          title="Profile"
          selected={this.props.tab === 'profile'}
          onPress={this.onTabSelect.bind(this, 'profile')}
          icon={require('./../../resources/fb_images/info-icon.png')}
          selectedIcon={require('./../../resources/fb_images/info-icon-active.png')}
        />

      </View>
    );
  }

  renderContent() {
    switch (this.props.tab) {
      case 'home':
        return (
          <DashboardComponent  navigator={this.props.navigator} />
        );

      case 'favorites':
        return (
          <FavoritesComponent  navigator={this.props.navigator} />
        );

      case 'all-items':
        return (
          <ItemsListComponent navigator={this.props.navigator} />
        );

      case 'profile':
        return (
          <ProfileComponent navigator={this.props.navigator} />
        );
    }
    throw new Error(`Unknown tab ${this.props.tab}`);
  }

  render() {
    return (
      <DrawerLayout
        ref="drawer"
        drawerWidth={290}
        drawerPosition="left"
        renderNavigationView={this.renderNavigationView.bind(this)}>
        <View style={styles.content}>
          {this.renderContent()}
        </View>
      </DrawerLayout>
    );
  }

}

var styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    justifyContent: 'flex-end',
  },
});

TabsView.childContextTypes = {
  openDrawer: React.PropTypes.func,
};

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
