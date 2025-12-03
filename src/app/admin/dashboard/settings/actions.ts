'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import type { ColorTheme } from '@/lib/types';

const themeSchema = z.object({
  font: z.string().min(3, 'Please select a font.'),
});

export type FormState = {
  message: string;
  success: boolean;
  errors?: {
    font?: string[];
  };
  newTheme?: Partial<ColorTheme> | null;
};

export async function generateThemeAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = themeSchema.safeParse({
    font: formData.get('font'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const newSettings: Partial<ColorTheme> = { font: validatedFields.data.font };
    
    const supabase = createClient();
    const { data: currentSettings } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'theme')
      .single();

    const updatedValue = { ...currentSettings?.value, ...newSettings };
    
    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'theme', value: updatedValue }, { onConflict: 'key' });

    if (error) throw error;
    
    revalidatePath('/', 'layout');

    return {
      message: 'Appearance settings updated!',
      success: true,
      newTheme: newSettings,
    };
  } catch (error: any) {
    return {
      message: `Failed to update settings: ${error.message}`,
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
