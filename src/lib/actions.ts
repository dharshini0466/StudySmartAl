'use server';

import { generateLearningContent } from '@/ai/flows/generate-learning-content';
import { generateMCQQuiz } from '@/ai/flows/generate-mcq-quiz';
import type { ContentType } from './types';

export async function generateContentAction(
  topic: string,
  type: ContentType
): Promise<{ content?: string; error?: string }> {
  try {
    if (type === 'MCQ') {
      const result = await generateMCQQuiz({ topic });
      return { content: JSON.stringify(result) };
    }

    const contentTypeMap = {
      Notes: 'notes',
      Summary: 'summary',
      Flashcards: 'flashcards',
    };

    const result = await generateLearningContent({
      topic,
      contentType: contentTypeMap[type as keyof typeof contentTypeMap] as 'notes' | 'summary' | 'flashcards',
    });
    return { content: result.content };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'An unexpected error occurred.' };
  }
}
