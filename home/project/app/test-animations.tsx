import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function TestAnimations() {
  const insets = useSafeAreaInsets();
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    const createDotAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createDotAnimation(dot1Anim, 0).start();
    createDotAnimation(dot2Anim, 150).start();
    createDotAnimation(dot3Anim, 300).start();
  }, [pulseAnim, spinAnim, glowAnim, dot1Anim, dot2Anim, dot3Anim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(102, 126, 234, 0.3)', 'rgba(118, 75, 162, 0.6)'],
  });

  const createDotStyle = (animValue: Animated.Value) => ({
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#764ba2',
    opacity: animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
    transform: [
      {
        scale: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1.2],
        }),
      },
    ],
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: '動畫效果測試',
          headerStyle: { backgroundColor: '#667eea' },
          headerTintColor: '#fff',
        }}
      />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 20 }
        ]}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>脈衝按鈕</Text>
          <TouchableOpacity activeOpacity={0.8}>
            <Animated.View
              style={[
                styles.pulseButton,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Text style={styles.buttonText}>點擊我</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>漸變按鈕</Text>
          <TouchableOpacity activeOpacity={0.9}>
            <View style={styles.gradientContainer}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              >
                <Text style={styles.buttonText}>漸變效果</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>旋轉載入</Text>
          <View style={styles.loaderContainer}>
            <Animated.View
              style={[
                styles.spinner,
                { transform: [{ rotate: spin }] },
              ]}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>點點載入</Text>
          <View style={styles.dotsContainer}>
            <Animated.View style={createDotStyle(dot1Anim)} />
            <Animated.View style={[createDotStyle(dot2Anim), { marginHorizontal: 14 }]} />
            <Animated.View style={createDotStyle(dot3Anim)} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>發光卡片</Text>
          <Animated.View
            style={[
              styles.glowCard,
              { shadowColor: glowColor },
            ]}
          >
            <Text style={styles.cardTitle}>發光效果</Text>
            <Text style={styles.cardText}>
              這個卡片有持續的發光動畫效果
            </Text>
          </Animated.View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>✨ 動畫效果說明</Text>
          <Text style={styles.infoText}>
            • 脈衝按鈕：持續的縮放動畫{'\n'}
            • 漸變按鈕：漂亮的顏色漸變{'\n'}
            • 旋轉載入：360度旋轉動畫{'\n'}
            • 點點載入：交錯的淡入淡出{'\n'}
            • 發光卡片：動態陰影顏色變化
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1a202c',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  pulseButton: {
    backgroundColor: '#3ca7ff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#3ca7ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
  loaderContainer: {
    paddingVertical: 20,
  },
  spinner: {
    width: 50,
    height: 50,
    borderWidth: 3,
    borderRadius: 25,
    borderColor: '#667eea',
    borderTopColor: 'transparent',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  glowCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1a202c',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#e6fffa',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#38b2ac',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#234e52',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#2c7a7b',
    lineHeight: 22,
  },
});
