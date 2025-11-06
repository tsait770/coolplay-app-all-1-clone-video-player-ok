import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function SubscriptionCancelScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/subscription');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ title: 'Cancelled', headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <XCircle size={80} color={Colors.primary.textSecondary} />
          </View>
          
          <Text style={styles.title}>Payment Cancelled</Text>
          <Text style={styles.subtitle}>
            Your subscription was not completed. No charges were made.
          </Text>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Why subscribe?</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoText}>• Unlimited video playback</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoText}>• Support all video sources</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoText}>• Priority customer support</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoText}>• Cancel anytime, no commitment</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.replace('/subscription')}
            >
              <RefreshCw size={20} color={Colors.primary.bg} />
              <Text style={styles.primaryButtonText}>Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.replace('/(tabs)/home')}
            >
              <ArrowLeft size={20} color={Colors.primary.accent} />
              <Text style={styles.secondaryButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.autoRedirect}>
            Redirecting to subscription page in 5 seconds...
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.primary.text,
    marginBottom: 12,
    textAlign: 'center' as const,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.primary.textSecondary,
    textAlign: 'center' as const,
    marginBottom: 40,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: Colors.secondary.bg,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.primary.text,
    marginBottom: 16,
  },
  infoItem: {
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.primary.text,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary.bg,
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary.bg,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary.accent,
    marginLeft: 8,
  },
  autoRedirect: {
    fontSize: 12,
    color: Colors.primary.textSecondary,
    textAlign: 'center' as const,
  },
});
