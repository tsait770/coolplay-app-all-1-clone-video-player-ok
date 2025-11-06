import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Home } from 'lucide-react-native';
import {
  PulseButton,
  GradientButton,
  RippleButton,
  HoverCard,
  GlowCard,
  SpinLoader,
  DotsLoader,
} from '@/components/uiverse';
import Colors from '@/constants/colors';
import { DesignTokens } from '@/constants/designTokens';

const UniverseDemo: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePress = (item: string) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Uiverse.io Components',
          headerStyle: {
            backgroundColor: Colors.secondary.bg,
          },
          headerTintColor: Colors.primary.text,
        }}
      />
      
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Uiverse.io Integration</Text>
            <Text style={styles.subtitle}>
              Animated components adapted from the world&apos;s largest open-source UI library
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Animated Buttons</Text>
            <Text style={styles.sectionDescription}>
              Interactive buttons with pulse, gradient, and ripple effects
            </Text>
            
            <View style={styles.buttonGroup}>
              <PulseButton
                title="Pulse Button"
                onPress={() => handlePress('Pulse Button')}
                variant="primary"
                size="md"
                fullWidth
              />
              
              <GradientButton
                title="Gradient Button"
                onPress={() => handlePress('Gradient Button')}
                variant="primary"
                size="md"
                fullWidth
                icon={<Home size={20} color={Colors.primary.text} />}
                iconPosition="left"
              />
              
              <RippleButton
                title="Ripple Button"
                onPress={() => handlePress('Ripple Button')}
                variant="success"
                size="md"
                fullWidth
              />
              
              <GradientButton
                title="Loading Demo"
                onPress={handleLoadingDemo}
                variant="secondary"
                size="md"
                fullWidth
                loading={loading}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Button Variants</Text>
            <View style={styles.buttonRow}>
              <PulseButton
                title="Primary"
                onPress={() => handlePress('Primary')}
                variant="primary"
                size="sm"
              />
              <PulseButton
                title="Danger"
                onPress={() => handlePress('Danger')}
                variant="danger"
                size="sm"
              />
              <PulseButton
                title="Success"
                onPress={() => handlePress('Success')}
                variant="success"
                size="sm"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Animated Cards</Text>
            <Text style={styles.sectionDescription}>
              Cards with hover effects, entrance animations, and glow effects
            </Text>
            
            <HoverCard
              title="Hover Card"
              description="This card scales and lifts on press with smooth animations and haptic feedback."
              imageUri="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop"
              onPress={() => handlePress('Hover Card')}
              variant="default"
              index={0}
            />
            
            <HoverCard
              title="Featured Card"
              description="A featured variant with enhanced styling and prominent border."
              imageUri="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop"
              onPress={() => handlePress('Featured Card')}
              variant="featured"
              index={1}
            />
            
            <GlowCard
              title="Glow Card"
              description="This card features a pulsing glow effect around its border for emphasis."
              onPress={() => handlePress('Glow Card')}
              variant="featured"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Loading Animations</Text>
            <Text style={styles.sectionDescription}>
              Smooth loading indicators with various styles
            </Text>
            
            <View style={styles.loaderGroup}>
              <View style={styles.loaderItem}>
                <SpinLoader size="sm" />
                <Text style={styles.loaderLabel}>Small</Text>
              </View>
              
              <View style={styles.loaderItem}>
                <SpinLoader size="md" />
                <Text style={styles.loaderLabel}>Medium</Text>
              </View>
              
              <View style={styles.loaderItem}>
                <SpinLoader size="lg" />
                <Text style={styles.loaderLabel}>Large</Text>
              </View>
            </View>
            
            <View style={styles.loaderGroup}>
              <View style={styles.loaderItem}>
                <DotsLoader size="sm" />
                <Text style={styles.loaderLabel}>Dots Small</Text>
              </View>
              
              <View style={styles.loaderItem}>
                <DotsLoader size="md" />
                <Text style={styles.loaderLabel}>Dots Medium</Text>
              </View>
              
              <View style={styles.loaderItem}>
                <DotsLoader size="lg" />
                <Text style={styles.loaderLabel}>Dots Large</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featureList}>
              <Text style={styles.featureItem}>✅ Cross-platform (iOS, Android, Web)</Text>
              <Text style={styles.featureItem}>✅ Respects reduced motion preferences</Text>
              <Text style={styles.featureItem}>✅ Haptic feedback on mobile</Text>
              <Text style={styles.featureItem}>✅ Full accessibility support</Text>
              <Text style={styles.featureItem}>✅ TypeScript typed</Text>
              <Text style={styles.featureItem}>✅ Performance optimized</Text>
              <Text style={styles.featureItem}>✅ Apple Watch design language</Text>
              <Text style={styles.featureItem}>✅ Customizable with Design Tokens</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Components adapted from Uiverse.io
            </Text>
            <Text style={styles.footerText}>
              Built with React Native, Expo, and TypeScript
            </Text>
          </View>
        </ScrollView>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Component Pressed</Text>
              <Text style={styles.modalText}>You pressed: {selectedItem}</Text>
              <Pressable
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: DesignTokens.spacing.lg,
    gap: DesignTokens.spacing.lg,
  },
  header: {
    paddingHorizontal: DesignTokens.spacing.md,
    paddingBottom: DesignTokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card.border,
  },
  title: {
    ...DesignTokens.typography.display.medium,
    color: Colors.primary.text,
    textAlign: 'center',
    marginBottom: DesignTokens.spacing.xs,
  },
  subtitle: {
    ...DesignTokens.typography.body.large,
    color: Colors.primary.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    paddingHorizontal: DesignTokens.spacing.md,
    gap: DesignTokens.spacing.md,
  },
  sectionTitle: {
    ...DesignTokens.typography.title.large,
    color: Colors.primary.text,
  },
  sectionDescription: {
    ...DesignTokens.typography.body.medium,
    color: Colors.primary.textSecondary,
    lineHeight: 22,
  },
  buttonGroup: {
    gap: DesignTokens.spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.sm,
    flexWrap: 'wrap',
  },
  loaderGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: DesignTokens.spacing.lg,
    backgroundColor: Colors.surface.secondary,
    borderRadius: DesignTokens.borderRadius.md,
  },
  loaderItem: {
    alignItems: 'center',
    gap: DesignTokens.spacing.sm,
  },
  loaderLabel: {
    ...DesignTokens.typography.caption.medium,
    color: Colors.primary.textSecondary,
  },
  featureList: {
    gap: DesignTokens.spacing.xs,
  },
  featureItem: {
    ...DesignTokens.typography.body.medium,
    color: Colors.primary.textSecondary,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.xl,
    alignItems: 'center',
    gap: DesignTokens.spacing.xs,
  },
  footerText: {
    ...DesignTokens.typography.caption.large,
    color: Colors.primary.textTertiary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.surface.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.card.bg,
    borderRadius: DesignTokens.borderRadius.lg,
    padding: DesignTokens.spacing.lg,
    margin: DesignTokens.spacing.md,
    minWidth: 280,
    maxWidth: 400,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  modalTitle: {
    ...DesignTokens.typography.title.medium,
    color: Colors.primary.text,
    marginBottom: DesignTokens.spacing.sm,
    textAlign: 'center',
  },
  modalText: {
    ...DesignTokens.typography.body.medium,
    color: Colors.primary.textSecondary,
    marginBottom: DesignTokens.spacing.lg,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: Colors.accent.primary,
    borderRadius: DesignTokens.borderRadius.sm,
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingVertical: DesignTokens.spacing.sm,
    alignSelf: 'center',
  },
  modalButtonText: {
    ...DesignTokens.typography.body.medium,
    color: Colors.primary.text,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default UniverseDemo;
