import AsyncStorage from "@react-native-async-storage/async-storage";

import { Flashcard } from "./types";

const STORAGE_PREFIX = "@scioly/deck/";

export async function loadDeck(eventId = "disease-detectives"): Promise<Flashcard[] | null> {
  try {
    const raw = await AsyncStorage.getItem(`${STORAGE_PREFIX}${eventId}`);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Flashcard[]) : null;
  } catch {
    return null;
  }
}

export async function saveDeck(deck: Flashcard[], eventId = "disease-detectives"): Promise<void> {
  try {
    await AsyncStorage.setItem(`${STORAGE_PREFIX}${eventId}`, JSON.stringify(deck));
  } catch {
    // Ignore persistence errors; the in-memory deck still works this session.
  }
}
