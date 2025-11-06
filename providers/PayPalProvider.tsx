import { useState, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { trpc } from '@/lib/trpc';

export interface PayPalSubscription {
  id: string;
  paypal_subscription_id: string | null;
  plan_name: 'basic' | 'premium';
  billing_cycle: 'monthly' | 'yearly';
  amount: number;
  currency: string;
  status: 'pending' | 'active' | 'suspended' | 'cancelled' | 'expired';
  started_at: string | null;
  expires_at: string | null;
  next_billing_at: string | null;
}

export const [PayPalProvider, usePayPal] = createContextHook(() => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscriptionQuery = trpc.paypal.getSubscription.useQuery(undefined, {
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const createSubscriptionMutation = trpc.paypal.createSubscription.useMutation();
  const activateSubscriptionMutation = trpc.paypal.activateSubscription.useMutation();
  const cancelSubscriptionMutation = trpc.paypal.cancelSubscription.useMutation();

  const subscription = subscriptionQuery.data?.subscription || null;
  const hasActiveSubscription = subscription?.status === 'active';

  const createSubscription = useCallback(async (
    planId: string,
    returnUrl?: string,
    cancelUrl?: string
  ): Promise<{ success: boolean; approvalUrl?: string; message: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createSubscriptionMutation.mutateAsync({
        planId,
        returnUrl,
        cancelUrl,
      });

      if (!result.success) {
        setError(result.message);
      }

      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create subscription';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, [createSubscriptionMutation]);

  const activateSubscription = useCallback(async (
    subscriptionId: string
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await activateSubscriptionMutation.mutateAsync({
        subscriptionId,
      });

      if (result.success) {
        await subscriptionQuery.refetch();
      } else {
        setError(result.message);
      }

      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to activate subscription';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, [activateSubscriptionMutation, subscriptionQuery]);

  const cancelSubscription = useCallback(async (
    subscriptionId: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await cancelSubscriptionMutation.mutateAsync({
        subscriptionId,
        reason,
      });

      if (result.success) {
        await subscriptionQuery.refetch();
      } else {
        setError(result.message);
      }

      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to cancel subscription';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, [cancelSubscriptionMutation, subscriptionQuery]);

  const refreshSubscription = useCallback(async () => {
    await subscriptionQuery.refetch();
  }, [subscriptionQuery]);

  return useMemo(() => ({
    subscription,
    hasActiveSubscription,
    isLoading: isLoading || subscriptionQuery.isLoading,
    error: error || (subscriptionQuery.error ? subscriptionQuery.error.message : null),
    createSubscription,
    activateSubscription,
    cancelSubscription,
    refreshSubscription,
  }), [
    subscription,
    hasActiveSubscription,
    isLoading,
    subscriptionQuery.isLoading,
    subscriptionQuery.error,
    error,
    createSubscription,
    activateSubscription,
    cancelSubscription,
    refreshSubscription,
  ]);
});
