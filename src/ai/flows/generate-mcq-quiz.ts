'use server';
/**
 * @fileOverview Generates a multiple-choice quiz on a given topic.
 *
 * - generateMCQQuiz - A function that handles the quiz generation process.
 * - GenerateMCQQuizInput - The input type for the generateMCQQuiz function.
 * - GenerateMCQQuizOutput - The return type for the generateMCQQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMCQQuizInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate the quiz.'),
});
export type GenerateMCQQuizInput = z.infer<typeof GenerateMCQQuizInputSchema>;

const MCQSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('An array of 4 multiple choice options.'),
  correctAnswer: z.string().describe('The correct answer from the options.'),
});

const GenerateMCQQuizOutputSchema = z.object({
  quiz: z.array(MCQSchema).describe('An array of 5 quiz questions.'),
});
export type GenerateMCQQuizOutput = z.infer<typeof GenerateMCQQuizOutputSchema>;

export async function generateMCQQuiz(input: GenerateMCQQuizInput): Promise<GenerateMCQQuizOutput> {
  return generateMCQQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMCQQuizPrompt',
  input: {schema: GenerateMCQQuizInputSchema},
  output: {schema: GenerateMCQQuizOutputSchema},
  prompt: `You are an expert quiz generator. Generate a multiple-choice quiz with 5 questions on the following topic. Return the quiz as a JSON object that adheres to the output schema.

Topic: {{{topic}}}`,
});

const generateMCQQuizFlow = ai.defineFlow(
  {
    name: 'generateMCQQuizFlow',
    inputSchema: GenerateMCQQuizInputSchema,
    outputSchema: GenerateMCQQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
