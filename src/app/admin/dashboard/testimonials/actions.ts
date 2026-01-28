'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const testimonialSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  bio: z.string().min(3, 'Bio must be at least 3 characters.'),
  testimonial: z.string().min(10, 'Testimonial must be at least 10 characters.').max(150, 'Testimonial cannot exceed 150 characters.'),
  rating: z.coerce.number().min(1).max(5),
  avatar_url: z.any().optional(),
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
    avatar_url?: string[];
  };
};

export async function upsertTestimonialAction(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const avatarFile = formData.get('avatar_url');

    const validatedFields = testimonialSchema.safeParse({
      ...rawData,
      avatar_url: avatarFile instanceof File ? avatarFile : undefined,
    });

    if (!validatedFields.success) {
      console.error('Validation failed:', validatedFields.error.flatten().fieldErrors);
      return {
        message: 'Validation failed. Please check your inputs.',
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    const supabase = createClient();
    const { id, name, bio, testimonial, rating, avatar_url: validatedAvatarFile, current_avatar_url } = validatedFields.data;
    let avatarPath: string | undefined = undefined;

    if (validatedAvatarFile && validatedAvatarFile.size > 0) {
      if(validatedAvatarFile.size > MAX_FILE_SIZE) {
        return { message: `Max image size is 5MB.`, success: false };
      }
      if(!ACCEPTED_IMAGE_TYPES.includes(validatedAvatarFile.type)) {
        return { message: "Only .jpg, .jpeg, .png and .webp formats are supported.", success: false };
      }

      let fileName: string;
      const fileExtension = validatedAvatarFile.name.split('.').pop();
      
      // If editing and an avatar exists, use its filename to overwrite
      if (id && current_avatar_url) {
        const urlWithoutQuery = current_avatar_url.split('?')[0];
        fileName = urlWithoutQuery.split('/').pop()!;
      } else {
        fileName = `${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.${fileExtension}`;
      }

      const filePath = `testimonials/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, validatedAvatarFile, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }
      
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(uploadData.path);
      
      avatarPath = `${publicUrlData.publicUrl}?t=${new Date().getTime()}`;
    }
    
    const dataToUpsert: any = { name, bio, testimonial, rating };
    if (id) {
      dataToUpsert.id = id;
    }
    if (avatarPath) {
      dataToUpsert.avatar_url = avatarPath;
    }

    const { error: dbError } = await supabase.from('testimonials').upsert(dataToUpsert).select().single();

    if (dbError) {
      throw dbError;
    }

    revalidatePath('/admin/dashboard/testimonials');
    revalidatePath('/');

    return {
      message: `Testimonial ${id ? 'updated' : 'added'} successfully.`,
      success: true,
    };
  } catch (error: any) {
    console.error('Testimonial Action Error:', error);
    if (error.message.includes('Bucket not found')) {
      return { message: "Failed to upload avatar: The 'avatars' bucket was not found. Please create it in your Supabase project.", success: false };
    }
    return { message: `An unexpected server error occurred. Please try again.`, success: false };
  }
}

export async function deleteTestimonialAction(testimonialId: number) {
    const supabase = createClient();
    
    // TODO: Optionally, delete the avatar from storage first
    
    const { error } = await supabase.from('testimonials').delete().match({ id: testimonialId });

    if (error) {
        console.error('Supabase delete error:', error);
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
