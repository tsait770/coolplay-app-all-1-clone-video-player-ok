import { Animated, Easing } from 'react-native';

export const createPulseAnimation = (animatedValue: Animated.Value) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.1,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  );
};

export const createRippleAnimation = (
  scaleValue: Animated.Value,
  opacityValue: Animated.Value
) => {
  return Animated.parallel([
    Animated.timing(scaleValue, {
      toValue: 6,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }),
    Animated.timing(opacityValue, {
      toValue: 0,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }),
  ]);
};

export const createSpinAnimation = (animatedValue: Animated.Value) => {
  return Animated.loop(
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  );
};

export const createBounceAnimation = (animatedValue: Animated.Value) => {
  return Animated.spring(animatedValue, {
    toValue: 1,
    friction: 3,
    tension: 40,
    useNativeDriver: true,
  });
};

export const createFadeInAnimation = (
  animatedValue: Animated.Value,
  duration: number = 300
) => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    easing: Easing.ease,
    useNativeDriver: true,
  });
};

export const createSlideInAnimation = (
  animatedValue: Animated.Value,
  duration: number = 400
) => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  });
};
