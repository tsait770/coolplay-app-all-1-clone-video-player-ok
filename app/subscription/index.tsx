import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Check, Crown, Zap, Sparkles, Shield, Rocket, TrendingUp } from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import { useStripe } from '@/providers/StripeProvider';
import { useMembership } from '@/providers/MembershipProvider';
import { useTranslation } from '@/hooks/useTranslation';
import Colors from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SubscriptionScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, profile, isPremium } = useAuth();
  const { plans, loading, createCheckoutSession, cancelSubscription, getActivePlan } = useStripe();
  const { tier, getRemainingUsage, limits } = useMembership();
  const [selectedInterval, setSelectedInterval] = useState<'month' | 'year'>('month');
  const activePlan = getActivePlan();
  const remainingUsage = getRemainingUsage();

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to subscribe', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => router.push('/auth/sign-in') },
      ]);
      return;
    }

    await createCheckoutSession(planId);
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: cancelSubscription,
        },
      ]
    );
  };

  const filteredPlans = plans.filter(p => p.interval === selectedInterval);

  return (
    <>
      <Stack.Screen options={{ title: 'Subscription', headerShown: true }} />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Current Status Card */}
          <View style={styles.currentStatusCard}>
            <View style={styles.statusHeader}>
              <View style={styles.statusIconContainer}>
                {tier === 'premium' ? (
                  <Crown size={32} color={Colors.primary.accent} />
                ) : tier === 'basic' ? (
                  <Shield size={32} color={Colors.primary.accent} />
                ) : (
                  <Sparkles size={32} color={Colors.primary.textSecondary} />
                )}
              </View>
              <View style={styles.statusInfo}>
                <Text style={styles.statusTier}>
                  {tier === 'free_trial' ? t('free_trial') : 
                   tier === 'free' ? t('free_member') :
                   tier === 'basic' ? t('basic_member') : t('premium_member')}
                </Text>
                <Text style={styles.statusUsage}>
                  {remainingUsage === -1 ? t('unlimited_uses') : 
                   t('uses_remaining').replace('{count}', remainingUsage.toString())}
                </Text>
              </View>
            </View>
            {(tier === 'free' || tier === 'free_trial') && (
              <View style={styles.upgradePrompt}>
                <Rocket size={20} color={Colors.primary.accent} />
                <Text style={styles.upgradePromptText}>{t('tap_to_upgrade')}</Text>
              </View>
            )}
          </View>

          <View style={styles.header}>
            <Crown size={48} color={Colors.primary.accent} />
            <Text style={styles.title}>{t('available_plans')}</Text>
            <Text style={styles.subtitle}>
              {t('unlock_premium_features')}
            </Text>
          </View>

          {isPremium && activePlan && (
            <View style={styles.currentPlanCard}>
              <View style={styles.currentPlanHeader}>
                <Zap size={20} color={Colors.primary.accent} />
                <Text style={styles.currentPlanTitle}>{t('current_plan')}</Text>
              </View>
              <Text style={styles.currentPlanName}>{activePlan.name}</Text>
              <Text style={styles.currentPlanPrice}>
                ${activePlan.price}/{activePlan.interval}
              </Text>
              {profile?.membership_expires_at && (
                <Text style={styles.expiresText}>
                  {t('renews_on')} {new Date(profile.membership_expires_at).toLocaleDateString()}
                </Text>
              )}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelSubscription}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>{t('cancel_subscription')}</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.intervalSelector}>
            <TouchableOpacity
              style={[
                styles.intervalButton,
                selectedInterval === 'month' && styles.intervalButtonActive,
              ]}
              onPress={() => setSelectedInterval('month')}
            >
              <Text
                style={[
                  styles.intervalButtonText,
                  selectedInterval === 'month' && styles.intervalButtonTextActive,
                ]}
              >
                {t('monthly')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.intervalButton,
                selectedInterval === 'year' && styles.intervalButtonActive,
              ]}
              onPress={() => setSelectedInterval('year')}
            >
              <Text
                style={[
                  styles.intervalButtonText,
                  selectedInterval === 'year' && styles.intervalButtonTextActive,
                ]}
              >
                {t('yearly')}
              </Text>
              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>{t('save_25_percent')}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.plansContainer}>
            {filteredPlans.map((plan) => {
              const isActive = activePlan?.id === plan.id;
              const isBasicPlan = plan.id.includes('basic');
              const isPlusPlan = plan.id.includes('plus');

              return (
                <View
                  key={plan.id}
                  style={[
                    styles.planCard,
                    isBasicPlan && styles.planCardBasic,
                    isPlusPlan && styles.planCardPlus,
                    isActive && styles.planCardActive,
                  ]}
                >
                  {isBasicPlan && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>{t('most_popular')}</Text>
                    </View>
                  )}
                  {isPlusPlan && (
                    <View style={[styles.popularBadge, styles.bestValueBadge]}>
                      <Text style={styles.popularBadgeText}>{t('best_value')}</Text>
                    </View>
                  )}

                  <Text style={styles.planName}>{plan.name.split(' ')[0]}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.planPrice}>${plan.price}</Text>
                    <Text style={styles.planInterval}>/{plan.interval}</Text>
                  </View>
                  {selectedInterval === 'year' && (
                    <Text style={styles.savingsText}>{t('save_per_year').replace('{amount}', `${(plan.price * 0.25).toFixed(2)}`)}</Text>
                  )}

                  <View style={styles.featuresContainer}>
                    {plan.features.map((feature, index) => (
                      <View key={index} style={styles.featureRow}>
                        <Check size={16} color={Colors.primary.accent} />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  {isActive ? (
                    <View style={styles.activeButton}>
                      <Text style={styles.activeButtonText}>{t('current')}</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.subscribeButton,
                        isBasicPlan && styles.subscribeButtonBasic,
                        isPlusPlan && styles.subscribeButtonPlus,
                      ]}
                      onPress={() => handleSubscribe(plan.id)}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color={Colors.primary.bg} />
                      ) : (
                        <Text style={styles.subscribeButtonText}>{t('subscribe')}</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t('free_tier_info')}
            </Text>
            <Text style={styles.footerText}>
              {t('paid_plans_info')}
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.primary.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.primary.textSecondary,
    textAlign: 'center' as const,
  },
  currentPlanCard: {
    backgroundColor: Colors.secondary.bg,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.primary.accent,
  },
  currentPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentPlanTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary.accent,
    marginLeft: 8,
  },
  currentPlanName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.primary.text,
    marginBottom: 4,
  },
  currentPlanPrice: {
    fontSize: 16,
    color: Colors.primary.textSecondary,
    marginBottom: 8,
  },
  expiresText: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
    marginBottom: 16,
  },
  cancelButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  intervalSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.secondary.bg,
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  intervalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    position: 'relative',
  },
  intervalButtonActive: {
    backgroundColor: Colors.primary.accent,
  },
  intervalButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary.textSecondary,
  },
  intervalButtonTextActive: {
    color: Colors.primary.bg,
  },
  saveBadge: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: '#10b981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  saveBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700' as const,
  },
  plansContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  planCard: {
    backgroundColor: Colors.secondary.bg,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.card.border,
    position: 'relative',
  },
  planCardBasic: {
    borderColor: Colors.primary.accent,
  },
  planCardPlus: {
    borderColor: '#10b981',
  },
  planCardActive: {
    borderColor: Colors.primary.accent,
    backgroundColor: 'rgba(108, 212, 255, 0.05)',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 24,
    backgroundColor: Colors.primary.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: Colors.primary.bg,
    fontSize: 10,
    fontWeight: '700' as const,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.primary.text,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.primary.text,
  },
  planInterval: {
    fontSize: 16,
    color: Colors.primary.textSecondary,
    marginLeft: 4,
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: Colors.primary.text,
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: Colors.primary.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  subscribeButtonBasic: {
    backgroundColor: Colors.primary.accent,
  },
  subscribeButtonPlus: {
    backgroundColor: '#10b981',
  },
  bestValueBadge: {
    backgroundColor: '#10b981',
  },
  savingsText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600' as const,
    marginBottom: 16,
  },
  subscribeButtonText: {
    color: Colors.primary.bg,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  activeButton: {
    backgroundColor: Colors.card.bg,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  activeButtonText: {
    color: Colors.primary.text,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: Colors.primary.textSecondary,
    textAlign: 'center' as const,
  },
  currentStatusCard: {
    backgroundColor: Colors.secondary.bg,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Colors.card.border,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.card.bg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusTier: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.primary.text,
    marginBottom: 4,
  },
  statusUsage: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
  },
  upgradePrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(108, 212, 255, 0.1)',
    borderRadius: 8,
  },
  upgradePromptText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary.accent,
    marginLeft: 8,
  },
});
