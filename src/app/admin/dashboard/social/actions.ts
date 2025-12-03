'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const socialLinkSchema = z.object({
  id: z.coerce.number().optional(),
  platform: z.string().min(2, 'Please select a platform.'),
  url: z.string().url('Please enter a valid URL.'),
});

export type FormState = {
  message: string;
  errors?: {
    platform?: string[];
    url?: string[];
  };
  success: boolean;
};

export async function upsertSocialLinkAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = socialLinkSchema.safeParse({
    id: formData.get('id'),
    platform: formData.get('platform'),
    url: formData.get('url'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const supabase = createClient();
  const { id, platform, url } = validatedFields.data;
  // The icon_name is the same as the platform name
  const icon_name = platform;

  try {
    // Check for uniqueness on platform or URL
    let query = supabase.from('social_links').select('id').or(`platform.eq.${platform},url.eq.${url}`);
    if (id) {
        query = query.neq('id', id);
    }
    const { data: existing, error: existingError } = await query;

    if (existingError) throw existingError;
    if (existing && existing.length > 0) {
        return {
            message: 'A social link with this platform or URL already exists.',
            success: false,
        }
    }
    
    const { error } = await supabase.from('social_links').upsert({ id, platform, url, icon_name });

    if (error) {
      throw error;
    }

  } catch(error: any) {
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
