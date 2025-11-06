import { Animated, Platform, AccessibilityInfo, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
} as const;

export const EASING = {
  easeInOut: Easing.bezier(0.4, 0.0, 0.2, 1),
  easeOut: Easing.bezier(0.0, 0.0, 0.2, 1),
  easeIn: Easing.bezier(0.4, 0.0, 1, 1),
  spring: Easing.bezier(0.175, 0.885, 0.32, 1.275),
  bounce: Easing.bezier(0.68, -0.55, 0.265, 1.55),
} as const;

export const checkReducedMotion = async (): Promise<boolean> => {
  try {
    return await AccessibilityInfo.isReduceMotionEnabled();
  } catch {
    return false;
  }
};

export const triggerHaptic = async (
  style: 'light' | 'medium' | 'heavy' | 'selection' = 'light'
): Promise<void> => {
  if (Platform.OS === 'web') return;
  
  try {
    switch (style) {
      case 'selection':
        await Haptics.selectionAsync();
        break;
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
    }
  } catch {
    // Silently fail
  }
};

export const createPulseAnimation = (
  animatedValue: Animated.Value,
  config?: { duration?: number; toValue?: number }
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: config?.toValue ?? 1.1,
        duration: config?.duration ?? ANIMATION_DURATION.normal,
        easing: EASING.easeInOut,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: config?.duration ?? ANIMATION_DURATION.normal,
        easing: EASING.easeInOut,
        useNativeDriver: true,
      }),
    ])
  );
};

export const createBounceAnimation = (
  animatedValue: Animated.Value,
  config?: { duration?: number; toValue?: number }
): Animated.CompositeAnimation => {
  return Animated.spring(animatedValue, {
    toValue: config?.toValue ?? 1,
    tension: 100,
    friction: 3,
    useNativeDriver: true,
  });
};

export const createFadeAnimation = (
  animatedValue: Animated.Value,
  config?: { duration?: number; toValue?: number; delay?: number }
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: config?.toValue ?? 1,
    duration: config?.duration ?? ANIMATION_DURATION.normal,
    delay: config?.delay ?? 0,
    easing: EASING.easeOut,
    useNativeDriver: true,
  });
};

export const createSlideAnimation = (
  animatedValue: Animated.Value,
  config?: { duration?: number; toValue?: number; delay?: number }
): Animated.CompositeAnimation => {
  return Animated.spring(animatedValue, {
    toValue: config?.toValue ?? 0,
    tension: 80,
    friction: 8,
    delay: config?.delay ?? 0,
    useNativeDriver: true,
  });
};

export const createScaleAnimation = (
  animatedValue: Animated.Value,
  config?: { duration?: number; toValue?: number }
): Animated.CompositeAnimation => {
  return Animated.spring(animatedValue, {
    toValue: config?.toValue ?? 1,
    tension: 300,
    friction: 10,
    useNativeDriver: true,
  });
};

export const createRippleAnimation = (
  scale: Animated.Value,
  opacity: Animated.Value,
  config?: { duration?: number }
): Animated.CompositeAnimation => {
  return Animated.parallel([
    Animated.timing(scale, {
      toValue: 6,
      duration: config?.duration ?? 600,
      easing: EASING.easeOut,
      useNativeDriver: true,
    }),
    Animated.timing(opacity, {
      toValue: 0,
      duration: config?.duration ?? 600,
      easing: EASING.easeOut,
      useNativeDriver: true,
    }),
  ]);
};

export const createRotateAnimation = (
  animatedValue: Animated.Value,
  config?: { duration?: number }
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: config?.duration ?? 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  );
};

export const interpolateRotation = (animatedValue: Animated.Value): Animated.AnimatedInterpolation<string | number> => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
};

export const calculateStaggerDelay = (index: number, baseDelay: number = 80): number => {
  return Math.min(index * baseDelay, 800);
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};
