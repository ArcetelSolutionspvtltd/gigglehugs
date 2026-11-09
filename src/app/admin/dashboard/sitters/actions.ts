'use server';

import { query, queryOne } from '@/lib/db';
import { deleteObjectByUrl, uploadObject } from '@/lib/r2';
import { optionalId } from '@/lib/validation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const sitterSchema = z.object({
  id: optionalId,
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  bio: z.string().min(10, 'Bio must be at least 10 characters.').max(150, 'Bio cannot exceed 150 characters.'),
  email_name: z.string().min(2, "Please enter a valid email name.").optional().or(z.literal('')),
  avatar_file: z.instanceof(File).optional(),
  current_avatar_url: z.string().optional(),
});

export type FormState = {
  message: string;
  success: boolean;
  errors?: {
    name?: string[];
    bio?: string[];
    email_name?: string[];
    avatar_file?: string[];
  };
};

export async function upsertSitterAction(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    const validatedFields = sitterSchema.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        bio: formData.get('bio'),
        email_name: formData.get('email_name'),
        current_avatar_url: formData.get('current_avatar_url'),
        avatar_file: formData.get('avatar_file'),
    });
    
    if (!validatedFields.success) {
      return {
        message: 'Validation failed. Please check your inputs.',
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { id, name, bio, email_name, avatar_file, current_avatar_url } = validatedFields.data;
    let avatarPath: string | undefined | null = current_avatar_url;

    const email = email_name ? `${email_name}@gigglehugs.co.zw` : null;
    let uploadedNewAvatar = false;

    if (avatar_file && avatar_file.size > 0) {
      const fileBuffer = Buffer.from(await avatar_file.arrayBuffer());
      const fileName = `${uuidv4()}.${avatar_file.name.split('.').pop() || 'png'}`;
      const objectKey = `avatars/sitters/${fileName}`;
      const publicUrl = await uploadObject(
        objectKey,
        fileBuffer,
        avatar_file.type || 'application/octet-stream'
      );

      avatarPath = `${publicUrl}?t=${new Date().getTime()}`;
      uploadedNewAvatar = true;
    }

    if (id !== undefined) {
      await query(
        `insert into public.sitters (id, name, bio, email, avatar_url)
         values ($1, $2, $3, $4, $5)
         on conflict (id) do update
         set name = excluded.name,
             bio = excluded.bio,
             email = excluded.email,
             avatar_url = excluded.avatar_url`,
        [id, name, bio, email, avatarPath ?? null]
      );
    } else {
      await query(
        `insert into public.sitters (name, bio, email, avatar_url)
         values ($1, $2, $3, $4)`,
        [name, bio, email, avatarPath ?? null]
      );
    }

    if (uploadedNewAvatar && current_avatar_url) {
      try {
        await deleteObjectByUrl(current_avatar_url);
      } catch (error) {
        console.error('Failed to delete replaced sitter avatar:', error);
      }
    }

    revalidatePath('/admin/dashboard/sitters');
    revalidatePath('/');

    return {
      message: `Sitter ${id ? 'updated' : 'added'} successfully.`,
      success: true,
    };

  } catch (error: any) {
    console.error('Sitter Action Error:', error);
    return { message: `An unexpected server error occurred. Please try again.`, success: false };
  }
}

export async function deleteSitterAction(sitterId: number) {
    try {
        const sitter = await queryOne<{ avatar_url: string | null }>(
          'select avatar_url from public.sitters where id = $1',
          [sitterId]
        );

        await query('delete from public.sitters where id = $1', [sitterId]);

        try {
          await deleteObjectByUrl(sitter?.avatar_url);
        } catch (error) {
          console.error('Failed to delete sitter avatar from R2:', error);
        }
    } catch (error: any) {
        console.error('Database delete error:', error);
        return {
            message: error.message,
            success: false,
        }
    }

    revalidatePath('/admin/dashboard/sitters');
    revalidatePath('/');

    return {
        message: 'Sitter deleted successfully.',
        success: true,
    }
}
