'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const contactSchema = z.object({
  id: z.coerce.number().optional(),
  contact_type: z.enum(['phone', 'email'], {
    errorMap: () => ({ message: 'Please select a valid type.' }),
  }),
  value: z.string().min(5, 'Value must be at least 5 characters.'),
});

export type FormState = {
  message: string;
  errors?: {
    contact_type?: string[];
    value?: string[];
  };
  success: boolean;
};

export async function upsertContactAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = contactSchema.safeParse({
    id: formData.get('id'),
    contact_type: formData.get('contact_type'),
    value: formData.get('value'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const supabase = createClient();
  const { id, ...contactData } = validatedFields.data;

  const { error } = await supabase.from('contact_details').upsert(validatedFields.data);

  if (error) {
    console.error('Supabase error:', error);
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
    const supabase = createClient();
    const { error } = await supabase.from('contact_details').delete().match({ id: contactId });

    if (error) {
        console.error('Supabase delete error:', error);
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
