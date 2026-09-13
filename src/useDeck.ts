import { useCallback, useEffect, useState } from "react";

import { STARTER_DECK } from "./data/starterDeck";
import { loadDeck, saveDeck } from "./storage";
import { Flashcard, NewFlashcard } from "./types";

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
      setDeck(stored ?? STARTER_DECK);
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
    persist(STARTER_DECK);
  }, [persist]);

  return { deck, loading, addCard, removeCard, resetToStarter };
}
