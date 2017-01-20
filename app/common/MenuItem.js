/**
 * @flow
 */

import React, { Component } from 'react';
import {

  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
} from 'react-native';

import Touchable from './Touchable';

//var F8Touchable = require('F8Touchable');

export default class MenuItem extends React.Component {
  props: {
    icon: number;
    selectedIcon: number;
    selected: boolean;
    title: string;
    onPress: () => void;
  };

  render() {
    var icon = this.props.selected ? this.props.selectedIcon : this.props.icon;
    var selectedTitleStyle = this.props.selected && styles.selectedTitle;

    return (
      <Touchable onPress={this.props.onPress}>
        <View style={styles.container}>
          <Image style={styles.icon} source={icon} />
          <Text style={[styles.title, selectedTitleStyle]}>
            {this.props.title}
          </Text>
        </View>
      </Touchable>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 20,
  },
  title: {
    flex: 1,
    fontSize: 17,
    color: '#7F91A7',
  },
  selectedTitle: {
    color: '#032250',
  }
});

//module.exports = MenuItem;
