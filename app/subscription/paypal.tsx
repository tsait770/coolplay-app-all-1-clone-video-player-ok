import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Check, X, Info } from 'lucide-react-native';
import { usePayPal } from '@/providers/PayPalProvider';
import Colors from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';

const PAYPAL_PLANS = {
  basic_monthly: {
    id: process.env.EXPO_PUBLIC_PAYPAL_BASIC_MONTHLY_PLAN_ID || 'P-BASIC-MONTHLY',
    name: 'Basic Monthly',
    price: 9.99,
    currency: 'USD',
    billing: 'Monthly',
    features: [
      'All platforms and formats',
      '1,500 voice commands/month',
      '40 daily bonus commands',
      'Adult content access',
      '3 devices',
    ],
  },
  basic_yearly: {
    id: process.env.EXPO_PUBLIC_PAYPAL_BASIC_YEARLY_PLAN_ID || 'P-BASIC-YEARLY',
    name: 'Basic Yearly',
    price: 99.99,
    currency: 'USD',
    billing: 'Yearly (Save 17%)',
    features: [
      'All platforms and formats',
      '1,500 voice commands/month',
      '40 daily bonus commands',
      'Adult content access',
      '3 devices',
    ],
  },
  premium_monthly: {
    id: process.env.EXPO_PUBLIC_PAYPAL_PREMIUM_MONTHLY_PLAN_ID || 'P-PREMIUM-MONTHLY',
    name: 'Premium Monthly',
    price: 19.99,
    currency: 'USD',
    billing: 'Monthly',
    features: [
      'All platforms and formats',
      'Unlimited voice commands',
      'Priority support',
      'Adult content access',
      '5 devices',
      'Early access to new features',
    ],
  },
  premium_yearly: {
    id: process.env.EXPO_PUBLIC_PAYPAL_PREMIUM_YEARLY_PLAN_ID || 'P-PREMIUM-YEARLY',
    name: 'Premium Yearly',
    price: 199.99,
    currency: 'USD',
    billing: 'Yearly (Save 17%)',
    features: [
      'All platforms and formats',
      'Unlimited voice commands',
      'Priority support',
      'Adult content access',
      '5 devices',
      'Early access to new features',
    ],
  },
};

export default function PayPalSubscriptionScreen() {
  useTranslation();
  const router = useRouter();
  const { subscription, createSubscription, isLoading } = usePayPal();
  const [selectedPlan, setSelectedPlan] = useState<keyof typeof PAYPAL_PLANS | null>(null);

  const handleSubscribe = async (planKey: keyof typeof PAYPAL_PLANS) => {
    const plan = PAYPAL_PLANS[planKey];
    
    Alert.alert(
      'Confirm Subscription',
      `Subscribe to ${plan.name} for $${plan.price}/${plan.billing.toLowerCase()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Subscribe',
          onPress: async () => {
            setSelectedPlan(planKey);
            
            try {
              const result = await createSubscription(plan.id);
              
              if (result.success && result.approvalUrl) {
                const supported = await Linking.canOpenURL(result.approvalUrl);
                
                if (supported) {
                  await Linking.openURL(result.approvalUrl);
                  
                  Alert.alert(
                    'Complete Payment',
                    'Please complete your payment in the browser. Once completed, return to the app to activate your subscription.',
                    [
                      { text: 'OK' },
                    ]
                  );
                } else {
                  Alert.alert('Error', 'Cannot open PayPal payment page');
                }
              } else {
                Alert.alert('Error', result.message);
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to create subscription');
            } finally {
              setSelectedPlan(null);
            }
          },
        },
      ]
    );
  };

  const renderPlanCard = (planKey: keyof typeof PAYPAL_PLANS, isPopular = false) => {
    const plan = PAYPAL_PLANS[planKey];
    const isSubscribing = selectedPlan === planKey && isLoading;

    return (
      <View
        key={planKey}
        style={[
          styles.planCard,
          isPopular && styles.planCardPopular,
        ]}
      >
        {isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>MOST POPULAR</Text>
          </View>
        )}

        <Text style={styles.planName}>{plan.name}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.priceCurrency}>$</Text>
          <Text style={styles.priceAmount}>{plan.price.toFixed(2)}</Text>
          <Text style={styles.priceBilling}>/{plan.billing}</Text>
        </View>

        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Check size={20} color={Colors.semantic.success} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.subscribeButton,
            isPopular && styles.subscribeButtonPopular,
            isSubscribing && styles.subscribeButtonDisabled,
          ]}
          onPress={() => handleSubscribe(planKey)}
          disabled={isSubscribing}
        >
          {isSubscribing ? (
            <ActivityIndicator color={Colors.primary.text} />
          ) : (
            <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Safe area handled by Stack header */}
      <Stack.Screen
        options={{
          title: 'PayPal Subscription',
          headerStyle: { backgroundColor: Colors.primary.bg },
          headerTintColor: Colors.primary.text,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>
          Subscribe via PayPal for secure and flexible payment
        </Text>

        {subscription && subscription.status === 'active' && (
          <View style={styles.activeSubscriptionNotice}>
            <Info size={20} color={Colors.semantic.info} />
            <Text style={styles.activeSubscriptionText}>
              You have an active {subscription.plan_name} subscription
            </Text>
          </View>
        )}

        <View style={styles.plansContainer}>
          {renderPlanCard('basic_monthly')}
          {renderPlanCard('basic_yearly', true)}
          {renderPlanCard('premium_monthly')}
          {renderPlanCard('premium_yearly')}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Payment Information</Text>
          <Text style={styles.infoText}>
            • Secure payment processing via PayPal{'\n'}
            • Cancel anytime without fees{'\n'}
            • Instant activation upon payment{'\n'}
            • Automatic renewal (can be disabled){'\n'}
            • 30-day money-back guarantee
          </Text>
        </View>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <X size={20} color={Colors.primary.textSecondary} />
          <Text style={styles.cancelButtonText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  activeSubscriptionNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: Colors.semantic.info,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  activeSubscriptionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.semantic.info,
    fontWeight: '600',
  },
  plansContainer: {
    gap: 16,
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: Colors.primary.bgSecondary,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.card.border,
  },
  planCardPopular: {
    borderColor: Colors.primary.accent,
    backgroundColor: Colors.primary.bgTertiary,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: Colors.primary.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary.text,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary.text,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  priceCurrency: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary.textSecondary,
  },
  priceAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.primary.text,
  },
  priceBilling: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
    marginLeft: 4,
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: Colors.primary.textSecondary,
  },
  subscribeButton: {
    backgroundColor: Colors.primary.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  subscribeButtonPopular: {
    backgroundColor: Colors.primary.accent,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary.text,
  },
  infoSection: {
    backgroundColor: Colors.primary.bgSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
    lineHeight: 22,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.primary.textSecondary,
  },
});
