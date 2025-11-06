import React from "react";
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export interface ButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  testID?: string;
}

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  testID?: string;
}

export interface LoaderProps {
  size?: number;
  color?: string;
}
