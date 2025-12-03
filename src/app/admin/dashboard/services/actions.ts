'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { iconMap } from '@/lib/icons';

const serviceSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  icon_name: z.string().refine(val => Object.keys(iconMap).includes(val), {
    message: 'Please select a valid icon.',
  }),
});

export type FormState = {
  message: string;
  errors?: {
    title?: string[];
    description?: string[];
    icon_name?: string[];
  };
  success: boolean;
};

export async function upsertServiceAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = serviceSchema.safeParse({
    id: formData.get('id'),
    title: formData.get('title'),
    description: formData.get('description'),
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
  const { id, ...serviceData } = validatedFields.data;

  const { error } = await supabase.from('services').upsert(validatedFields.data);

  if (error) {
    console.error('Supabase error:', error);
    return {
      message: error.message,
      success: false,
    };
  }

  revalidatePath('/admin/dashboard/services');
  revalidatePath('/'); // Also revalidate home page

  return {
    message: `Service ${id ? 'updated' : 'added'} successfully.`,
    success: true,
  };
}

export async function deleteServiceAction(serviceId: number) {
    const supabase = createClient();
    const { error } = await supabase.from('services').delete().match({ id: serviceId });

    if (error) {
        console.error('Supabase delete error:', error);
        return {
            message: error.message,
            success: false,
        }
    }

    revalidatePath('/admin/dashboard/services');
    revalidatePath('/');

    return {
        message: 'Service deleted successfully.',
        success: true,
    }
}
