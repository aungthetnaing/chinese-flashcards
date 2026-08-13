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

export function WriteScreen({ deck }: Props) {
  const [index, setIndex] = useState(0);
  const [charPos, setCharPos] = useState(0);
  const [status, setStatus] = useState<string>("Loading character…");
  const [ready, setReady] = useState(false);
  const writerRef = useRef<StrokeWriterHandle>(null);

  const card = deck[index];
  const chars = card ? splitChars(card.simplified) : [];
  const character = chars[charPos] ?? "";

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
    setIndex((prev) => (prev + delta + deck.length) % deck.length);
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
                {c}
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
          setStatus("Tap Animate to see stroke order, or Quiz to write it.");
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
          onPress={() => goCard(1)}
        >
          <Text style={styles.buttonText}>Next ›</Text>
        </Pressable>
      </View>

      <Text style={styles.helper}>
        Stroke data streams from the Hanzi Writer CDN, so keep the phone online.
      </Text>
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
    width: 44,
    height: 44,
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
    fontSize: 24,
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
