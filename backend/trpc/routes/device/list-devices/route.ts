import { protectedProcedure } from '../../../create-context';

export const listDevicesProcedure = protectedProcedure
  .query(async ({ ctx }) => {
    const userId = ctx.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const { data: devices, error } = await ctx.supabase
      .from('bound_devices')
      .select('*')
      .eq('user_id', userId)
      .order('last_login', { ascending: false });

    if (error) {
      console.error('Error fetching devices:', error);
      throw new Error('Failed to fetch devices');
    }

    return {
      devices: devices || [],
    };
  });
