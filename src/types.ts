export interface Flashcard {
  id: string;
  simplified: string;
  traditional: string;
  pinyin: string;
  english: string;
  /** Example sentence in Chinese showing the word in context. */
  sentence: string;
  /** English translation of the example sentence. */
  sentenceEnglish: string;
  /** Optional textbook lesson number (e.g. Integrated Chinese Level 1). */
  lesson?: number;
}

export type NewFlashcard = Omit<Flashcard, "id">;
