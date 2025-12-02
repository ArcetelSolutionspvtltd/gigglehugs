'use server';
/**
 * @fileOverview AI agent to generate babysitter bios.
 *
 * - generateBabysitterBio - A function that generates the babysitter bio.
 * - GenerateBabysitterBioInput - The input type for the generateBabysitterBio function.
 * - GenerateBabysitterBioOutput - The return type for the generateBabysitterBio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBabysitterBioInputSchema = z.object({
  experience: z
    .string()
    .describe('Description of the babysitter experience.'),
  certifications: z
    .string()
    .describe('Description of the babysitter certifications.'),
});
export type GenerateBabysitterBioInput = z.infer<
  typeof GenerateBabysitterBioInputSchema
>;

const GenerateBabysitterBioOutputSchema = z.object({
  bio: z.string().describe('The generated babysitter bio.'),
});
export type GenerateBabysitterBioOutput = z.infer<
  typeof GenerateBabysitterBioOutputSchema
>;

export async function generateBabysitterBio(
  input: GenerateBabysitterBioInput
): Promise<GenerateBabysitterBioOutput> {
  return generateBabysitterBioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBabysitterBioPrompt',
  input: {schema: GenerateBabysitterBioInputSchema},
  output: {schema: GenerateBabysitterBioOutputSchema},
  prompt: `You are a creative content writer specializing in writing babysitter profiles.

  Based on the following experience and certifications, generate an engaging and heartwarming bio for a babysitter.

  Experience: {{{experience}}}
  Certifications: {{{certifications}}}
  `,
});

const generateBabysitterBioFlow = ai.defineFlow(
  {
    name: 'generateBabysitterBioFlow',
    inputSchema: GenerateBabysitterBioInputSchema,
    outputSchema: GenerateBabysitterBioOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
