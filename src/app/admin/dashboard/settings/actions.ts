'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { suggestTheme } from '@/ai/flows/theme-suggestion';
import { createClient } from '@/lib/supabase/server';
import type { ColorTheme } from '@/lib/types';

const themeSchema = z.object({
  prompt: z.string().min(3, 'Prompt must be at least 3 characters.'),
});

export type FormState = {
  message: string;
  success: boolean;
  errors?: {
    prompt?: string[];
  };
  newTheme?: ColorTheme | null;
};

export async function generateThemeAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = themeSchema.safeParse({
    prompt: formData.get('prompt'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const theme = await suggestTheme({ prompt: validatedFields.data.prompt });
    
    // Save to DB
    const supabase = createClient();
    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'theme', value: theme }, { onConflict: 'key' });

    if (error) throw error;
    
    revalidatePath('/', 'layout');

    return {
      message: 'New theme generated and applied!',
      success: true,
      newTheme: theme,
    };
  } catch (error: any) {
    return {
      message: `Failed to generate theme: ${error.message}`,
      success: false,
    };
  }
}

export async function resetThemeAction() {
    try {
        const supabase = createClient();
        const { error } = await supabase.from('settings').delete().eq('key', 'theme');
        if (error) throw error;

        revalidatePath('/', 'layout');

        return {
            message: 'Theme has been reset to default.',
            success: true,
        }
    } catch (error: any) {
        return {
            message: `Failed to reset theme: ${error.message}`,
            success: false,
        }
    }
}
