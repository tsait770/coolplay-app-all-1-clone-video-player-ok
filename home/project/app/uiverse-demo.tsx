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

export default function UniverseDemo() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Uiverse 動畫展示',
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
          
          <View style={styles.buttonGroup}>
            <PulseButton onPress={() => console.log('Pulse pressed')}>
              <Text>脈衝按鈕</Text>
            </PulseButton>
          </View>

          <View style={styles.buttonGroup}>
            <GradientButton onPress={() => console.log('Gradient pressed')}>
              <Text>漸變按鈕</Text>
            </GradientButton>
          </View>

          <View style={styles.buttonGroup}>
            <RippleButton onPress={() => console.log('Ripple pressed')}>
              <Text>水波紋按鈕</Text>
            </RippleButton>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>動畫卡片</Text>
          
          <View style={styles.cardGroup}>
            <HoverCard onPress={() => console.log('Hover card pressed')}>
              <Text style={styles.cardTitle}>懸停卡片</Text>
              <Text style={styles.cardText}>
                點擊時會放大並增加陰影效果
              </Text>
            </HoverCard>
          </View>

          <View style={styles.cardGroup}>
            <GlowCard>
              <Text style={styles.cardTitle}>發光卡片</Text>
              <Text style={styles.cardText}>
                持續的發光動畫效果
              </Text>
            </GlowCard>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>載入動畫</Text>
          
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
          
          <HoverCard onPress={() => console.log('Combined card pressed')}>
            <Text style={styles.cardTitle}>完整功能卡片</Text>
            <Text style={styles.cardText}>
              這是一個結合多種動畫效果的卡片示例
            </Text>
            <View style={styles.cardActions}>
              <RippleButton onPress={() => console.log('Action 1')}>
                <Text>操作 1</Text>
              </RippleButton>
            </View>
          </HoverCard>
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
});
