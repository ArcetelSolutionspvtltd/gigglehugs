'use server';

import { query, queryOne } from '@/lib/db';
import { optionalId } from '@/lib/validation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const contactSchema = z.object({
  id: optionalId,
  type: z.enum(['1', '2'], { // 1 for phone, 2 for email
    errorMap: () => ({ message: 'Please select a valid type.' }),
  }).transform(v => parseInt(v, 10)),
  value: z.string().min(5, 'Value must be at least 5 characters.'),
});

export type FormState = {
  message: string;
  errors?: {
    type?: string[];
    value?: string[];
  };
  success: boolean;
};

export async function upsertContactAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = contactSchema.safeParse({
    id: formData.get('id'),
    type: formData.get('type'),
    value: formData.get('value'),
  });
  
  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { id, type, value } = validatedFields.data;

  try {
     const existing = await queryOne<{ id: number }>(
       `select id from public.contact_details
        where value = $1 and ($2::int is null or id <> $2)
        limit 1`,
       [value, id ?? null]
     );

    if (existing) {
        return {
            message: 'This contact detail already exists.',
            success: false,
        }
    }

    if (id !== undefined) {
      await query(
        `insert into public.contact_details (id, type, value)
         values ($1, $2, $3)
         on conflict (id) do update
         set type = excluded.type, value = excluded.value`,
        [id, type, value]
      );
    } else {
      await query(
        'insert into public.contact_details (type, value) values ($1, $2)',
        [type, value]
      );
    }

  } catch(error: any) {
    console.error('Database error:', error);
    return {
      message: error.message,
      success: false,
    };
  }
  
  revalidatePath('/admin/dashboard/contact');
  revalidatePath('/'); 

  return {
    message: `Contact ${id ? 'updated' : 'added'} successfully.`,
    success: true,
  };
}

export async function deleteContactAction(contactId: number) {
    try {
        await query('delete from public.contact_details where id = $1', [contactId]);
    } catch (error: any) {
        console.error('Database delete error:', error);
        return {
            message: error.message,
            success: false,
        }
    }

    revalidatePath('/admin/dashboard/contact');
    revalidatePath('/');

    return {
        message: 'Contact detail deleted successfully.',
        success: true,
    }
}
