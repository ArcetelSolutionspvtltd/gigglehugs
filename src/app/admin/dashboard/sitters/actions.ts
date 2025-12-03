'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const sitterSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  bio: z.string().min(10, 'Bio must be at least 10 characters.'),
  avatar_url: z
    .any()
    .refine((file) => !file || file.size === 0 || file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => !file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ).optional(),
  current_avatar_url: z.string().optional(),
});

export type FormState = {
  message: string;
  errors?: {
    name?: string[];
    bio?: string[];
    avatar_url?: string[];
  };
  success: boolean;
};

export async function upsertSitterAction(formData: FormData): Promise<FormState> {
  const validatedFields = sitterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const supabase = createClient();
  const { id, name, bio, avatar_url: avatarFile, current_avatar_url } = validatedFields.data;
  let avatarPath: string | undefined = undefined;

  try {
    if (avatarFile && avatarFile.size > 0) {
      let fileName: string;
      // If editing and an avatar exists, extract filename to overwrite
      if (id && current_avatar_url) {
        // Remove any query parameters from the URL before getting the filename
        const urlWithoutQuery = current_avatar_url.split('?')[0];
        fileName = urlWithoutQuery.split('/').pop()!;
      } else {
        // For new sitters or if no avatar exists, create a new filename
        const fileExtension = avatarFile.name.split('.').pop();
        fileName = `${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.${fileExtension}`;
      }

      const filePath = `sitters/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }
      
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(uploadData.path);
      
      // Append a timestamp to force the browser to refetch the image
      avatarPath = `${publicUrlData.publicUrl}?t=${new Date().getTime()}`;
    }
    
    const dataToUpsert: any = { name, bio };
    if (id) {
      dataToUpsert.id = id;
    }
    if (avatarPath) {
      dataToUpsert.avatar_url = avatarPath;
    }

    const { error: dbError } = await supabase.from('sitters').upsert(dataToUpsert).select().single();

    if (dbError) {
      throw dbError;
    }

  } catch (error: any) {
    console.error('Storage/DB error:', error);
    if (error.message.includes('Bucket not found')) {
      return { message: "Failed to upload avatar: The 'avatars' bucket was not found. Please create it in your Supabase project.", success: false, errors: {}};
    }
    return { message: `Operation failed: ${error.message}`, success: false, errors: {} };
  }


  revalidatePath('/admin/dashboard/sitters');
  revalidatePath('/');

  return {
    message: `Sitter ${id ? 'updated' : 'added'} successfully.`,
    success: true,
    errors: {},
  };
}

export async function deleteSitterAction(sitterId: number) {
    const supabase = createClient();
    
    // Optionally, delete the avatar from storage first
    // You would need to fetch the sitter's avatar_url before deleting the record
    
    const { error } = await supabase.from('sitters').delete().match({ id: sitterId });

    if (error) {
        console.error('Supabase delete error:', error);
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
