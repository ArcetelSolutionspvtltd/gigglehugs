'use server';

import { query, queryOne } from '@/lib/db';
import { optionalId } from '@/lib/validation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const socialLinkSchema = z.object({
  id: optionalId,
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

  const { id, platform, url } = validatedFields.data;
  // The icon_name is the same as the platform name
  const icon_name = platform;

  try {
    const existing = await queryOne<{ id: number }>(
      `select id from public.social_links
       where (platform = $1 or url = $2)
         and ($3::int is null or id <> $3)
       limit 1`,
      [platform, url, id ?? null]
    );

    if (existing) {
        return {
            message: 'A social link with this platform or URL already exists.',
            success: false,
        }
    }

    if (id !== undefined) {
      await query(
        `insert into public.social_links (id, platform, url, icon_name)
         values ($1, $2, $3, $4)
         on conflict (id) do update
         set platform = excluded.platform,
             url = excluded.url,
             icon_name = excluded.icon_name`,
        [id, platform, url, icon_name]
      );
    } else {
      await query(
        'insert into public.social_links (platform, url, icon_name) values ($1, $2, $3)',
        [platform, url, icon_name]
      );
    }

  } catch(error: any) {
    console.error('Database error:', error);
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
    try {
        await query('delete from public.social_links where id = $1', [linkId]);
    } catch (error: any) {
        console.error('Database delete error:', error);
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
