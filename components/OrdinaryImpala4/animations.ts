import { Platform } from 'react-native';

export interface AnimationConfig {
  enableStagger?: boolean;
  staggerDelay?: number;
  enableRipple?: boolean;
  enableHaptics?: boolean;
  respectReducedMotion?: boolean;
}

export const defaultAnimationConfig: AnimationConfig = {
  enableStagger: true,
  staggerDelay: 80,
  enableRipple: true,
  enableHaptics: Platform.OS !== 'web',
  respectReducedMotion: true,
};

class AnimationPerformanceMonitor {
  private activeAnimations = new Set<string>();
  private maxConcurrentAnimations = 10;

  startAnimation(id: string): boolean {
    if (this.activeAnimations.size >= this.maxConcurrentAnimations) {
      console.warn('Maximum concurrent animations reached, skipping animation:', id);
      return false;
    }
    this.activeAnimations.add(id);
    return true;
  }

  endAnimation(id: string): void {
    this.activeAnimations.delete(id);
  }

  getActiveCount(): number {
    return this.activeAnimations.size;
  }

  reset(): void {
    this.activeAnimations.clear();
  }
}

export const performanceMonitor = new AnimationPerformanceMonitor();

export const easing = {
  easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
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

export const cleanupAnimations = (): void => {
  performanceMonitor.reset();
};

export const initImpalaAnimations = (
  container: Document | Element,
  config: AnimationConfig = defaultAnimationConfig
): (() => void) => {
  console.log('Initializing Impala animations with config:', config);

  const cleanup = () => {
    cleanupAnimations();
  };

  if (Platform.OS === 'web') {
    console.log('Web-specific animation initialization complete');
  }

  return cleanup;
};

export default {
  initImpalaAnimations,
  performanceMonitor,
  easing,
  calculateStaggerDelay,
  throttle,
  debounce,
  cleanupAnimations,
};