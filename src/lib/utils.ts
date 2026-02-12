import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Flashcard } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseFlashcards(content: string): Flashcard[] {
  const lines = content.trim().split('\n');
  const flashcards: Flashcard[] = [];

  for (const line of lines) {
    const parts = line.split(/[:–-]/); // Split by colon, en-dash, or hyphen
    if (parts.length >= 2) {
      const term = parts[0].replace(/^\d+\.\s*/, '').trim(); // Remove leading numbers like "1. "
      const definition = parts.slice(1).join(':').trim();
      if (term && definition) {
        flashcards.push({ term, definition });
      }
    }
  }

  return flashcards;
}
