import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

export const removeDeviceProcedure = protectedProcedure
  .input(z.object({
    deviceId: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const { error } = await ctx.supabase
      .from('bound_devices')
      .delete()
      .eq('user_id', userId)
      .eq('device_id', input.deviceId);

    if (error) {
      console.error('Error removing device:', error);
      throw new Error('Failed to remove device');
    }

    return {
      success: true,
      deviceId: input.deviceId,
    };
  });
