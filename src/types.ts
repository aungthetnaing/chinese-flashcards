export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  source?: string;
}

export type NewFlashcard = Omit<Flashcard, "id">;
