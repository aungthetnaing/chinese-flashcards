import { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { speakChinese } from "../speech";
import { colors, radius, spacing } from "../theme";
import { Flashcard as FlashcardType } from "../types";

/** "zh-en": show Chinese, recall meaning. "en-zh": show English, recall Chinese. */
export type StudyMode = "zh-en" | "en-zh";

interface Props {
  card: FlashcardType;
  flipped: boolean;
  onFlip: () => void;
  mode?: StudyMode;
}

export function Flashcard({ card, flipped, onFlip, mode = "zh-en" }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: flipped ? 1 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [anim, flipped]);

  const frontRotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
  const backRotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <Pressable style={styles.wrapper} onPress={onFlip}>
      <Animated.View
        pointerEvents={flipped ? "none" : "auto"}
        style={[
          styles.card,
          styles.front,
          { transform: [{ perspective: 1000 }, { rotateY: frontRotate }] },
        ]}
      >
        {mode === "zh-en" ? (
          <>
            <Text style={styles.hanzi}>{card.simplified}</Text>
            {card.traditional !== card.simplified && (
              <Text style={styles.traditional}>繁 {card.traditional}</Text>
            )}
            <Pressable
              hitSlop={12}
              style={styles.speakButton}
              onPress={() => speakChinese(card.simplified)}
            >
              <Text style={styles.speakIcon}>🔊 Play</Text>
            </Pressable>
          </>
        ) : (
          <Text style={styles.english}>{card.english}</Text>
        )}
        <Text style={styles.hint}>Tap card to reveal</Text>
      </Animated.View>

      <Animated.View
        pointerEvents={flipped ? "auto" : "none"}
        style={[
          styles.card,
          styles.back,
          { transform: [{ perspective: 1000 }, { rotateY: backRotate }] },
        ]}
      >
        {mode === "zh-en" ? (
          <>
            <Text style={styles.pinyin}>{card.pinyin}</Text>
            <Text style={styles.english}>{card.english}</Text>
          </>
        ) : (
          <>
            <Text style={styles.hanziBack}>{card.simplified}</Text>
            {card.traditional !== card.simplified && (
              <Text style={styles.traditional}>繁 {card.traditional}</Text>
            )}
            <Text style={styles.pinyin}>{card.pinyin}</Text>
          </>
        )}
        <View style={styles.divider} />
        <Text style={styles.sentence}>{card.sentence}</Text>
        <Text style={styles.sentenceEnglish}>{card.sentenceEnglish}</Text>
        <Pressable
          hitSlop={12}
          style={styles.speakButton}
          onPress={() => speakChinese(card.sentence || card.simplified)}
        >
          <Text style={styles.speakIcon}>🔊 Play sentence</Text>
        </Pressable>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: 380,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: radius.lg,
    padding: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  front: {
    backgroundColor: colors.surface,
  },
  back: {
    backgroundColor: colors.surfaceAlt,
  },
  hanzi: {
    fontSize: 88,
    color: colors.text,
    fontWeight: "700",
  },
  hanziBack: {
    fontSize: 56,
    color: colors.text,
    fontWeight: "700",
  },
  traditional: {
    fontSize: 24,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  hint: {
    position: "absolute",
    bottom: spacing.lg,
    color: colors.textMuted,
    fontSize: 13,
  },
  pinyin: {
    fontSize: 34,
    color: colors.accent,
    fontWeight: "600",
  },
  english: {
    fontSize: 24,
    color: colors.text,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    alignSelf: "stretch",
    marginVertical: spacing.lg,
  },
  sentence: {
    fontSize: 22,
    color: colors.text,
    textAlign: "center",
    lineHeight: 32,
  },
  sentenceEnglish: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  speakButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  speakIcon: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
});
