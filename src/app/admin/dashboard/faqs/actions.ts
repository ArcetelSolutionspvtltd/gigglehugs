'use server';

import { query } from '@/lib/db';
import { optionalId } from '@/lib/validation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const faqSchema = z.object({
  id: optionalId,
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

  const { id, question, answer } = validatedFields.data;

  try {
    if (id !== undefined) {
      await query(
        `insert into public.faqs (id, question, answer)
         values ($1, $2, $3)
         on conflict (id) do update
         set question = excluded.question, answer = excluded.answer`,
        [id, question, answer]
      );
    } else {
      await query(
        'insert into public.faqs (question, answer) values ($1, $2)',
        [question, answer]
      );
    }
  } catch (error: any) {
    console.error('Database error:', error);
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
    try {
        await query('delete from public.faqs where id = $1', [faqId]);
    } catch (error: any) {
        console.error('Database delete error:', error);
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
