import { ViewStyle, TextStyle } from 'react-native';
import React from "react";

export interface BaseAnimatedComponentProps {
  testID?: string;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface AnimatedButtonProps extends BaseAnimatedComponentProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export interface AnimatedCardProps extends BaseAnimatedComponentProps {
  title: string;
  description?: string;
  imageUri?: string;
  onPress?: () => void;
  variant?: 'default' | 'compact' | 'featured' | 'elevated';
  children?: React.ReactNode;
  index?: number;
}

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  useNativeDriver?: boolean;
  enableHaptics?: boolean;
  respectReducedMotion?: boolean;
}

export type AnimationPreset = 
  | 'fade'
  | 'scale'
  | 'slide'
  | 'bounce'
  | 'pulse'
  | 'rotate'
  | 'flip';

export interface LoaderProps extends BaseAnimatedComponentProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  animating?: boolean;
}
