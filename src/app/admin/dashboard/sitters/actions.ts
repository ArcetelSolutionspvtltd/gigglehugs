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
    avatar_data_uri?: string[];
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
      avatar_data_uri: formData.get('avatar_data_uri'),
    });
    
    if (!validatedFields.success) {
      return {
        message: 'Validation failed. Please check your inputs.',
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const supabase = createClient();
    const { id, name, bio, email_name, avatar_data_uri, current_avatar_url } = validatedFields.data;
    let avatarPath: string | undefined = undefined;

    const email = email_name ? `${email_name}@gigglehugs.co.zw` : null;
    
    const validAvatarDataUri = avatar_data_uri && avatar_data_uri.startsWith('data:image/');

    if (validAvatarDataUri) {
      const base64Data = avatar_data_uri.replace(/^data:image\/\w+;base64,/, "");

      // Use web-standard `atob` and `Uint8Array` instead of Node's `Buffer`
      const binary = atob(base64Data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const contentType = avatar_data_uri.substring(avatar_data_uri.indexOf(':') + 1, avatar_data_uri.indexOf(';'));
      const fileExtension = contentType.split('/')[1] || 'png';
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = `sitters/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, bytes, { contentType, upsert: false });

      if (uploadError) throw uploadError;
      if (!uploadData) throw new Error("Supabase upload returned no data and no error.");
      
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(uploadData.path);
      
      avatarPath = `${publicUrlData.publicUrl}?t=${new Date().getTime()}`;
    }
    
    const dataToUpsert: any = { name, bio, email };
    if (id) {
      dataToUpsert.id = id;
    }

    if (avatarPath) {
      dataToUpsert.avatar_url = avatarPath;
    } else if (id) {
      dataToUpsert.avatar_url = current_avatar_url;
    } else {
      dataToUpsert.avatar_url = null;
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
