import { useCallback, useEffect, useState } from "react";

import { loadDeck, saveDeck } from "./storage";
import { Flashcard, NewFlashcard } from "./types";
import { getEvent } from "./data/events";

function makeId(): string {
  return `card-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useDeck(eventId = "disease-detectives") {
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const stored = await loadDeck(eventId);
      if (!active) {
        return;
      }
      setDeck(stored ?? getEvent(eventId).starterDeck);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [eventId]);

  const persist = useCallback((next: Flashcard[]) => {
    setDeck(next);
    void saveDeck(next, eventId);
  }, [eventId]);

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
    persist(getEvent(eventId).starterDeck);
  }, [eventId, persist]);

  return { deck, loading, addCard, removeCard, resetToStarter };
}
