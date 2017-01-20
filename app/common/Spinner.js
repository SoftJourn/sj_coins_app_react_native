// @flow

import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const SIZES = ['small', 'normal', 'large'];

export default class Spinner extends React.Component {

  state: {
    visible: boolean;
  };

  constructor(props: Object) {
    super(props);
    this.state = { visible: this.props.visible };
  }

  static propTypes = {
    visible: React.PropTypes.bool,
    color: React.PropTypes.string,
    size: React.PropTypes.oneOf(SIZES),
    overlayColor: React.PropTypes.string
  };

  static defaultProps = {
    visible: false,
    color: 'white',
    size: 'large', // 'normal',
    overlayColor: 'rgba(0, 0, 0, 0.25)'
  };

  componentWillReceiveProps(nextProps: Object) {
    const { visible } = nextProps;
    this.setState({ visible });
  }

  render() {
    const { visible } = this.state;

    if (!visible)
      return (
        <View />
      );

    const spinner = (
      <View style={styles.container} key={`spinner_${Date.now()}`}>
        <View
          style={[
            styles.background,
            { backgroundColor: this.props.overlayColor }
          ]}>
          <ActivityIndicator
            color={this.props.color}
            size={this.props.size}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    );

    return spinner;
  }

}
