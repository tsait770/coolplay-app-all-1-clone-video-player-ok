import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';

export const getSubscriptionProcedure = protectedProcedure
  .input(z.void())
  .output(
    z.object({
      success: z.boolean(),
      subscription: z.object({
        id: z.string(),
        paypal_subscription_id: z.string().nullable(),
        plan_name: z.string(),
        billing_cycle: z.string(),
        amount: z.number(),
        currency: z.string(),
        status: z.string(),
        started_at: z.string().nullable(),
        expires_at: z.string().nullable(),
        next_billing_at: z.string().nullable(),
      }).nullable(),
      message: z.string(),
    })
  )
  .query(async ({ ctx }) => {
    const userId = ctx.user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error } = await ctx.supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('[getSubscription] Database error:', error);
        throw new Error('Failed to get subscription');
      }

      if (!data) {
        return {
          success: true,
          subscription: null,
          message: 'No active subscription found',
        };
      }

      return {
        success: true,
        subscription: data,
        message: 'Subscription retrieved successfully',
      };
    } catch (error: any) {
      console.error('[getSubscription] Error:', error);
      return {
        success: false,
        subscription: null,
        message: error.message || 'Failed to get subscription',
      };
    }
  });
