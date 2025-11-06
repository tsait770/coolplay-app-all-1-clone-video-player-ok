import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import Colors from '@/constants/colors';
import { DesignTokens } from '@/constants/designTokens';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Apple Watch-inspired Card Component
 * Features:
 * - Multiple visual variants (default, elevated, outlined, filled)
 * - Consistent padding and spacing system
 * - Optional press interaction
 * - Customizable border radius
 * - Accessibility support
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  margin = 'none',
  borderRadius = 'md',
  onPress,
  disabled = false,
  style,
  testID,
}) => {
  const cardStyles = [
    styles.base,
    styles[variant],
    padding !== 'none' && styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}` as keyof typeof styles],
    margin !== 'none' && styles[`margin${margin.charAt(0).toUpperCase() + margin.slice(1)}` as keyof typeof styles],
    borderRadius !== 'none' && styles[`radius${borderRadius.charAt(0).toUpperCase() + borderRadius.slice(1)}` as keyof typeof styles],
    onPress && styles.pressable,
    disabled && styles.disabled,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        testID={testID}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles} testID={testID}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  // Base styles
  base: {
    backgroundColor: Colors.card.bg,
    borderWidth: 0,
  },

  // Variant styles
  default: {
    backgroundColor: Colors.card.bg,
  },
  elevated: {
    backgroundColor: Colors.card.bg,
    ...DesignTokens.shadows.md,
  },
  outlined: {
    backgroundColor: Colors.card.bg,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  filled: {
    backgroundColor: Colors.surface.secondary,
  },

  // Padding variants
  paddingSm: {
    padding: DesignTokens.components.card.padding.sm,
  },
  paddingMd: {
    padding: DesignTokens.components.card.padding.md,
  },
  paddingLg: {
    padding: DesignTokens.components.card.padding.lg,
  },
  paddingXl: {
    padding: DesignTokens.components.card.padding.xl,
  },

  // Margin variants
  marginSm: {
    margin: DesignTokens.spacing.sm,
  },
  marginMd: {
    margin: DesignTokens.spacing.md,
  },
  marginLg: {
    margin: DesignTokens.spacing.lg,
  },
  marginXl: {
    margin: DesignTokens.spacing.xl,
  },

  // Border radius variants
  radiusSm: {
    borderRadius: DesignTokens.borderRadius.sm,
  },
  radiusMd: {
    borderRadius: DesignTokens.borderRadius.md,
  },
  radiusLg: {
    borderRadius: DesignTokens.borderRadius.lg,
  },
  radiusXl: {
    borderRadius: DesignTokens.borderRadius.xl,
  },
  radiusFull: {
    borderRadius: DesignTokens.borderRadius.full,
  },

  // Interactive styles
  pressable: {
    // Add subtle visual feedback for pressable cards
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Card;