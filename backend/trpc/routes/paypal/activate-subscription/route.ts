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

export const activateSubscriptionProcedure = protectedProcedure
  .input(
    z.object({
      subscriptionId: z.string(),
    })
  )
  .output(
    z.object({
      success: z.boolean(),
      status: z.string().optional(),
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

      console.log('[activateSubscription] Checking subscription:', input.subscriptionId);

      const response = await fetch(
        `${PAYPAL_API_BASE}/v1/billing/subscriptions/${input.subscriptionId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[activateSubscription] PayPal API error:', errorData);
        throw new Error(errorData.message || 'Failed to get subscription details');
      }

      const subscription = await response.json();

      console.log('[activateSubscription] Subscription details:', {
        id: subscription.id,
        status: subscription.status,
        plan_id: subscription.plan_id,
      });

      if (subscription.status === 'ACTIVE' || subscription.status === 'APPROVED') {
        const startDate = new Date(subscription.start_time || subscription.create_time);
        const billingInfo = subscription.billing_info;
        const nextBillingTime = billingInfo?.next_billing_time;

        const expiresAt = nextBillingTime 
          ? new Date(nextBillingTime)
          : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

        const { error: updateError } = await ctx.supabase
          .from('subscriptions')
          .update({
            status: 'active',
            started_at: startDate.toISOString(),
            expires_at: expiresAt.toISOString(),
            next_billing_at: nextBillingTime || expiresAt.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('paypal_subscription_id', input.subscriptionId)
          .eq('user_id', userId);

        if (updateError) {
          console.error('[activateSubscription] Database update error:', updateError);
          throw new Error('Failed to update subscription in database');
        }

        console.log('[activateSubscription] Subscription activated successfully');

        return {
          success: true,
          status: 'active',
          message: 'Subscription activated successfully!',
        };
      } else {
        return {
          success: false,
          status: subscription.status,
          message: `Subscription is in ${subscription.status} status. Please complete the payment.`,
        };
      }
    } catch (error: any) {
      console.error('[activateSubscription] Error:', error);
      return {
        success: false,
        message: error.message || 'Failed to activate subscription',
      };
    }
  });
