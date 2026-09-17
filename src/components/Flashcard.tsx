import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../theme";
import { Flashcard as FlashcardType } from "../types";

interface Props {
  card: FlashcardType;
  flipped: boolean;
  onFlip: () => void;
  height?: number;
}

export function Flashcard({ card, flipped, onFlip, height = 390 }: Props) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: flipped ? 1 : 0, friction: 8, tension: 10, useNativeDriver: true }).start();
  }, [anim, flipped]);
  const frontRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] });
  const backRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ["180deg", "360deg"] });

  return (
    <Pressable style={[styles.wrapper, { height }]} onPress={onFlip} accessibilityRole="button" accessibilityLabel="Flashcard">
      <Animated.View pointerEvents={flipped ? "none" : "auto"} style={[styles.card, styles.front, { height, transform: [{ perspective: 1000 }, { rotateY: frontRotate }] }]}>
        <Text style={styles.category}>{card.category.toUpperCase()}</Text>
        <Text style={styles.question}>{card.front}</Text>
        <Text style={styles.hint}>Tap to reveal answer</Text>
      </Animated.View>
      <Animated.View pointerEvents={flipped ? "auto" : "none"} style={[styles.card, styles.back, { height, transform: [{ perspective: 1000 }, { rotateY: backRotate }] }]}>
        <Text style={styles.category}>{card.category.toUpperCase()}</Text>
        <Text style={styles.answer}>{card.back}</Text>
        {card.source && <Text style={styles.source}>Source: {card.source}</Text>}
        <Text style={styles.hint}>Tap to see question</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%", minHeight: 390, justifyContent: "center", alignItems: "center" },
  card: { position: "absolute", width: "100%", borderRadius: radius.lg, padding: spacing.lg, justifyContent: "center", alignItems: "center", backfaceVisibility: "hidden", borderWidth: 1, borderColor: colors.border },
  front: { backgroundColor: colors.surface },
  back: { backgroundColor: colors.surfaceAlt },
  category: { color: colors.accent, fontSize: 12, fontWeight: "800", letterSpacing: 1.2, marginBottom: spacing.lg },
  question: { color: colors.text, fontSize: 27, lineHeight: 36, fontWeight: "700", textAlign: "center" },
  answer: { color: colors.text, fontSize: 20, lineHeight: 29, textAlign: "center" },
  source: { color: colors.textMuted, fontSize: 12, textAlign: "center", marginTop: spacing.lg },
  hint: { position: "absolute", bottom: spacing.lg, color: colors.textMuted, fontSize: 13 },
});
