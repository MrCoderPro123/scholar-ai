// src/ai/flows/ai-study-assistant.ts
'use server';

/**
 * @fileOverview An AI study assistant that answers questions on a variety of subjects.
 *
 * - answerQuestion - A function that answers a student's question.
 * - AiStudyAssistantInput - The input type for the answerQuestion function.
 * - AiStudyAssistantOutput - The return type for the answerQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiStudyAssistantInputSchema = z.object({
  subject: z.string().describe('The subject of the question.'),
  question: z.string().describe('The question to be answered.'),
});
export type AiStudyAssistantInput = z.infer<typeof AiStudyAssistantInputSchema>;

const AiStudyAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
  explanation: z.string().describe('A detailed explanation of the answer.'),
});
export type AiStudyAssistantOutput = z.infer<typeof AiStudyAssistantOutputSchema>;

export async function answerQuestion(input: AiStudyAssistantInput): Promise<AiStudyAssistantOutput> {
  return aiStudyAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiStudyAssistantPrompt',
  input: {schema: AiStudyAssistantInputSchema},
  output: {schema: AiStudyAssistantOutputSchema},
  prompt: `You are an AI study assistant that answers questions on a variety of subjects.

  Subject: {{{subject}}}
  Question: {{{question}}}

  Answer the question and provide a detailed explanation.
  `,
});

const aiStudyAssistantFlow = ai.defineFlow(
  {
    name: 'aiStudyAssistantFlow',
    inputSchema: AiStudyAssistantInputSchema,
    outputSchema: AiStudyAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
