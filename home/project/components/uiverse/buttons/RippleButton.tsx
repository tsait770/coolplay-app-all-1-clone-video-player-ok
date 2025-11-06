import React, { useRef } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { createRippleAnimation } from '../utils/animations';
import type { ButtonProps } from '../utils/types';

export const RippleButton: React.FC<ButtonProps> = ({
  onPress,
  children,
  disabled = false,
  testID,
}) => {
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(0.6)).current;

  const handlePress = () => {
    rippleScale.setValue(0);
    rippleOpacity.setValue(0.6);

    createRippleAnimation(rippleScale, rippleOpacity).start(() => {
      onPress?.();
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.9}
      testID={testID}
    >
      <View style={[styles.button, disabled && styles.disabled]}>
        <Animated.View
          style={[
            styles.ripple,
            {
              transform: [{ scale: rippleScale }],
              opacity: rippleOpacity,
            },
          ]}
        />
        <Text style={styles.text}>{children}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'relative' as const,
    backgroundColor: '#0066ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#0066ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  disabled: {
    opacity: 0.5,
  },
  ripple: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    width: 20,
    height: 20,
    marginLeft: -10,
    marginTop: -10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
});
