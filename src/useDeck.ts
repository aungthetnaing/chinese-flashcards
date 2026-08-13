import { useCallback, useEffect, useState } from "react";

import { INTEGRATED_CHINESE_1 } from "./data/integratedChinese1";
import { INTEGRATED_CHINESE_1_PART2 } from "./data/integratedChinese1Part2";
import { loadDeck, saveDeck } from "./storage";
import { Flashcard, NewFlashcard } from "./types";

/** Full Integrated Chinese Level 1 deck (Part 1 + Part 2, Lessons 1–20). */
const DEFAULT_DECK: Flashcard[] = [
  ...INTEGRATED_CHINESE_1,
  ...INTEGRATED_CHINESE_1_PART2,
];

function makeId(): string {
  return `card-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useDeck() {
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const stored = await loadDeck();
      if (!active) {
        return;
      }
      setDeck(stored ?? DEFAULT_DECK);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const persist = useCallback((next: Flashcard[]) => {
    setDeck(next);
    void saveDeck(next);
  }, []);

  const addCard = useCallback(
    (card: NewFlashcard) => {
      persist([{ ...card, id: makeId() }, ...deck]);
    },
    [deck, persist],
  );

  const removeCard = useCallback(
    (id: string) => {
      persist(deck.filter((c) => c.id !== id));
    },
    [deck, persist],
  );

  const resetToStarter = useCallback(() => {
    persist(DEFAULT_DECK);
  }, [persist]);

  return { deck, loading, addCard, removeCard, resetToStarter };
}
