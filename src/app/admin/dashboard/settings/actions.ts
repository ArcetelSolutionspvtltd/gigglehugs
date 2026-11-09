'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { query, queryOne } from '@/lib/db';
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

    const currentSettings = await queryOne<{ value: ColorTheme }>(
      "select value from public.settings where key = 'theme' limit 1"
    );

    const updatedValue = { ...currentSettings?.value, ...newSettings };

    await query(
      `insert into public.settings (key, value)
       values ('theme', $1::jsonb)
       on conflict (key) do update set value = excluded.value`,
      [JSON.stringify(updatedValue)]
    );

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
        await query("delete from public.settings where key = 'theme'");

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
