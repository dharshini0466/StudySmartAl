'use server';

/**
 * @fileOverview AI agent that generates learning content based on a topic and content type.
 *
 * - generateLearningContent - A function that handles the generation of learning content.
 * - GenerateLearningContentInput - The input type for the generateLearningContent function.
 * - GenerateLearningContentOutput - The return type for the generateLearningContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentTypeSchema = z.enum(['notes', 'summary', 'quiz', 'flashcards']);

const GenerateLearningContentInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate learning content.'),
  contentType: ContentTypeSchema.describe('The type of content to generate (notes, summary, quiz, flashcards).'),
});

export type GenerateLearningContentInput = z.infer<typeof GenerateLearningContentInputSchema>;

const GenerateLearningContentOutputSchema = z.object({
  content: z.string().describe('The generated learning content.'),
});

export type GenerateLearningContentOutput = z.infer<typeof GenerateLearningContentOutputSchema>;

export async function generateLearningContent(input: GenerateLearningContentInput): Promise<GenerateLearningContentOutput> {
  return generateLearningContentFlow(input);
}

const generateLearningContentPrompt = ai.definePrompt({
  name: 'generateLearningContentPrompt',
  input: {schema: GenerateLearningContentInputSchema},
  output: {schema: GenerateLearningContentOutputSchema},
  prompt: `You are an AI assistant designed to generate structured learning content.

The user will provide a topic and the type of content they want to generate (either 'notes' or 'summary').
Your task is to generate the requested content for the given topic.

IMPORTANT: The content must be a series of points. Each point must be on a new line. Do not use markdown, just plain text with each point separated by a newline character.

Topic: {{{topic}}}
Content Type: {{{contentType}}}

Content:`,
});

const generateLearningContentFlow = ai.defineFlow(
  {
    name: 'generateLearningContentFlow',
    inputSchema: GenerateLearningContentInputSchema,
    outputSchema: GenerateLearningContentOutputSchema,
  },
  async input => {
    const {output} = await generateLearningContentPrompt(input);
    return output!;
  }
);
