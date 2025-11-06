import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OrdinaryImpala4 from '@/components/OrdinaryImpala4';
import { initImpalaAnimations } from '@/components/OrdinaryImpala4/animations';
import Colors from '@/constants/colors';
import { DesignTokens } from '@/constants/designTokens';

const ImpalaDemo: React.FC = () => {
  const insets = useSafeAreaInsets();
  
  useEffect(() => {
    const cleanup = initImpalaAnimations(document);
    return cleanup;
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState('');

  const handleCardPress = (title: string) => {
    if (!title.trim()) return;
    if (title.length > 100) return;
    const sanitized = title.trim();
    setSelectedCard(sanitized);
    setModalVisible(true);
  };

  const demoData = [
    {
      id: '1',
      title: 'Beautiful Landscapes',
      description: 'Explore stunning natural landscapes from around the world with breathtaking views and serene environments.',
      imageUri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      variant: 'featured' as const,
    },
    {
      id: '2',
      title: 'Urban Architecture',
      description: 'Discover modern architectural marvels and urban design that shapes our cities.',
      imageUri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
      variant: 'default' as const,
    },
    {
      id: '3',
      title: 'Ocean Adventures',
      description: 'Dive into the deep blue and experience marine life like never before.',
      imageUri: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
      variant: 'compact' as const,
    },
    {
      id: '4',
      title: 'Mountain Peaks',
      description: 'Reach new heights and conquer the most challenging mountain peaks.',
      imageUri: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=400&fit=crop',
      variant: 'default' as const,
    },
    {
      id: '5',
      title: 'Forest Trails',
      description: 'Walk through ancient forests and discover hidden trails filled with wildlife.',
      imageUri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
      variant: 'default' as const,
    },
    {
      id: '6',
      title: 'Desert Wonders',
      description: 'Experience the vast beauty and silence of desert landscapes.',
      imageUri: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=400&fit=crop',
      variant: 'compact' as const,
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Ordinary Impala 4</Text>
        <Text style={styles.subtitle}>
          Dynamic card component with Apple Watch-inspired design
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interactive Cards</Text>
          <Text style={styles.sectionDescription}>
            Each card features entrance animations, hover effects, ripple feedback, and haptic responses.
          </Text>
        </View>

        {demoData.map((item, index) => (
          <OrdinaryImpala4
            key={item.id}
            title={item.title}
            description={item.description}
            imageUri={item.imageUri}
            variant={item.variant}
            index={index}
            onPress={() => handleCardPress(item.title)}
            ctaText="Explore"
            testID={`impala-card-${item.id}`}
            accessibilityLabel={`${item.title} card. ${item.description}`}
          />
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• Staggered entrance animations</Text>
            <Text style={styles.featureItem}>• Hover and focus interactions</Text>
            <Text style={styles.featureItem}>• Ripple effect on CTA buttons</Text>
            <Text style={styles.featureItem}>• Haptic feedback (mobile)</Text>
            <Text style={styles.featureItem}>• Respects reduced motion preferences</Text>
            <Text style={styles.featureItem}>• Full accessibility support</Text>
            <Text style={styles.featureItem}>• Apple Watch design language</Text>
            <Text style={styles.featureItem}>• Responsive and performant</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Variants</Text>
          <Text style={styles.sectionDescription}>
            Three variants available: default, compact, and featured.
          </Text>
        </View>

        <View style={styles.footer}>
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
            <Text style={styles.modalTitle}>Card Pressed</Text>
            <Text style={styles.modalText}>You pressed: {selectedCard}</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
  },
  header: {
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.lg,
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: DesignTokens.spacing.lg,
    gap: DesignTokens.spacing.md,
  },
  section: {
    paddingHorizontal: DesignTokens.spacing.md,
    marginBottom: DesignTokens.spacing.md,
  },
  sectionTitle: {
    ...DesignTokens.typography.title.large,
    color: Colors.primary.text,
    marginBottom: DesignTokens.spacing.sm,
  },
  sectionDescription: {
    ...DesignTokens.typography.body.medium,
    color: Colors.primary.textSecondary,
    lineHeight: 22,
  },
  featureList: {
    gap: DesignTokens.spacing.xs,
  },
  featureItem: {
    ...DesignTokens.typography.body.medium,
    color: Colors.primary.textSecondary,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.xl,
    alignItems: 'center',
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

export default ImpalaDemo;