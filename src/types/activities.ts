export interface SuitcaseItem {
  id: string;
  color: string;
  shape: 'circle' | 'square' | 'triangle' | 'star';
  colorEn: string;
  shapeEn: string;
  x: number;
  y: number;
  isCorrect: boolean;
  feedbackEs: string;
}

export interface WordSearchTarget {
  id: string;
  word: string;
  translation: string;
  icon: string;
  description: string;
  found: boolean;
}

export interface MultipleChoiceQuestion {
  id: string;
  situation: string;
  audioPrompt?: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface ListeningExercise {
  id: string;
  phraseEn: string;
  phraseEs: string;
  context: string;
  audioSpeed: number;
  expectedKeywords: string[];
}
