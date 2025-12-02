'use server';
/**
 * @fileOverview AI flow for suggesting theme colors.
 *
 * - suggestTheme - A function that suggests a color theme.
 * - SuggestThemeInput - The input type for the suggestTheme function.
 * - SuggestThemeOutput - The return type for the suggestTheme function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestThemeInputSchema = z.object({
  prompt: z.string().describe('The user prompt for the theme.'),
});
export type SuggestThemeInput = z.infer<typeof SuggestThemeInputSchema>;

const SuggestThemeOutputSchema = z.object({
  primary: z
    .string()
    .describe('The primary color in HSL format e.g. 240 50% 50%.'),
  background: z
    .string()
    .describe('The background color in HSL format e.g. 0 0% 100%.'),
  accent: z
    .string()
    .describe('The accent color in HSL format e.g. 300 70% 80%.'),
});
export type SuggestThemeOutput = z.infer<typeof SuggestThemeOutputSchema>;

export async function suggestTheme(
  input: SuggestThemeInput
): Promise<SuggestThemeOutput> {
  return suggestThemeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestThemePrompt',
  input: { schema: SuggestThemeInputSchema },
  output: { schema: SuggestThemeOutputSchema },
  prompt: `You are a creative designer. Based on the user's prompt, suggest a color theme.
  User prompt: {{{prompt}}}`,
});

const suggestThemeFlow = ai.defineFlow(
  {
    name: 'suggestThemeFlow',
    inputSchema: SuggestThemeInputSchema,
    outputSchema: SuggestThemeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
