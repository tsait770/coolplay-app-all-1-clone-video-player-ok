import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';

const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const PAYPAL_CLIENT_ID = process.env.EXPO_PUBLIC_PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';

async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

export const cancelSubscriptionProcedure = protectedProcedure
  .input(
    z.object({
      subscriptionId: z.string(),
      reason: z.string().optional(),
    })
  )
  .output(
    z.object({
      success: z.boolean(),
      message: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      const accessToken = await getPayPalAccessToken();

      console.log('[cancelSubscription] Cancelling subscription:', input.subscriptionId);

      const response = await fetch(
        `${PAYPAL_API_BASE}/v1/billing/subscriptions/${input.subscriptionId}/cancel`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reason: input.reason || 'User requested cancellation',
          }),
        }
      );

      if (!response.ok && response.status !== 204) {
        const errorData = await response.json();
        console.error('[cancelSubscription] PayPal API error:', errorData);
        throw new Error(errorData.message || 'Failed to cancel subscription');
      }

      const { error: updateError } = await ctx.supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: input.reason || 'User requested cancellation',
          updated_at: new Date().toISOString(),
        })
        .eq('paypal_subscription_id', input.subscriptionId)
        .eq('user_id', userId);

      if (updateError) {
        console.error('[cancelSubscription] Database update error:', updateError);
        throw new Error('Failed to update subscription in database');
      }

      console.log('[cancelSubscription] Subscription cancelled successfully');

      return {
        success: true,
        message: 'Subscription cancelled successfully',
      };
    } catch (error: any) {
      console.error('[cancelSubscription] Error:', error);
      return {
        success: false,
        message: error.message || 'Failed to cancel subscription',
      };
    }
  });
