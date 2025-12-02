'use server';

import {
  generateBabysitterBio,
  type GenerateBabysitterBioInput,
} from '@/ai/flows/generate-babysitter-bio';
import { z } from 'zod';

const formSchema = z.object({
  experience: z.string().min(10, 'Please provide more details about the experience.'),
  certifications: z.string().min(3, 'Please list at least one certification.'),
});

export type FormState = {
  message: string;
  bio: string | null;
  errors?: {
    experience?: string[];
    certifications?: string[];
  }
}

export async function generateBioAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    experience: formData.get('experience'),
    certifications: formData.get('certifications'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your inputs.',
      bio: null,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const input: GenerateBabysitterBioInput = validatedFields.data;

  try {
    const result = await generateBabysitterBio(input);
    return {
      message: 'Bio generated successfully!',
      bio: result.bio,
    };
  } catch (error) {
    console.error('Error generating bio:', error);
    return {
      message: 'An error occurred while generating the bio. Please try again.',
      bio: null,
    };
  }
}
