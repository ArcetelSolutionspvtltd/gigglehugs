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

export async function upsertSitterAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = sitterSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    bio: formData.get('bio'),
    avatar_url: formData.get('avatar_url'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const supabase = createClient();
  const { id, name, bio, avatar_url: avatarFile } = validatedFields.data;
  let avatarPath: string | undefined = undefined;

  if (avatarFile && avatarFile.size > 0) {
    const fileExtension = avatarFile.name.split('.').pop();
    // Create a URL-friendly filename from the sitter's name
    const fileName = `${name.toLowerCase().replace(/\s+/g, '_')}.${fileExtension}`;
    
    // Upload to 'sitters' bucket in 'avatars' folder
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('sitters')
      .upload(`avatars/${fileName}`, avatarFile, { upsert: true }); // Use upsert to overwrite if exists

    if (uploadError) {
      console.error('Storage error:', uploadError);
      return { message: 'Failed to upload avatar.', success: false };
    }
    
    const { data: publicUrlData } = supabase.storage
      .from('sitters')
      .getPublicUrl(uploadData.path);
      
    avatarPath = publicUrlData.publicUrl;
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
    console.error('Supabase error:', dbError);
    return {
      message: dbError.message,
      success: false,
    };
  }

  revalidatePath('/admin/dashboard/sitters');
  revalidatePath('/'); // Also revalidate home page

  return {
    message: `Sitter ${id ? 'updated' : 'added'} successfully.`,
    success: true,
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
