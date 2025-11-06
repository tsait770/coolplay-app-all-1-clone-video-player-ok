import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Colors from '@/constants/colors';
// import { DesignTokens } from '@/constants/designTokens';

export interface CircularProgressProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Apple Watch-inspired Circular Progress Component
 * Features:
 * - Smooth circular progress animation
 * - Customizable colors and stroke width
 * - Support for content inside the circle
 * - Apple Watch activity ring style
 */
export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = Colors.accent.primary,
  backgroundColor = Colors.surface.tertiary,
  children,
  style,
  testID,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <View style={[styles.container, { width: size, height: size }, style]} testID={testID}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
};

/**
 * Apple Watch Activity Rings Component
 * Replicates the iconic three-ring design from Apple Watch
 */
export interface ActivityRingsProps {
  moveProgress: number; // 0 to 1
  exerciseProgress: number; // 0 to 1
  standProgress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  style?: ViewStyle;
  testID?: string;
}

export const ActivityRings: React.FC<ActivityRingsProps> = ({
  moveProgress,
  exerciseProgress,
  standProgress,
  size = 120,
  strokeWidth = 6,
  style,
  testID,
}) => {
  const spacing = strokeWidth + 4;
  
  return (
    <View style={[styles.activityContainer, { width: size, height: size }, style]} testID={testID}>
      {/* Move ring (outer, red) */}
      <CircularProgress
        progress={moveProgress}
        size={size}
        strokeWidth={strokeWidth}
        color={Colors.watch.activity.move}
        backgroundColor={Colors.surface.tertiary}
        style={styles.ring}
      />
      
      {/* Exercise ring (middle, green) */}
      <CircularProgress
        progress={exerciseProgress}
        size={size - spacing * 2}
        strokeWidth={strokeWidth}
        color={Colors.watch.activity.exercise}
        backgroundColor={Colors.surface.tertiary}
        style={[styles.ring, { position: 'absolute', top: spacing, left: spacing }]}
      />
      
      {/* Stand ring (inner, blue) */}
      <CircularProgress
        progress={standProgress}
        size={size - spacing * 4}
        strokeWidth={strokeWidth}
        color={Colors.watch.activity.stand}
        backgroundColor={Colors.surface.tertiary}
        style={[styles.ring, { position: 'absolute', top: spacing * 2, left: spacing * 2 }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  content: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  activityContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
  },
});

export default CircularProgress;