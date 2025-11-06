/**
 * Apple Watch-inspired UI Component Library
 * 
 * This library provides a comprehensive set of UI components
 * designed with Apple Watch design principles in mind:
 * - Clean, minimal aesthetics
 * - Consistent spacing and typography
 * - Accessible color contrast
 * - Smooth animations and interactions
 * - Responsive design patterns
 */

// Core UI Components
export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Card } from './Card';
export type { CardProps } from './Card';

export { CircularProgress, ActivityRings } from './CircularProgress';
export type { CircularProgressProps, ActivityRingsProps } from './CircularProgress';

// Design System Exports
export { default as Colors } from '@/constants/colors';
export { DesignTokens, getResponsiveValue, spacing, createShadow } from '@/constants/designTokens';

// Component Usage Examples:
/*
// Button Examples:
<Button title="Primary Action" onPress={() => {}} variant="primary" />
<Button title="Secondary" onPress={() => {}} variant="secondary" size="sm" />
<Button title="Loading..." onPress={() => {}} loading={true} />

// Card Examples:
<Card variant="elevated" padding="lg">
  <Text>Card content</Text>
</Card>

<Card variant="outlined" onPress={() => {}} padding="md">
  <Text>Pressable card</Text>
</Card>

// Progress Examples:
<CircularProgress progress={0.75} color={Colors.accent.primary} />

<ActivityRings 
  moveProgress={0.8} 
  exerciseProgress={0.6} 
  standProgress={0.9} 
/>
*/