import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  Animated,
  Pressable,
  Text,
  StyleSheet,
} from 'react-native';
import Colors from '@/constants/colors';
import { DesignTokens } from '@/constants/designTokens';
import { AnimatedButtonProps } from '../utils/types';
import {
  createRippleAnimation,
  triggerHaptic,
  checkReducedMotion,
} from '../utils/animations';

export const RippleButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  testID = 'ripple-button',
  accessibilityLabel,
  accessibilityHint,
}) => {
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    checkReducedMotion().then(setReduceMotion);
  }, []);

  const handlePress = useCallback((event: any) => {
    if (disabled || loading) return;

    if (event.nativeEvent) {
      const { locationX, locationY } = event.nativeEvent;
      setRipplePosition({ x: locationX || 0, y: locationY || 0 });
    }

    if (!reduceMotion) {
      rippleScale.setValue(0);
      rippleOpacity.setValue(0.5);

      createRippleAnimation(rippleScale, rippleOpacity).start();
    }

    triggerHaptic('medium');
    onPress();
  }, [disabled, loading, reduceMotion, onPress, rippleScale, rippleOpacity]);

  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return Colors.accent.primary;
      case 'secondary':
        return Colors.surface.secondary;
      case 'danger':
        return Colors.semantic.danger;
      case 'success':
        return Colors.semantic.success;
      default:
        return Colors.accent.primary;
    }
  };

  const buttonStyles = [
    styles.base,
    styles[size],
    { backgroundColor: getBackgroundColor() },
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${size}Text` as keyof typeof styles],
    variant === 'secondary' && styles.secondaryText,
    disabled && styles.disabledText,
    textStyle,
  ];

  const rippleStyle = {
    position: 'absolute' as const,
    left: ripplePosition.x - 20,
    top: ripplePosition.y - 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{ scale: rippleScale }],
    opacity: rippleOpacity,
  };

  return (
    <Pressable
      style={buttonStyles}
      onPress={handlePress}
      disabled={disabled || loading}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
      testID={testID}
    >
      <Text style={textStyles}>{title}</Text>
      
      {!reduceMotion && (
        <Animated.View style={rippleStyle} pointerEvents="none" />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: DesignTokens.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    ...DesignTokens.shadows.sm,
  },
  sm: {
    height: DesignTokens.components.button.height.sm,
    paddingHorizontal: DesignTokens.components.button.padding.sm.horizontal,
  },
  md: {
    height: DesignTokens.components.button.height.md,
    paddingHorizontal: DesignTokens.components.button.padding.md.horizontal,
  },
  lg: {
    height: DesignTokens.components.button.height.lg,
    paddingHorizontal: DesignTokens.components.button.padding.lg.horizontal,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: Colors.primary.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  smText: {
    ...DesignTokens.typography.body.small,
  },
  mdText: {
    ...DesignTokens.typography.body.medium,
  },
  lgText: {
    ...DesignTokens.typography.body.large,
  },
  secondaryText: {
    color: Colors.primary.text,
  },
  disabledText: {
    color: Colors.interactive.disabled,
  },
});

export default RippleButton;
