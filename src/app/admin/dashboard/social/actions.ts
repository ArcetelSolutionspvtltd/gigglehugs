'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const socialLinkSchema = z.object({
  id: z.coerce.number().optional(),
  platform: z.string().min(2, 'Platform name must be at least 2 characters.'),
  url: z.string().url('Please enter a valid URL.'),
  icon_name: z.string().min(1, 'Please select an icon.'),
});

export type FormState = {
  message: string;
  errors?: {
    platform?: string[];
    url?: string[];
    icon_name?: string[];
  };
  success: boolean;
};

export async function upsertSocialLinkAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = socialLinkSchema.safeParse({
    id: formData.get('id'),
    platform: formData.get('platform'),
    url: formData.get('url'),
    icon_name: formData.get('icon_name'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const supabase = createClient();
  const { id, ...linkData } = validatedFields.data;

  const { error } = await supabase.from('social_links').upsert(validatedFields.data);

  if (error) {
    console.error('Supabase error:', error);
    return {
      message: error.message,
      success: false,
    };
  }

  revalidatePath('/admin/dashboard/social');
  revalidatePath('/'); 

  return {
    message: `Link ${id ? 'updated' : 'added'} successfully.`,
    success: true,
  };
}

export async function deleteSocialLinkAction(linkId: number) {
    const supabase = createClient();
    const { error } = await supabase.from('social_links').delete().match({ id: linkId });

    if (error) {
        console.error('Supabase delete error:', error);
        return {
            message: error.message,
            success: false,
        }
    }

    revalidatePath('/admin/dashboard/social');
    revalidatePath('/');

    return {
        message: 'Social link deleted successfully.',
        success: true,
    }
}
