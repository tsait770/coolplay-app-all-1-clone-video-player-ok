import { publicProcedure } from '../../../create-context';
import { z } from 'zod';

export const getMembershipStatusProcedure = publicProcedure
  .output(
    z.object({
      tier: z.enum(['free_trial', 'free', 'basic', 'premium']),
      quotas: z.object({
        freeTrialRemaining: z.number(),
        dailyFreeQuota: z.number(),
        monthlyBasicQuota: z.number(),
        dailyBasicBonus: z.number(),
      }),
      devices: z.object({
        current: z.number(),
        maximum: z.number(),
      }),
      ageVerified: z.boolean(),
      expiresAt: z.string().nullable(),
    })
  )
  .query(async ({ ctx }) => {
    const userId = ctx.user?.id;

    if (!userId) {
      return {
        tier: 'free' as const,
        quotas: {
          freeTrialRemaining: 0,
          dailyFreeQuota: 30,
          monthlyBasicQuota: 0,
          dailyBasicBonus: 0,
        },
        devices: {
          current: 0,
          maximum: 1,
        },
        ageVerified: false,
        expiresAt: null,
      };
    }

    const { data: user, error } = await ctx.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      console.error('[getMembershipStatus] Error fetching user:', error);
      throw new Error('Failed to fetch membership status');
    }

    const { data: devices } = await ctx.supabase
      .from('user_devices')
      .select('id')
      .eq('user_id', userId)
      .eq('is_active', true);

    return {
      tier: user.membership_level as 'free_trial' | 'free' | 'basic' | 'premium',
      quotas: {
        freeTrialRemaining: user.free_trial_remaining || 0,
        dailyFreeQuota: user.daily_free_quota || 0,
        monthlyBasicQuota: user.monthly_basic_quota || 0,
        dailyBasicBonus: user.daily_basic_bonus || 0,
      },
      devices: {
        current: devices?.length || 0,
        maximum: user.max_devices || 1,
      },
      ageVerified: user.age_verified || false,
      expiresAt: user.membership_expires_at || null,
    };
  });
