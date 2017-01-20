/**
 * @flow
 */

import React from "react-native";
import Dimensions from 'Dimensions';
import { StyleSheet, Platform, PixelRatio } from 'react-native';

// Precalculate Device Dimensions for better performance
const x = Dimensions.get('window').width;
const y = Dimensions.get('window').height;

// Calculating ratio from iPhone breakpoints
//const ratioX = x < 375 ? (x < 320 ? 0.75 : 0.875) : 1;
//const ratioY = y < 568 ? (y < 480 ? 0.75 : 0.875) : 1 ;

// Calculate relative width to different iPhone size
function ratioX() {

  if (x < 375) {
    return x < 320 ? 0.75 : 0.875
  } else if (375 <= x && x < 414) {
    return 1;
  } else if (414 <= x && x < 768) {
    return 1.1;
  } else if (768 <= x && x < 1024 ) {
    return 1.5;
  } else {
    return 2;
  }
}

// Calculate relative height to different iPhone size
function ratioY() {

  if (y < 667) {
    return y < 568 ? 0.75 : 0.875;
  } else if (667 <= y && y < 736) {
    return 1;
  } else if (736 <= y && y < 1024) {
    return 1.1;
  } else if (1024 <= y && y < 1366 ) {
    return 1.5;
  } else {
    return 2;
  }
}

// We set our base font size value
const base_unit = 16;

// We're simulating EM by changing font size according to Ratio
const unit = base_unit * ratioX();

// We add an em() shortcut function
function em(value) {
  //console.log(PixelRatio.get() / PixelRatio.getFontScale());
  //console.log( PixelRatio.getFontScale());
  //console.log(x, ratioX());
  return Platform.OS === 'ios' ? unit * value : (PixelRatio.get() / PixelRatio.getFontScale())* unit * value;
}

function relativeFontSize(fontSize) {
  return fontSize*ratioX();
}

function relativeWidth(width) {
  //console.log('RATIO X ', x, ratioX());
  return width*ratioX();
}

function relativeHeight(height) {
  //console.log('RATIO Y ', y, ratioY());
  return height*ratioY();
}

// Then we set our styles with the help of the em() function
var Style = {

  // GENERAL
  DEVICE_WIDTH: x,
  DEVICE_HEIGHT: y,
  RATIO_X: ratioX(),
  RATIO_Y: ratioY(),
  RATIO_WIDTH: relativeWidth.bind(this),
  RATIO_HEIGHT: relativeHeight.bind(this),
  UNIT: em(1),

  SELECT_ROW_HEIGHT: 40,
  POPUP_VIEW_HEIGHT: 50,

  // FONT
  FONT_SIZE: em(1),
  FONT_SIZE_SMALLEST: em(0.65),
  FONT_SIZE_SMALLER: em(0.75),
  FONT_SIZE_SMALL: em(0.875),
  FONT_SIZE_BIG: em(1.25),
  FONT_SIZE_TITLE: em(1.25),

  // COLOR
  NAVBAR_BACKGROUND: '#488fb1',
  STATUSBAR_BACKGOUND: '#4baad8',
  BACKGROUND_COLOR: '#3c434e',
  WHITE_COLOR: 'white',
  BLACK_COLOR: 'black',
  BUTTON_BG_COLOR: '#2087b7',
  BUTTON_ACTIVE_COLOR: '#4baad8',
  INPUT_TEXT_COLOR: '#212226',
  PLACEHOLDER_TEXT_COLOR: '#909095',
  HEADER_BACKGROUND: '#efeff4',
  SEPARATOR_LINE: '#c8c7cc',
  ROW_BACKGROUND: '#f2f2f2',
  OFFLINE_BACKGROUND: '#dedee5',

  OFFLINE_TEXT: 'You are offline',


  // global styles
  globalStyle : StyleSheet.create({
    offlineView: {
      backgroundColor: '#dedee5',
      justifyContent: 'center',
      alignItems: 'center'
    },
    offlineText: {
      fontSize: em(0.875),
      color: '#4baad8',
      marginVertical: 1
    },

    navBarTitleText: {
      color: 'white',
      width: 180 * ratioX(),
      textAlignVertical: 'center',
      textAlign: 'center',
      fontSize: em(1.25),
    },
    navBarTitleView: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    }
  })

};

export default Style;
