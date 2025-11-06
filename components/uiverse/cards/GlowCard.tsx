import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  Animated,
  Pressable,
  Text,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { DesignTokens } from '@/constants/designTokens';
import { AnimatedCardProps } from '../utils/types';
import {
  triggerHaptic,
  checkReducedMotion,
  ANIMATION_DURATION,
} from '../utils/animations';

export const GlowCard: React.FC<AnimatedCardProps> = ({
  title,
  description,
  onPress,
  variant = 'default',
  children,
  disabled = false,
  style,
  testID = 'glow-card',
  accessibilityLabel,
}) => {
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [reduceMotion, setReduceMotion] = useState(false);
  const glowAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const { width: screenWidth } = useWindowDimensions();

  useEffect(() => {
    checkReducedMotion().then(setReduceMotion);
  }, []);

  useEffect(() => {
    if (disabled || reduceMotion) {
      glowAnimation.current?.stop();
      return;
    }

    glowAnimation.current = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.6,
          duration: ANIMATION_DURATION.slower,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.3,
          duration: ANIMATION_DURATION.slower,
          useNativeDriver: true,
        }),
      ])
    );
    glowAnimation.current.start();

    return () => {
      glowAnimation.current?.stop();
    };
  }, [disabled, reduceMotion, glowOpacity]);

  const handlePressIn = useCallback(() => {
    if (disabled || reduceMotion) return;
    
    triggerHaptic('light');
    
    Animated.spring(scale, {
      toValue: 0.98,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [disabled, reduceMotion, scale]);

  const handlePressOut = useCallback(() => {
    if (disabled || reduceMotion) return;
    
    Animated.spring(scale, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [disabled, reduceMotion, scale]);

  const handlePress = useCallback(() => {
    if (disabled) return;
    
    triggerHaptic('medium');
    onPress?.();
  }, [disabled, onPress]);

  const cardWidth = screenWidth - (DesignTokens.spacing.md * 2);

  const cardStyles = [
    styles.card,
    { width: cardWidth },
    variant === 'featured' && styles.cardFeatured,
    disabled && styles.cardDisabled,
    style,
  ];

  const animatedStyle = {
    transform: [{ scale: reduceMotion ? 1 : scale }],
  };

  const glowStyle = {
    opacity: reduceMotion ? 0 : glowOpacity,
  };

  return (
    <Animated.View style={[animatedStyle, styles.container]}>
      <Pressable
        style={cardStyles}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || !onPress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || `${title}. ${description || ''}`}
        accessibilityState={{ disabled }}
        testID={testID}
      >
        <Animated.View style={[styles.glowContainer, glowStyle]}>
          <LinearGradient
            colors={Colors.accent.gradient.blue as unknown as readonly [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.glow}
          />
        </Animated.View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {description && (
            <Text style={styles.description} numberOfLines={3}>
              {description}
            </Text>
          )}
          {children}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: DesignTokens.spacing.xs,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: Colors.card.bg,
    borderRadius: DesignTokens.borderRadius.lg,
    padding: DesignTokens.components.card.padding.md,
    borderWidth: 1,
    borderColor: Colors.card.border,
    position: 'relative',
    overflow: 'hidden',
  },
  cardFeatured: {
    padding: DesignTokens.components.card.padding.lg,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  glowContainer: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: DesignTokens.borderRadius.lg,
  },
  glow: {
    flex: 1,
    borderRadius: DesignTokens.borderRadius.lg,
  },
  content: {
    gap: DesignTokens.spacing.xs,
    zIndex: 1,
  },
  title: {
    ...DesignTokens.typography.title.medium,
    color: Colors.primary.text,
  },
  description: {
    ...DesignTokens.typography.body.medium,
    color: Colors.primary.textSecondary,
    lineHeight: 22,
  },
});

export default GlowCard;
