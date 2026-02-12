export type ContentType = 'Notes' | 'Summary' | 'MCQ' | 'Flashcards';

export type HistoryItem = {
  id: string;
  topic: string;
  type: ContentType;
  content: string;
  timestamp: string;
};

export interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizData {
  quiz: MCQ[];
}

export interface Flashcard {
  term: string;
  definition: string;
}

export interface QuizResult {
  id: string;
  userId: string;
  topic: string;
  score: number;
  difficulty: string;
  date: string;
}
