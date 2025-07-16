'use server';

/**
 * @fileOverview A flow that, given a subject, returns a list of relevant books from provided URLs or other web resources.
 *
 * - intelligentBookSearch - A function that handles the book search process.
 * - IntelligentBookSearchInput - The input type for the intelligentBookSearch function.
 * - IntelligentBookSearchOutput - The return type for the intelligentBookSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentBookSearchInputSchema = z.object({
  subject: z.string().describe('The subject to search for books about.'),
});
export type IntelligentBookSearchInput = z.infer<typeof IntelligentBookSearchInputSchema>;

const IntelligentBookSearchOutputSchema = z.object({
  books: z
    .array(
      z.object({
        title: z.string().describe('The title of the book.'),
        author: z.string().describe('The author of the book.'),
        description: z.string().describe('A short description of the book.'),
        coverImageUrl: z.string().url().describe('URL of the book cover image.'),
        url: z.string().url().describe('URL where the book can be found or purchased.'),
      })
    )
    .describe('A list of relevant books.'),
});
export type IntelligentBookSearchOutput = z.infer<typeof IntelligentBookSearchOutputSchema>;

export async function intelligentBookSearch(input: IntelligentBookSearchInput): Promise<IntelligentBookSearchOutput> {
  return intelligentBookSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentBookSearchPrompt',
  input: {schema: IntelligentBookSearchInputSchema},
  output: {schema: IntelligentBookSearchOutputSchema},
  prompt: `You are a helpful AI assistant that recommends books based on a given subject.

  Given the subject: {{{subject}}}
  Recommend a list of relevant books. Each book object should have the following fields: title, author, description, coverImageUrl, and url.
  The coverImageUrl and url must be valid URLs.
  Return the output in JSON format.
  `,
});

const intelligentBookSearchFlow = ai.defineFlow(
  {
    name: 'intelligentBookSearchFlow',
    inputSchema: IntelligentBookSearchInputSchema,
    outputSchema: IntelligentBookSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
