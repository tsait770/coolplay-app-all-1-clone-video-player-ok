import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Animated,
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { DesignTokens } from '@/constants/designTokens';
import { AnimatedButtonProps } from '../utils/types';
import {
  createPulseAnimation,
  createScaleAnimation,
  triggerHaptic,
  checkReducedMotion,
  ANIMATION_DURATION,
} from '../utils/animations';

export const PulseButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  testID = 'pulse-button',
  accessibilityLabel,
  accessibilityHint,
}) => {
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const [reduceMotion, setReduceMotion] = useState(false);
  const pulseAnimation = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    checkReducedMotion().then(setReduceMotion);
  }, []);

  useEffect(() => {
    if (disabled || loading || reduceMotion) {
      pulseAnimation.current?.stop();
      return;
    }

    pulseAnimation.current = createPulseAnimation(pulseScale, {
      duration: ANIMATION_DURATION.slower,
      toValue: 1.05,
    });
    pulseAnimation.current.start();

    return () => {
      pulseAnimation.current?.stop();
    };
  }, [disabled, loading, reduceMotion, pulseScale]);

  const handlePressIn = useCallback(() => {
    if (disabled || loading || reduceMotion) return;
    
    triggerHaptic('light');
    createScaleAnimation(pressScale, { toValue: 0.95 }).start();
  }, [disabled, loading, reduceMotion, pressScale]);

  const handlePressOut = useCallback(() => {
    if (disabled || loading || reduceMotion) return;
    
    createScaleAnimation(pressScale, { toValue: 1 }).start();
  }, [disabled, loading, reduceMotion, pressScale]);

  const handlePress = useCallback(() => {
    if (disabled || loading) return;
    
    triggerHaptic('medium');
    onPress();
  }, [disabled, loading, onPress]);

  const buttonStyles = [
    styles.base,
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${size}Text` as keyof typeof styles],
    disabled && styles.disabledText,
    textStyle,
  ];

  const animatedStyle = {
    transform: [
      { scale: reduceMotion ? 1 : Animated.multiply(pulseScale, pressScale) },
    ],
  };

  const gradientColors = variant === 'primary'
    ? Colors.accent.gradient.blue
    : variant === 'danger'
    ? Colors.accent.gradient.orange
    : variant === 'success'
    ? Colors.accent.gradient.green
    : [Colors.surface.secondary, Colors.surface.tertiary];

  return (
    <Animated.View style={[animatedStyle, buttonStyles]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: disabled || loading }}
        testID={testID}
        style={styles.pressable}
      >
        <LinearGradient
          colors={gradientColors as unknown as readonly [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="small"
                color={Colors.primary.text}
              />
              <Text style={[textStyles, styles.loadingText]}>{title}</Text>
            </View>
          ) : (
            <Text style={textStyles}>{title}</Text>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: DesignTokens.borderRadius.md,
    overflow: 'hidden',
    ...DesignTokens.shadows.md,
  },
  pressable: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: DesignTokens.spacing.md,
  },
  sm: {
    height: DesignTokens.components.button.height.sm,
  },
  md: {
    height: DesignTokens.components.button.height.md,
  },
  lg: {
    height: DesignTokens.components.button.height.lg,
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
  disabledText: {
    color: Colors.interactive.disabled,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.sm,
  },
  loadingText: {
    marginLeft: DesignTokens.spacing.sm,
  },
});

export default PulseButton;
