import React, { useRef, useState, useCallback, useEffect } from 'react';
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
  createScaleAnimation,
  triggerHaptic,
  checkReducedMotion,
} from '../utils/animations';

export const GradientButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  testID = 'gradient-button',
  accessibilityLabel,
  accessibilityHint,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const shadowOpacity = useRef(new Animated.Value(0.12)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    checkReducedMotion().then(setReduceMotion);
  }, []);

  const handlePressIn = useCallback(() => {
    if (disabled || loading || reduceMotion) return;
    
    triggerHaptic('light');
    
    Animated.parallel([
      createScaleAnimation(scale, { toValue: 0.96 }),
      Animated.timing(shadowOpacity, {
        toValue: 0.2,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  }, [disabled, loading, reduceMotion, scale, shadowOpacity]);

  const handlePressOut = useCallback(() => {
    if (disabled || loading || reduceMotion) return;
    
    Animated.parallel([
      createScaleAnimation(scale, { toValue: 1 }),
      Animated.timing(shadowOpacity, {
        toValue: 0.12,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [disabled, loading, reduceMotion, scale, shadowOpacity]);

  const handlePress = useCallback(() => {
    if (disabled || loading) return;
    
    triggerHaptic('medium');
    onPress();
  }, [disabled, loading, onPress]);

  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return Colors.accent.gradient.blue;
      case 'danger':
        return Colors.accent.gradient.orange;
      case 'success':
        return Colors.accent.gradient.green;
      case 'secondary':
        return [Colors.surface.secondary, Colors.surface.tertiary];
      default:
        return Colors.accent.gradient.blue;
    }
  };

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
    transform: [{ scale: reduceMotion ? 1 : scale }],
    shadowOpacity: reduceMotion ? 0.12 : shadowOpacity,
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.contentContainer}>
          <ActivityIndicator size="small" color={Colors.primary.text} />
          <Text style={[textStyles, styles.loadingText]}>{title}</Text>
        </View>
      );
    }

    if (icon) {
      return (
        <View style={styles.contentContainer}>
          {iconPosition === 'left' && <View style={styles.iconLeft}><Text>{icon}</Text></View>}
          <Text style={textStyles}>{title}</Text>
          {iconPosition === 'right' && <View style={styles.iconRight}><Text>{icon}</Text></View>}
        </View>
      );
    }

    return <Text style={textStyles}>{title}</Text>;
  };

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
          colors={getGradientColors() as unknown as readonly [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {renderContent()}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: DesignTokens.borderRadius.md,
    overflow: 'hidden',
    shadowColor: Colors.card.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
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
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: DesignTokens.spacing.sm,
  },
  iconRight: {
    marginLeft: DesignTokens.spacing.sm,
  },
  loadingText: {
    marginLeft: DesignTokens.spacing.sm,
  },
});

export default GradientButton;
