import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  StrokeWriter,
  StrokeWriterHandle,
} from "../components/StrokeWriter";
import { speakChinese } from "../speech";
import { colors, radius, spacing } from "../theme";
import { Flashcard as FlashcardType } from "../types";

interface Props {
  deck: FlashcardType[];
}

/** Split a word into individual Han characters (ignores spaces/punctuation). */
function splitChars(word: string): string[] {
  return Array.from(word).filter((c) => /\p{Script=Han}/u.test(c));
}

/** Fisher-Yates shuffle returning a new array. */
function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function WriteScreen({ deck }: Props) {
  const [order, setOrder] = useState<FlashcardType[]>(deck);
  const [index, setIndex] = useState(0);
  const [charPos, setCharPos] = useState(0);
  const [status, setStatus] = useState<string>("Loading character\u2026");
  const [ready, setReady] = useState(false);
  const writerRef = useRef<StrokeWriterHandle>(null);

  useEffect(() => {
    setOrder(deck);
    setIndex(0);
    setCharPos(0);
  }, [deck]);

  const card = order[index];
  const chars = card ? splitChars(card.simplified) : [];
  const character = chars[charPos] ?? "";
  // Per-character pinyin syllables (space-separated in the data). Fall back to
  // a position number if the syllable count doesn't line up with the chars.
  const syllables = card ? card.pinyin.trim().split(/\s+/) : [];
  const chipLabels =
    syllables.length === chars.length
      ? syllables
      : chars.map((_, i) => String(i + 1));

  useEffect(() => {
    setReady(false);
    setStatus("Loading character…");
  }, [character]);

  if (!card || chars.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Add cards to practice writing.</Text>
      </View>
    );
  }

  const goCard = (delta: number) => {
    setCharPos(0);
    setIndex((prev) => (prev + delta + order.length) % order.length);
  };

  const shuffleDeck = () => {
    setOrder((prev) => shuffle(prev));
    setCharPos(0);
    setIndex(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>
        {card.pinyin} · {card.english}
      </Text>

      {chars.length > 1 && (
        <View style={styles.charRow}>
          {chars.map((c, i) => (
            <Pressable
              key={`${c}-${i}`}
              style={[styles.chip, i === charPos && styles.chipActive]}
              onPress={() => setCharPos(i)}
            >
              <Text
                style={[
                  styles.chipText,
                  i === charPos && styles.chipTextActive,
                ]}
              >
                {chipLabels[i]}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <StrokeWriter
        ref={writerRef}
        character={character}
        size={280}
        onReady={() => {
          setReady(true);
          setStatus("Write the strokes in order…");
          writerRef.current?.quiz();
        }}
        onCorrectStroke={(_stroke, remaining) =>
          setStatus(
            remaining > 0
              ? `Correct! ${remaining} stroke${remaining === 1 ? "" : "s"} left.`
              : "Correct!",
          )
        }
        onMistake={() => setStatus("Not quite — follow the stroke order.")}
        onQuizComplete={(mistakes) =>
          setStatus(
            mistakes === 0
              ? "Perfect! No mistakes. ✓"
              : `Done with ${mistakes} mistake${mistakes === 1 ? "" : "s"}. Try again!`,
          )
        }
      />

      <Text style={styles.status}>{status}</Text>

      <View style={styles.controls}>
        <Pressable
          style={[styles.button, styles.secondary]}
          onPress={() => speakChinese(character)}
        >
          <Text style={styles.buttonText}>🔊</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.secondary]}
          disabled={!ready}
          onPress={() => writerRef.current?.animate()}
        >
          <Text style={styles.buttonText}>Animate</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.primary]}
          disabled={!ready}
          onPress={() => {
            setStatus("Write the strokes in order…");
            writerRef.current?.quiz();
          }}
        >
          <Text style={styles.buttonText}>Quiz</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.secondary]}
          onPress={shuffleDeck}
        >
          <Text style={styles.buttonText}>Shuffle</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.secondary]}
          onPress={() => goCard(1)}
        >
          <Text style={styles.buttonText}>Next ›</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    color: colors.textMuted,
    fontSize: 16,
  },
  prompt: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: spacing.md,
    textAlign: "center",
  },
  charRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    minWidth: 44,
    height: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceAlt,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: 18,
  },
  chipTextActive: {
    color: colors.text,
  },
  status: {
    color: colors.accent,
    fontSize: 15,
    textAlign: "center",
    marginTop: spacing.md,
    minHeight: 22,
    paddingHorizontal: spacing.md,
  },
  controls: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  button: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surfaceAlt,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 15,
  },
  helper: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: "center",
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
});
