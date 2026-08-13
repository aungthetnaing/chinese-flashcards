import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Flashcard, StudyMode } from "../components/Flashcard";
import { colors, radius, spacing } from "../theme";
import { Flashcard as FlashcardType } from "../types";

interface Props {
  deck: FlashcardType[];
}

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function StudyScreen({ deck }: Props) {
  const [order, setOrder] = useState<FlashcardType[]>(deck);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mode, setMode] = useState<StudyMode>("zh-en");

  useEffect(() => {
    setOrder(deck);
    setIndex(0);
    setFlipped(false);
  }, [deck]);

  const current = order[index];
  const progress = useMemo(
    () => (order.length ? `${index + 1} / ${order.length}` : "0 / 0"),
    [index, order.length],
  );

  if (!current) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          No cards yet. Add one from the “Add” tab to start studying.
        </Text>
      </View>
    );
  }

  const go = (delta: number) => {
    setFlipped(false);
    setIndex((prev) => (prev + delta + order.length) % order.length);
  };

  return (
    <View style={styles.container}>
      <View style={styles.modeRow}>
        <Pressable
          style={[styles.modeChip, mode === "zh-en" && styles.modeChipActive]}
          onPress={() => {
            setMode("zh-en");
            setFlipped(false);
          }}
        >
          <Text
            style={[
              styles.modeText,
              mode === "zh-en" && styles.modeTextActive,
            ]}
          >
            中 → EN
          </Text>
        </Pressable>
        <Pressable
          style={[styles.modeChip, mode === "en-zh" && styles.modeChipActive]}
          onPress={() => {
            setMode("en-zh");
            setFlipped(false);
          }}
        >
          <Text
            style={[
              styles.modeText,
              mode === "en-zh" && styles.modeTextActive,
            ]}
          >
            EN → 中
          </Text>
        </Pressable>
      </View>

      <Text style={styles.progress}>{progress}</Text>

      <Flashcard
        card={current}
        flipped={flipped}
        mode={mode}
        onFlip={() => setFlipped((f) => !f)}
      />

      <View style={styles.controls}>
        <Pressable
          style={[styles.button, styles.secondary]}
          onPress={() => go(-1)}
        >
          <Text style={styles.buttonText}>‹ Prev</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.secondary]}
          onPress={() => {
            setOrder(shuffle(order));
            setIndex(0);
            setFlipped(false);
          }}
        >
          <Text style={styles.buttonText}>Shuffle</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.primary]}
          onPress={() => go(1)}
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
    justifyContent: "center",
  },
  progress: {
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  modeRow: {
    flexDirection: "row",
    alignSelf: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  modeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  modeChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceAlt,
  },
  modeText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  modeTextActive: {
    color: colors.text,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
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
    fontSize: 16,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
  },
});
