import { z } from 'zod';
import { publicProcedure } from '@/backend/trpc/create-context';

const createCheckoutSessionSchema = z.object({
  userId: z.string(),
  priceId: z.string(),
  successUrl: z.string(),
  cancelUrl: z.string(),
});

export const createCheckoutSessionProcedure = publicProcedure
  .input(createCheckoutSessionSchema)
  .mutation(async ({ input }) => {
    const { userId, priceId, successUrl, cancelUrl } = input;

    try {
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      
      if (!stripeSecretKey) {
        throw new Error('Stripe secret key not configured');
      }

      const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'mode': 'subscription',
          'client_reference_id': userId,
          'success_url': successUrl,
          'cancel_url': cancelUrl,
          'line_items[0][price]': priceId,
          'line_items[0][quantity]': '1',
          'metadata[userId]': userId,
        }).toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Stripe API error:', errorText);
        throw new Error('Failed to create checkout session');
      }

      const session = await response.json();

      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error) {
      console.error('Create checkout session error:', error);
      throw new Error('Failed to create checkout session');
    }
  });

export default createCheckoutSessionProcedure;
