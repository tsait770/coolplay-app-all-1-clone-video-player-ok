import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

export const verifyDeviceProcedure = protectedProcedure
  .input(z.object({
    deviceId: z.string(),
    verificationCode: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const { data: verification, error: fetchError } = await ctx.supabase
      .from('device_verifications')
      .select('*')
      .eq('user_id', userId)
      .eq('device_id', input.deviceId)
      .eq('verification_code', input.verificationCode)
      .single();

    if (fetchError || !verification) {
      throw new Error('Invalid verification code');
    }

    if (new Date(verification.expires_at) < new Date()) {
      throw new Error('Verification code expired');
    }

    const { data: profile, error: profileError } = await ctx.supabase
      .from('profiles')
      .select('membership_tier')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      throw new Error('Failed to fetch user profile');
    }

    const maxDevices = getMaxDevices(profile.membership_tier);

    const { data: existingDevices, error: devicesError } = await ctx.supabase
      .from('bound_devices')
      .select('*')
      .eq('user_id', userId);

    if (devicesError) {
      throw new Error('Failed to fetch existing devices');
    }

    const deviceExists = existingDevices?.some(d => d.device_id === input.deviceId);
    
    if (!deviceExists && existingDevices && existingDevices.length >= maxDevices) {
      throw new Error(`Maximum devices (${maxDevices}) reached for your membership tier`);
    }

    const { error: upsertError } = await ctx.supabase
      .from('bound_devices')
      .upsert({
        user_id: userId,
        device_id: input.deviceId,
        device_name: verification.device_name,
        last_login: new Date().toISOString(),
      }, {
        onConflict: 'user_id,device_id'
      });

    if (upsertError) {
      throw new Error('Failed to bind device');
    }

    const { error: updateError } = await ctx.supabase
      .from('device_verifications')
      .update({ verified: true })
      .eq('user_id', userId)
      .eq('device_id', input.deviceId);

    if (updateError) {
      console.error('Error updating verification status:', updateError);
    }

    return {
      success: true,
      deviceId: input.deviceId,
    };
  });

function getMaxDevices(membershipTier: string): number {
  switch (membershipTier) {
    case 'free':
    case 'trial':
    case 'free_trial':
      return 1;
    case 'basic':
      return 3;
    case 'premium':
      return 3;
    default:
      return 1;
  }
}
