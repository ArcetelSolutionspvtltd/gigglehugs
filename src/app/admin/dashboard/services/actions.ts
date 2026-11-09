'use server';

import { query } from '@/lib/db';
import { optionalId } from '@/lib/validation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { iconMap } from '@/lib/icons';

const serviceSchema = z.object({
  id: optionalId,
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

  const { id, title, description, icon_name } = validatedFields.data;

  try {
    if (id !== undefined) {
      await query(
        `insert into public.services (id, title, description, icon_name)
         values ($1, $2, $3, $4)
         on conflict (id) do update
         set title = excluded.title,
             description = excluded.description,
             icon_name = excluded.icon_name`,
        [id, title, description, icon_name]
      );
    } else {
      await query(
        'insert into public.services (title, description, icon_name) values ($1, $2, $3)',
        [title, description, icon_name]
      );
    }
  } catch (error: any) {
    console.error('Database error:', error);
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
    try {
        await query('delete from public.services where id = $1', [serviceId]);
    } catch (error: any) {
        console.error('Database delete error:', error);
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
