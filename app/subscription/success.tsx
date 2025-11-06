import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { CheckCircle, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function SubscriptionSuccessScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)/home');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ title: 'Success', headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <CheckCircle size={80} color={Colors.primary.accent} />
          </View>
          
          <Text style={styles.title}>Payment Successful!</Text>
          <Text style={styles.subtitle}>
            Your subscription has been activated successfully.
          </Text>
          
          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>What's next?</Text>
            <View style={styles.benefitItem}>
              <CheckCircle size={20} color={Colors.primary.accent} />
              <Text style={styles.benefitText}>Unlimited video playback</Text>
            </View>
            <View style={styles.benefitItem}>
              <CheckCircle size={20} color={Colors.primary.accent} />
              <Text style={styles.benefitText}>Access to all video sources</Text>
            </View>
            <View style={styles.benefitItem}>
              <CheckCircle size={20} color={Colors.primary.accent} />
              <Text style={styles.benefitText}>Priority support</Text>
            </View>
            <View style={styles.benefitItem}>
              <CheckCircle size={20} color={Colors.primary.accent} />
              <Text style={styles.benefitText}>Early access to new features</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('/(tabs)/home')}
          >
            <Text style={styles.buttonText}>Start Using Premium</Text>
            <ArrowRight size={20} color={Colors.primary.bg} />
          </TouchableOpacity>

          <Text style={styles.autoRedirect}>
            Redirecting to home in 5 seconds...
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
  benefitsContainer: {
    width: '100%',
    backgroundColor: Colors.secondary.bg,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.primary.text,
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    color: Colors.primary.text,
    marginLeft: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary.bg,
    marginRight: 8,
  },
  autoRedirect: {
    fontSize: 12,
    color: Colors.primary.textSecondary,
    textAlign: 'center' as const,
  },
});
