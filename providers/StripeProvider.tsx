import { useState, useCallback, useMemo } from 'react';
import { Alert, Platform } from 'react-native';
import createContextHook from '@nkzw/create-context-hook';
import { useAuth } from './AuthProvider';
import { trpcClient } from '@/lib/trpc';

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
}

const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'basic_monthly',
    name: 'Basic Monthly',
    price: 19.9,
    currency: 'USD',
    interval: 'month',
    stripePriceId: process.env.EXPO_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID || 'price_basic_monthly',
    features: [
      '2000 uses on first login',
      '1500 uses per month',
      '+40 uses daily login bonus',
      'Custom voice commands',
      'All video sources supported',
      'Unused quota rolls over',
    ],
  },
  {
    id: 'basic_yearly',
    name: 'Basic Yearly',
    price: 199,
    currency: 'USD',
    interval: 'year',
    stripePriceId: process.env.EXPO_PUBLIC_STRIPE_BASIC_YEARLY_PRICE_ID || 'price_basic_yearly',
    features: [
      '2000 uses on first login',
      '1500 uses per month',
      '+40 uses daily login bonus',
      'Custom voice commands',
      'All video sources supported',
      'Unused quota rolls over',
      'Save 25% vs monthly',
    ],
  },
  {
    id: 'plus_monthly',
    name: 'Plus Monthly',
    price: 39.9,
    currency: 'USD',
    interval: 'month',
    stripePriceId: process.env.EXPO_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID || 'price_plus_monthly',
    features: [
      '2000 uses on first login',
      'Unlimited uses',
      'Custom voice commands',
      'All video sources supported',
      'Priority support',
      'Early access to new features',
    ],
  },
  {
    id: 'plus_yearly',
    name: 'Plus Yearly',
    price: 399,
    currency: 'USD',
    interval: 'year',
    stripePriceId: process.env.EXPO_PUBLIC_STRIPE_PLUS_YEARLY_PRICE_ID || 'price_plus_yearly',
    features: [
      '2000 uses on first login',
      'Unlimited uses',
      'Custom voice commands',
      'All video sources supported',
      'Priority support',
      'Early access to new features',
      'Save 25% vs monthly',
    ],
  },
];

export const [StripeProvider, useStripe] = createContextHook(() => {
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const createCheckoutSession = useCallback(async (planId: string) => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to subscribe');
      return null;
    }

    const plan = MEMBERSHIP_PLANS.find(p => p.id === planId);
    if (!plan) {
      Alert.alert('Error', 'Invalid plan selected');
      return null;
    }

    try {
      setLoading(true);

      const result = await trpcClient.stripe.createCheckoutSession.mutate({
        userId: user.id,
        priceId: plan.stripePriceId,
        successUrl: `${process.env.EXPO_PUBLIC_APP_URL}/subscription/success`,
        cancelUrl: `${process.env.EXPO_PUBLIC_APP_URL}/subscription/cancel`,
      });

      if (Platform.OS === 'web') {
        window.location.href = result.url;
      } else {
        Alert.alert(
          'Subscription',
          'Please visit the web version to complete your subscription',
          [{ text: 'OK' }]
        );
      }

      return result.sessionId;
    } catch (error) {
      console.error('Create checkout session error:', error);
      Alert.alert('Error', 'Failed to start subscription process');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const cancelSubscription = useCallback(async (subscriptionId?: string) => {
    if (!user || !profile) {
      Alert.alert('Error', 'No active subscription found');
      return false;
    }

    if (!subscriptionId) {
      Alert.alert('Error', 'Subscription ID is required');
      return false;
    }

    try {
      setLoading(true);

      await trpcClient.stripe.cancelSubscription.mutate({
        userId: user.id,
        subscriptionId,
      });

      await updateProfile({
        membership_tier: 'free',
        membership_expires_at: null,
      });

      Alert.alert('Success', 'Your subscription has been cancelled');
      return true;
    } catch (error) {
      console.error('Cancel subscription error:', error);
      Alert.alert('Error', 'Failed to cancel subscription');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, profile, updateProfile]);

  const getActivePlan = useCallback(() => {
    if (!profile || profile.membership_tier === 'free') return null;
    
    const isYearly = profile.membership_expires_at && 
      new Date(profile.membership_expires_at).getTime() - Date.now() > 180 * 24 * 60 * 60 * 1000;
    
    const planId = `${profile.membership_tier}_${isYearly ? 'yearly' : 'monthly'}`;
    return MEMBERSHIP_PLANS.find(p => p.id === planId) || null;
  }, [profile]);

  return useMemo(() => ({
    plans: MEMBERSHIP_PLANS,
    loading,
    createCheckoutSession,
    cancelSubscription,
    getActivePlan,
  }), [loading, createCheckoutSession, cancelSubscription, getActivePlan]);
});
