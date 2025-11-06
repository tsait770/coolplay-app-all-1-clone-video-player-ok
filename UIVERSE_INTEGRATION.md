# Uiverse.io Integration Guide

## Overview

This project integrates animated UI components from [Uiverse.io](https://uiverse.io), the world's largest open-source UI library with 6,000+ free elements. All components are adapted for React Native/Expo with full cross-platform support.

## 🎯 Project Goals

Based on your requirements, this integration provides:

1. **Complete Animation System** - All button, card, and navigation animations from Uiverse.io
2. **Apple Watch Design Language** - Consistent with your existing design tokens
3. **Cross-Platform Support** - Works on iOS, Android, and Web
4. **Performance Optimized** - Uses native driver, respects reduced motion
5. **Accessibility First** - Full screen reader and keyboard support

## 📁 Project Structure

```
components/uiverse/
├── README.md                 # Component library documentation
├── buttons/                  # Animated button components
│   ├── PulseButton.tsx      # Pulsing animation button
│   ├── GradientButton.tsx   # Gradient with scale effects
│   ├── RippleButton.tsx     # Material-style ripple effect
│   └── index.ts
├── cards/                    # Animated card components
│   ├── HoverCard.tsx        # Scale and lift on hover
│   ├── GlowCard.tsx         # Pulsing glow border effect
│   └── index.ts
├── loaders/                  # Loading animations
│   ├── SpinLoader.tsx       # Rotating spinner
│   ├── DotsLoader.tsx       # Animated dots
│   └── index.ts
└── utils/                    # Shared utilities
    ├── animations.ts         # Animation helpers
    └── types.ts             # TypeScript types
```

## 🚀 Quick Start

### 1. View the Demo

```bash
# Navigate to the demo page in your app
/uiverse-demo
```

Or add a link to your navigation:

```tsx
import { Link } from 'expo-router';

<Link href="/uiverse-demo">View Uiverse Components</Link>
```

### 2. Import Components

```tsx
import {
  PulseButton,
  GradientButton,
  RippleButton,
  HoverCard,
  GlowCard,
  SpinLoader,
  DotsLoader,
} from '@/components/uiverse';
```

### 3. Use in Your App

```tsx
// Animated Button
<PulseButton
  title="Click Me"
  onPress={() => console.log('Pressed')}
  variant="primary"
  size="md"
  fullWidth
/>

// Animated Card
<HoverCard
  title="Beautiful Card"
  description="This card has smooth animations"
  imageUri="https://images.unsplash.com/photo-..."
  onPress={() => console.log('Card pressed')}
  variant="featured"
  index={0}
/>

// Loading Indicator
<SpinLoader size="md" color={Colors.accent.primary} />
```

## 🎨 Available Components

### Buttons

#### PulseButton
- Continuous pulsing animation
- Scale effect on press
- Gradient background
- Haptic feedback

```tsx
<PulseButton
  title="Pulse Button"
  onPress={handlePress}
  variant="primary" // primary | secondary | danger | success
  size="md"         // sm | md | lg
  loading={false}
  disabled={false}
  fullWidth={true}
/>
```

#### GradientButton
- Smooth gradient background
- Scale and shadow on press
- Icon support
- Loading state

```tsx
<GradientButton
  title="Gradient Button"
  onPress={handlePress}
  variant="primary"
  icon={<Icon />}
  iconPosition="left" // left | right
  loading={false}
/>
```

#### RippleButton
- Material Design ripple effect
- Touch position tracking
- Solid color variants
- Accessibility optimized

```tsx
<RippleButton
  title="Ripple Button"
  onPress={handlePress}
  variant="success"
  size="md"
/>
```

### Cards

#### HoverCard
- Entrance animation with stagger
- Scale and lift on press
- Image zoom effect
- Shadow animation

```tsx
<HoverCard
  title="Card Title"
  description="Card description"
  imageUri="https://..."
  onPress={handlePress}
  variant="default" // default | compact | featured | elevated
  index={0}         // For stagger animation
/>
```

#### GlowCard
- Pulsing glow border
- Gradient animation
- Scale on press
- Featured styling

```tsx
<GlowCard
  title="Glow Card"
  description="This card glows"
  onPress={handlePress}
  variant="featured"
>
  <CustomContent />
</GlowCard>
```

### Loaders

#### SpinLoader
- Rotating spinner
- Customizable size and color
- Smooth animation

```tsx
<SpinLoader
  size="md"    // sm | md | lg
  color={Colors.accent.primary}
  animating={true}
/>
```

#### DotsLoader
- Three animated dots
- Staggered animation
- Customizable appearance

```tsx
<DotsLoader
  size="md"
  color={Colors.accent.primary}
  animating={true}
/>
```

## 🎭 Animation Features

All components include:

- ✅ **Reduced Motion Support** - Respects `prefers-reduced-motion`
- ✅ **Haptic Feedback** - Tactile response on mobile
- ✅ **Native Driver** - GPU-accelerated animations
- ✅ **Stagger Effects** - Sequential entrance animations
- ✅ **Performance Monitoring** - Limits concurrent animations
- ✅ **Web Compatibility** - Works on React Native Web

## 🎨 Customization

### Using Design Tokens

All components use your existing design tokens:

```tsx
import { DesignTokens } from '@/constants/designTokens';

<PulseButton
  style={{
    borderRadius: DesignTokens.borderRadius.xl,
    marginVertical: DesignTokens.spacing.md,
  }}
  textStyle={{
    fontSize: DesignTokens.typography.body.large.fontSize,
  }}
/>
```

### Custom Colors

```tsx
import Colors from '@/constants/colors';

<GradientButton
  variant="primary"
  // Uses Colors.accent.gradient.blue
/>

<SpinLoader
  color={Colors.accent.primary}
/>
```

### Custom Animations

```tsx
import { createPulseAnimation, ANIMATION_DURATION } from '@/components/uiverse';

const myAnimation = createPulseAnimation(animatedValue, {
  duration: ANIMATION_DURATION.slow,
  toValue: 1.2,
});
```

## ♿ Accessibility

All components include:

- Proper `accessibilityRole` and `accessibilityLabel`
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators
- Disabled state handling

```tsx
<PulseButton
  title="Submit"
  accessibilityLabel="Submit form"
  accessibilityHint="Double tap to submit the form"
  accessibilityRole="button"
/>
```

## 🔧 Advanced Usage

### Animation Utilities

```tsx
import {
  createPulseAnimation,
  createBounceAnimation,
  createFadeAnimation,
  createSlideAnimation,
  createScaleAnimation,
  createRippleAnimation,
  createRotateAnimation,
  triggerHaptic,
  checkReducedMotion,
  calculateStaggerDelay,
} from '@/components/uiverse';

// Check reduced motion preference
const reduceMotion = await checkReducedMotion();

// Trigger haptic feedback
await triggerHaptic('medium'); // light | medium | heavy | selection

// Calculate stagger delay for list items
const delay = calculateStaggerDelay(index, 80);
```

### Custom Component Example

```tsx
import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { createPulseAnimation } from '@/components/uiverse';

const MyCustomComponent = () => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = createPulseAnimation(scale);
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      {/* Your content */}
    </Animated.View>
  );
};
```

## 📊 Performance

### Best Practices

1. **Use Native Driver** - All transform/opacity animations use native driver
2. **Limit Concurrent Animations** - Performance monitor prevents too many simultaneous animations
3. **Throttle Handlers** - Scroll and gesture handlers are throttled
4. **Lazy Loading** - Heavy components load on demand

### Performance Monitoring

```tsx
import { performanceMonitor } from '@/components/uiverse';

// Check active animations
const count = performanceMonitor.getActiveCount();

// Reset if needed
performanceMonitor.reset();
```

## 🌐 Web Compatibility

All components work on React Native Web with automatic fallbacks:

- Haptics disabled on web
- Touch events adapted for mouse
- Reduced motion detection
- CSS-compatible animations

## 📚 Resources

- [Uiverse.io](https://uiverse.io) - Browse 6,000+ components
- [Uiverse GitHub](https://github.com/uiverse-io/galaxy) - Source code
- [Uiverse Discord](https://discord.gg/KD8ba2uUpT) - Community support

## 🔄 Integration with Existing App

### Replace Existing Buttons

```tsx
// Before
import { Button } from '@/components/ui/Button';

// After
import { PulseButton } from '@/components/uiverse';

// Usage is similar
<PulseButton
  title="Submit"
  onPress={handleSubmit}
  variant="primary"
/>
```

### Enhance Existing Cards

```tsx
// Wrap your existing card content
import { HoverCard } from '@/components/uiverse';

<HoverCard
  title="My Card"
  description="Description"
  onPress={handlePress}
>
  <YourExistingCardContent />
</HoverCard>
```

## 🎯 Next Steps

1. **Explore the Demo** - Visit `/uiverse-demo` to see all components
2. **Replace Components** - Gradually replace existing UI with animated versions
3. **Customize** - Adjust colors, sizes, and animations to match your brand
4. **Add More** - Browse Uiverse.io and adapt more components as needed

## 🐛 Troubleshooting

### Animations Not Working

- Check if `reduceMotion` is enabled in accessibility settings
- Verify `useNativeDriver: true` is set for transform/opacity
- Ensure animations are cleaned up in `useEffect` return

### Performance Issues

- Limit number of animated components on screen
- Use `React.memo()` for list items
- Check `performanceMonitor.getActiveCount()`

### Web-Specific Issues

- Haptics won't work (expected behavior)
- Use Platform checks for mobile-only features
- Test in both mobile and web environments

## 📝 License

Components adapted from Uiverse.io (open-source, free for personal and commercial use).

## 🤝 Contributing

To add more Uiverse components:

1. Browse [Uiverse.io](https://uiverse.io)
2. Adapt CSS animations to React Native Animated API
3. Follow existing component patterns
4. Add TypeScript types
5. Include accessibility features
6. Test on iOS, Android, and Web

---

**Built with ❤️ using React Native, Expo, and TypeScript**
