import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Colors from '@/constants/colors';
import { DesignTokens } from '@/constants/designTokens';
import { LoaderProps } from '../utils/types';
import { ANIMATION_DURATION } from '../utils/animations';

export const DotsLoader: React.FC<LoaderProps> = ({
  size = 'md',
  color = Colors.accent.primary,
  animating = true,
  style,
  testID = 'dots-loader',
}) => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animating) {
      return;
    }

    const createDotAnimation = (value: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: ANIMATION_DURATION.normal,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: ANIMATION_DURATION.normal,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animations = Animated.parallel([
      createDotAnimation(dot1, 0),
      createDotAnimation(dot2, 150),
      createDotAnimation(dot3, 300),
    ]);

    animations.start();

    return () => {
      animations.stop();
    };
  }, [animating, dot1, dot2, dot3]);

  const dotSize = size === 'sm' ? 6 : size === 'lg' ? 12 : 8;

  const dotStyle = {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    backgroundColor: color,
  };

  const createAnimatedDotStyle = (value: Animated.Value) => ({
    opacity: value.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
    transform: [
      {
        scale: value.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1.2],
        }),
      },
    ],
  });

  if (!animating) {
    return null;
  }

  return (
    <View style={[styles.container, style]} testID={testID}>
      <Animated.View style={[dotStyle, createAnimatedDotStyle(dot1)]} />
      <Animated.View style={[dotStyle, createAnimatedDotStyle(dot2)]} />
      <Animated.View style={[dotStyle, createAnimatedDotStyle(dot3)]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: DesignTokens.spacing.sm,
  },
});

export default DotsLoader;
