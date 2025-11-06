import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Colors from '@/constants/colors';
import { DesignTokens } from '@/constants/designTokens';
import { LoaderProps } from '../utils/types';
import { createRotateAnimation, interpolateRotation } from '../utils/animations';

export const SpinLoader: React.FC<LoaderProps> = ({
  size = 'md',
  color = Colors.accent.primary,
  animating = true,
  style,
  testID = 'spin-loader',
}) => {
  const rotation = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!animating) {
      animation.current?.stop();
      return;
    }

    animation.current = createRotateAnimation(rotation);
    animation.current.start();

    return () => {
      animation.current?.stop();
    };
  }, [animating, rotation]);

  const sizeValue = size === 'sm' ? 24 : size === 'lg' ? 48 : 36;

  const loaderStyles = [
    styles.loader,
    {
      width: sizeValue,
      height: sizeValue,
      borderColor: color,
      borderTopColor: 'transparent',
    },
    style,
  ];

  const animatedStyle = {
    transform: [{ rotate: interpolateRotation(rotation) }],
  };

  if (!animating) {
    return null;
  }

  return (
    <View style={styles.container} testID={testID}>
      <Animated.View style={[loaderStyles, animatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    borderWidth: 3,
    borderRadius: DesignTokens.borderRadius.full,
  },
});

export default SpinLoader;
