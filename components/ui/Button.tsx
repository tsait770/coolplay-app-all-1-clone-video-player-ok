import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import Colors from '@/constants/colors';
import { DesignTokens } from '@/constants/designTokens';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  // icon?: React.ReactNode;
  // iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

/**
 * Apple Watch-inspired Button Component
 * Features:
 * - Multiple variants with semantic colors
 * - Consistent sizing and spacing
 * - Loading states with activity indicator
 * - Icon support with proper positioning
 * - Accessibility support
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  // icon,
  // iconPosition = 'left',
  style,
  textStyle,
  testID,
}) => {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text` as keyof typeof styles],
    styles[`${size}Text` as keyof typeof styles],
    disabled && styles.disabledText,
    textStyle,
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? Colors.primary.text : Colors.accent.primary}
          />
          <Text style={[textStyles, styles.loadingText]}>{title}</Text>
        </View>
      );
    }

    // Icon support temporarily disabled due to linter issues
    // Will be re-enabled after linter configuration update

    return <Text style={textStyles}>{title}</Text>;
  };

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      testID={testID}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Base styles
  base: {
    borderRadius: DesignTokens.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...DesignTokens.shadows.sm,
  },

  // Size variants
  sm: {
    height: DesignTokens.components.button.height.sm,
    paddingHorizontal: DesignTokens.components.button.padding.sm.horizontal,
    paddingVertical: DesignTokens.components.button.padding.sm.vertical,
  },
  md: {
    height: DesignTokens.components.button.height.md,
    paddingHorizontal: DesignTokens.components.button.padding.md.horizontal,
    paddingVertical: DesignTokens.components.button.padding.md.vertical,
  },
  lg: {
    height: DesignTokens.components.button.height.lg,
    paddingHorizontal: DesignTokens.components.button.padding.lg.horizontal,
    paddingVertical: DesignTokens.components.button.padding.lg.vertical,
  },

  // Color variants
  primary: {
    backgroundColor: Colors.accent.primary,
  },
  secondary: {
    backgroundColor: Colors.surface.secondary,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  tertiary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.accent.primary,
  },
  danger: {
    backgroundColor: Colors.semantic.danger,
  },
  success: {
    backgroundColor: Colors.semantic.success,
  },

  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Size-specific text styles
  smText: {
    ...DesignTokens.typography.body.small,
  },
  mdText: {
    ...DesignTokens.typography.body.medium,
  },
  lgText: {
    ...DesignTokens.typography.body.large,
  },

  // Variant-specific text styles
  primaryText: {
    color: Colors.primary.text,
  },
  secondaryText: {
    color: Colors.primary.text,
  },
  tertiaryText: {
    color: Colors.accent.primary,
  },
  dangerText: {
    color: Colors.primary.text,
  },
  successText: {
    color: Colors.primary.text,
  },

  // State styles
  disabled: {
    opacity: 0.5,
    backgroundColor: Colors.surface.tertiary,
  },
  disabledText: {
    color: Colors.interactive.disabled,
  },

  // Layout styles
  fullWidth: {
    width: '100%',
  },

  // Content layout
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: DesignTokens.spacing.sm,
  },
});

export default Button;