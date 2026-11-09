'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export type State = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message: string;
};

export async function login(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields. Could not log in.',
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword(validatedFields.data);

  if (error) {
    return {
        message: error.message,
        errors: {}
    }
  }

  revalidatePath('/', 'layout');
  redirect('/admin/dashboard');
}