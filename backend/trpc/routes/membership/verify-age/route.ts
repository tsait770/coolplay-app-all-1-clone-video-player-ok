import { publicProcedure } from '../../../create-context';
import { z } from 'zod';

export const verifyAgeProcedure = publicProcedure
  .input(
    z.object({
      dateOfBirth: z.string(), // ISO date string
      confirmAdult: z.boolean(),
    })
  )
  .output(
    z.object({
      success: z.boolean(),
      ageVerified: z.boolean(),
      message: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Parse date of birth
    const dob = new Date(input.dateOfBirth);
    const today = new Date();
    
    // Calculate age
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    // Check if user is 18 or older
    if (age < 18) {
      return {
        success: false,
        ageVerified: false,
        message: 'You must be at least 18 years old to access adult content.',
      };
    }

    // Require explicit confirmation
    if (!input.confirmAdult) {
      return {
        success: false,
        ageVerified: false,
        message: 'You must confirm that you are an adult to proceed.',
      };
    }

    // Update user age verification status
    const { error } = await ctx.supabase
      .from('users')
      .update({
        age_verified: true,
        age_verification_date: new Date().toISOString(),
        date_of_birth: input.dateOfBirth,
      })
      .eq('id', userId);

    if (error) {
      console.error('[verifyAge] Error updating user:', error);
      throw new Error('Failed to verify age');
    }

    console.log('[verifyAge] Age verified for user:', userId);

    return {
      success: true,
      ageVerified: true,
      message: 'Age verification successful. You can now access adult content.',
    };
  });
