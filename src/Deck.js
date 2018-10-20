import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager
} from "react-native";
import React, { Component } from "react";

const SCREEN_WIDTH = Dimensions.get("window").width;
const Min_Swipe = SCREEN_WIDTH * 0.25;
const SwipeOutTime = 250;

export default class Deck extends Component {
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft: () => {}
  };
  state = {
    index: 0
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.this.setState({ index: 0 });
    }
  }
  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }

  panResponder = () => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        this.position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        const dx = gesture.dx;
        if (Math.abs(dx) > Min_Swipe) {
          this.forceSwipe(Math.sign(dx));
        } else {
          this.resetPostion();
        }
      }
    });
  };

  forceSwipe = sign => {
    Animated.timing(this.position, {
      toValue: {
        x: sign * SCREEN_WIDTH * 1.2,
        y: 0
      },
      duration: SwipeOutTime
    }).start(() => this.onSwipeComplete(sign));
  };

  onSwipeComplete = sign => {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const card = data[this.state.index];
    sign > 0 ? onSwipeRight() : onSwipeLeft();
    this.setState({
      index: this.state.index + 1
    });
    this.position.setValue({ x: 0, y: 0 });
  };

  resetPostion = () => {
    Animated.spring(this.position, {
      toValue: {
        x: 0,
        y: 0
      }
    }).start();
  };

  getCardStyle = () => {
    const rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 2, 0, SCREEN_WIDTH * 2],
      outputRange: ["-120deg", "0deg", "120deg"]
    });
    return { ...this.position.getLayout(), transform: [{ rotate }] };
  };

  renderCards = () => {
    if (this.state.index >= this.props.data.length) {
      return this.props.renderNoMoreCards();
    }
    return this.props.data
      .map((card, index) => {
        if (index < this.state.index) {
          return null;
        }
        if (index === this.state.index) {
          return (
            <Animated.View
              key={card.id}
              style={[this.getCardStyle(), styles.cardStyle]}
              {...this.panResponder().panHandlers}
            >
              {this.props.renderCard(card)}
            </Animated.View>
          );
        }
        return (
          <Animated.View
            key={card.id}
            style={[styles.cardStyle, { top: 10 * (index - this.state.index) }]}
          >
            {this.props.renderCard(card)}
          </Animated.View>
        );
      })
      .reverse();
  };

  render() {
    this.position = new Animated.ValueXY();
    return <View>{this.renderCards()}</View>;
  }
}
const styles = {
  cardStyle: {
    position: "absolute",
    width: SCREEN_WIDTH
  }
};
