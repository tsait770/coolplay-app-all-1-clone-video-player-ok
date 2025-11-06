import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

function generateVerificationCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const generateVerificationProcedure = protectedProcedure
  .input(z.object({
    deviceId: z.string(),
    deviceName: z.string().optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);



    const { error: upsertError } = await ctx.supabase
      .from('device_verifications')
      .upsert({
        user_id: userId,
        device_id: input.deviceId,
        device_name: input.deviceName,
        verification_code: verificationCode,
        expires_at: expiresAt.toISOString(),
        verified: false,
      }, {
        onConflict: 'user_id,device_id'
      });

    if (upsertError) {
      console.error('Error creating verification:', upsertError);
      throw new Error('Failed to create verification code');
    }

    const qrCodeData = JSON.stringify({
      userId,
      deviceId: input.deviceId,
      code: verificationCode,
    });

    return {
      verificationCode,
      qrCodeData,
      expiresAt: expiresAt.toISOString(),
    };
  });
