import { z } from 'zod';
import { publicProcedure } from '@/backend/trpc/create-context';

const cancelSubscriptionSchema = z.object({
  userId: z.string(),
  subscriptionId: z.string().optional(),
});

export const cancelSubscriptionProcedure = publicProcedure
  .input(cancelSubscriptionSchema)
  .mutation(async ({ input }) => {
    const { subscriptionId } = input;

    try {
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      
      if (!stripeSecretKey) {
        throw new Error('Stripe secret key not configured');
      }

      if (!subscriptionId) {
        throw new Error('Subscription ID is required');
      }

      const response = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Stripe API error:', errorText);
        throw new Error('Failed to cancel subscription');
      }

      const canceledSubscription = await response.json();

      return {
        success: true,
        subscriptionId: canceledSubscription.id,
        status: canceledSubscription.status,
      };
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw new Error('Failed to cancel subscription');
    }
  });

export default cancelSubscriptionProcedure;
