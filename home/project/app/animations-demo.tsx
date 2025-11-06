import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  PulseButton,
  GradientButton,
  RippleButton,
  HoverCard,
  GlowCard,
  SpinLoader,
  DotsLoader,
} from '@/components/uiverse';

export default function AnimationsDemo() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen
        options={{
          title: '動畫效果展示',
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
          <Text style={styles.sectionTitle}>動畫按鈕</Text>
          <Text style={styles.sectionDesc}>點擊按鈕查看不同的動畫效果</Text>
          
          <View style={styles.buttonGroup}>
            <PulseButton 
              onPress={() => console.log('Pulse pressed')}
              testID="pulse-button"
            >
              <Text>脈衝按鈕</Text>
            </PulseButton>
          </View>

          <View style={styles.buttonGroup}>
            <GradientButton 
              onPress={() => console.log('Gradient pressed')}
              testID="gradient-button"
            >
              <Text>漸變按鈕</Text>
            </GradientButton>
          </View>

          <View style={styles.buttonGroup}>
            <RippleButton 
              onPress={() => console.log('Ripple pressed')}
              testID="ripple-button"
            >
              <Text>水波紋按鈕</Text>
            </RippleButton>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>動畫卡片</Text>
          <Text style={styles.sectionDesc}>點擊卡片查看互動效果</Text>
          
          <View style={styles.cardGroup}>
            <HoverCard 
              onPress={() => console.log('Hover card pressed')}
              testID="hover-card"
            >
              <Text style={styles.cardTitle}>懸停卡片</Text>
              <Text style={styles.cardText}>
                點擊時會放大並增加陰影效果，提供視覺回饋
              </Text>
            </HoverCard>
          </View>

          <View style={styles.cardGroup}>
            <GlowCard testID="glow-card">
              <Text style={styles.cardTitle}>發光卡片</Text>
              <Text style={styles.cardText}>
                持續的發光動畫效果，吸引用戶注意
              </Text>
            </GlowCard>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>載入動畫</Text>
          <Text style={styles.sectionDesc}>用於顯示載入狀態</Text>
          
          <View style={styles.loaderGroup}>
            <View style={styles.loaderItem}>
              <SpinLoader size={50} color="#667eea" />
              <Text style={styles.loaderLabel}>旋轉載入</Text>
            </View>

            <View style={styles.loaderItem}>
              <DotsLoader size={14} color="#764ba2" />
              <Text style={styles.loaderLabel}>點點載入</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>組合示例</Text>
          <Text style={styles.sectionDesc}>多種動畫效果的組合應用</Text>
          
          <HoverCard 
            onPress={() => console.log('Combined card pressed')}
            testID="combined-card"
          >
            <Text style={styles.cardTitle}>完整功能卡片</Text>
            <Text style={styles.cardText}>
              這是一個結合多種動畫效果的卡片示例，包含懸停效果和按鈕動畫
            </Text>
            <View style={styles.cardActions}>
              <RippleButton 
                onPress={() => console.log('Action 1')}
                testID="action-button"
              >
                <Text>執行操作</Text>
              </RippleButton>
            </View>
          </HoverCard>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 使用提示</Text>
          <Text style={styles.infoText}>
            • 所有動畫都使用 React Native Animated API{'\n'}
            • 支援 iOS、Android 和 Web 平台{'\n'}
            • 可自定義顏色、大小和動畫參數{'\n'}
            • 性能優化，使用 useNativeDriver
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
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a202c',
    marginBottom: 8,
  },
  sectionDesc: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 16,
  },
  buttonGroup: {
    marginBottom: 16,
  },
  cardGroup: {
    marginBottom: 16,
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
  cardActions: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  loaderGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  loaderItem: {
    alignItems: 'center',
    gap: 12,
  },
  loaderLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 8,
  },
  infoBox: {
    backgroundColor: '#edf2f7',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#2d3748',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 22,
  },
});
