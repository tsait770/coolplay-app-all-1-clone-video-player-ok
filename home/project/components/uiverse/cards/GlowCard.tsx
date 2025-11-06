import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import type { CardProps } from '../utils/types';

export const GlowCard: React.FC<CardProps> = ({
  children,
  onPress,
  testID,
}) => {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [glowAnim]);

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(102, 126, 234, 0.3)', 'rgba(118, 75, 162, 0.6)'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          shadowColor: glowColor,
        },
      ]}
      testID={testID}
    >
      <View style={styles.card}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
  },
});
