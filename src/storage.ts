import AsyncStorage from "@react-native-async-storage/async-storage";

import { Flashcard } from "./types";

const STORAGE_KEY = "@chinese-flashcards/deck";

export async function loadDeck(): Promise<Flashcard[] | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Flashcard[]) : null;
  } catch {
    return null;
  }
}

export async function saveDeck(deck: Flashcard[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(deck));
  } catch {
    // Ignore persistence errors; the in-memory deck still works this session.
  }
}
