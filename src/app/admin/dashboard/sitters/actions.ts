'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const sitterSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  bio: z.string().min(10, 'Bio must be at least 10 characters.').max(150, 'Bio cannot exceed 150 characters.'),
  email_name: z.string().min(2, "Please enter a valid email name.").optional().or(z.literal('')),
  avatar_data_uri: z.string().optional(),
  current_avatar_url: z.string().optional(),
});

export type FormState = {
  message: string;
  success: boolean;
  errors?: {
    name?: string[];
    bio?: string[];
    email_name?: string[];
  };
};

export async function upsertSitterAction(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    const validatedFields = sitterSchema.safeParse(Object.fromEntries(formData.entries()));
    
    if (!validatedFields.success) {
      return {
        message: 'Validation failed. Please check your inputs.',
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const supabase = createClient();
    const { id, name, bio, email_name, avatar_data_uri, current_avatar_url } = validatedFields.data;
    let avatarPath: string | undefined | null = current_avatar_url;

    const email = email_name ? `${email_name}@gigglehugs.co.zw` : null;

    const avatarData = avatar_data_uri && avatar_data_uri.startsWith('data:image/')
        ? avatar_data_uri
        : null;

    if (avatarData) {
      const base64Data = avatarData.replace(/^data:image\/\w+;base64,/, "");
      const contentType = avatarData.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/png';
      
      const binary = atob(base64Data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      const fileName = `${uuidv4()}.png`;
      const filePath = `sitters/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, bytes, { contentType: contentType, upsert: true });

      if (uploadError) throw uploadError;
      if (!uploadData) throw new Error("Supabase upload returned no data and no error.");
      
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(uploadData.path);
      
      avatarPath = `${publicUrlData.publicUrl}?t=${new Date().getTime()}`;
    }
    
    const dataToUpsert: any = { name, bio, email, avatar_url: avatarPath };
    if (id) {
      dataToUpsert.id = id;
    }

    const { error: dbError } = await supabase.from('sitters').upsert(dataToUpsert).select().single();

    if (dbError) {
      throw dbError;
    }

    revalidatePath('/admin/dashboard/sitters');
    revalidatePath('/');

    return {
      message: `Sitter ${id ? 'updated' : 'added'} successfully.`,
      success: true,
    };

  } catch (error: any) {
    console.error('Sitter Action Error:', error);
    if (error.message.includes('Bucket not found')) {
      return { message: "Failed to upload avatar: The 'avatars' bucket was not found. Please create it in your Supabase project.", success: false };
    }
    return { message: `An unexpected server error occurred. Please try again.`, success: false };
  }
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
