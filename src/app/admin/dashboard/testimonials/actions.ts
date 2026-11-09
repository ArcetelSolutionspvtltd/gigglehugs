'use server';

import { query, queryOne } from '@/lib/db';
import { deleteObjectByUrl, uploadObject } from '@/lib/r2';
import { optionalId } from '@/lib/validation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const testimonialSchema = z.object({
  id: optionalId,
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  bio: z.string().min(3, 'Bio must be at least 3 characters.'),
  testimonial: z.string().min(10, 'Testimonial must be at least 10 characters.').max(150, 'Testimonial cannot exceed 150 characters.'),
  rating: z.coerce.number().min(1).max(5),
  avatar_file: z.instanceof(File).optional(),
  current_avatar_url: z.string().optional(),
});

export type FormState = {
  message: string;
  success: boolean;
  errors?: {
    name?: string[];
    bio?: string[];
    testimonial?: string[];
    rating?: string[];
    avatar_file?: string[];
  };
};

export async function upsertTestimonialAction(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    const validatedFields = testimonialSchema.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        bio: formData.get('bio'),
        testimonial: formData.get('testimonial'),
        rating: formData.get('rating'),
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
    
    const { id, name, bio, testimonial, rating, avatar_file, current_avatar_url } = validatedFields.data;
    let avatarPath: string | undefined | null = current_avatar_url;
    let uploadedNewAvatar = false;

    if (avatar_file && avatar_file.size > 0) {
      const fileBuffer = Buffer.from(await avatar_file.arrayBuffer());
      const fileName = `${uuidv4()}.${avatar_file.name.split('.').pop() || 'png'}`;
      const objectKey = `avatars/testimonials/${fileName}`;
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
        `insert into public.testimonials (id, name, bio, testimonial, rating, avatar_url)
         values ($1, $2, $3, $4, $5, $6)
         on conflict (id) do update
         set name = excluded.name,
             bio = excluded.bio,
             testimonial = excluded.testimonial,
             rating = excluded.rating,
             avatar_url = excluded.avatar_url`,
        [id, name, bio, testimonial, rating, avatarPath ?? null]
      );
    } else {
      await query(
        `insert into public.testimonials (name, bio, testimonial, rating, avatar_url)
         values ($1, $2, $3, $4, $5)`,
        [name, bio, testimonial, rating, avatarPath ?? null]
      );
    }

    if (uploadedNewAvatar && current_avatar_url) {
      try {
        await deleteObjectByUrl(current_avatar_url);
      } catch (error) {
        console.error('Failed to delete replaced testimonial avatar:', error);
      }
    }

    revalidatePath('/admin/dashboard/testimonials');
    revalidatePath('/');

    return {
      message: `Testimonial ${id ? 'updated' : 'added'} successfully.`,
      success: true,
    };
  } catch (error: any) {
    console.error('Testimonial Action Error:', error);
    return { message: `An unexpected server error occurred. Please try again.`, success: false };
  }
}

export async function deleteTestimonialAction(testimonialId: number) {
    try {
        const testimonial = await queryOne<{ avatar_url: string | null }>(
          'select avatar_url from public.testimonials where id = $1',
          [testimonialId]
        );

        await query('delete from public.testimonials where id = $1', [testimonialId]);

        try {
          await deleteObjectByUrl(testimonial?.avatar_url);
        } catch (error) {
          console.error('Failed to delete testimonial avatar from R2:', error);
        }
    } catch (error: any) {
        console.error('Database delete error:', error);
        return {
            message: error.message,
            success: false,
        }
    }

    revalidatePath('/admin/dashboard/testimonials');
    revalidatePath('/');

    return {
        message: 'Testimonial deleted successfully.',
        success: true,
    }
}
