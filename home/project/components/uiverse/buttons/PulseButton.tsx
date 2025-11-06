import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createPulseAnimation } from '../utils/animations';
import type { ButtonProps } from '../utils/types';

export const PulseButton: React.FC<ButtonProps> = ({
  onPress,
  children,
  disabled = false,
  testID,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!disabled) {
      const animation = createPulseAnimation(pulseAnim);
      animation.start();
      return () => animation.stop();
    }
  }, [disabled, pulseAnim]);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      testID={testID}
    >
      <Animated.View
        style={[
          styles.button,
          {
            transform: [{ scale: pulseAnim }],
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <Text style={styles.text}>{children}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3ca7ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#3ca7ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
});
