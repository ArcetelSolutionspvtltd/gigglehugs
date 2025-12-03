'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const faqSchema = z.object({
  id: z.coerce.number().optional(),
  question: z.string().min(10, 'Question must be at least 10 characters.'),
  answer: z.string().min(10, 'Answer must be at least 10 characters.'),
});

export type FormState = {
  message: string;
  errors?: {
    question?: string[];
    answer?: string[];
  };
  success: boolean;
};

export async function upsertFaqAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = faqSchema.safeParse({
    id: formData.get('id'),
    question: formData.get('question'),
    answer: formData.get('answer'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const supabase = createClient();
  const { id } = validatedFields.data;

  const { error } = await supabase.from('faqs').upsert(validatedFields.data);

  if (error) {
    console.error('Supabase error:', error);
    return {
      message: error.message,
      success: false,
    };
  }

  revalidatePath('/admin/dashboard/faqs');
  revalidatePath('/'); // Also revalidate home page

  return {
    message: `FAQ ${id ? 'updated' : 'added'} successfully.`,
    success: true,
  };
}

export async function deleteFaqAction(faqId: number) {
    const supabase = createClient();
    const { error } = await supabase.from('faqs').delete().match({ id: faqId });

    if (error) {
        console.error('Supabase delete error:', error);
        return {
            message: error.message,
            success: false,
        }
    }

    revalidatePath('/admin/dashboard/faqs');
    revalidatePath('/');

    return {
        message: 'FAQ deleted successfully.',
        success: true,
    }
}
