import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Flashcard } from "../components/Flashcard";
import { colors, radius, spacing } from "../theme";
import { Flashcard as FlashcardType } from "../types";

interface Props { deck: FlashcardType[]; }
const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

export function StudyScreen({ deck }: Props) {
  const [order, setOrder] = useState(deck);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [category, setCategory] = useState("All topics");
  const [mode, setMode] = useState<"flashcards" | "multiple-choice">("flashcards");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const shuffleAllAfterCategoryChange = useRef(false);
  const categories = useMemo(
    () => ["All topics", ...Array.from(new Set(deck.map((card) => card.category))).sort()],
    [deck],
  );
  useEffect(() => {
    setOrder(deck);
    setIndex(0);
    setFlipped(false);
    setSelectedAnswer(null);
    setKnown(new Set());
    setCategory("All topics");
    shuffleAllAfterCategoryChange.current = false;
  }, [deck]);
  useEffect(() => {
    if (!categories.includes(category)) setCategory("All topics");
  }, [categories, category]);
  useEffect(() => {
    const next = category === "All topics"
      ? shuffleAllAfterCategoryChange.current
        ? shuffle(deck)
        : deck
      : deck.filter((card) => card.category === category);
    shuffleAllAfterCategoryChange.current = false;
    setOrder(next);
    setIndex(0);
    setFlipped(false);
    setSelectedAnswer(null);
  }, [category, deck]);
  const current = order[index];
  const choices = useMemo(() => {
    if (!current) return [];
    const distractors = shuffle(
      order
        .filter((card) => card.id !== current.id && card.back !== current.back)
        .map((card) => card.back),
    ).slice(0, 3);
    return shuffle([current.back, ...distractors]);
  }, [current, order]);
  const progress = useMemo(() => order.length ? `${index + 1} / ${order.length}` : "0 / 0", [index, order.length]);
  if (!current) return <View style={styles.empty}><Text style={styles.emptyTitle}>Your deck is empty</Text><Text style={styles.emptyText}>Add a card from the Add tab.</Text></View>;
  const next = (wasKnown?: boolean) => {
    if (wasKnown) setKnown((previous) => new Set(previous).add(current.id));
    setFlipped(false); setSelectedAnswer(null); setIndex((value) => (value + 1) % order.length);
  };
  const answer = (choice: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(choice);
    if (choice === current.back) setKnown((previous) => new Set(previous).add(current.id));
  };
  return (
    <View style={styles.container}>
      <View style={styles.modeRow}>
        <Pressable style={[styles.modeChip, mode === "flashcards" && styles.modeChipActive]} onPress={() => { setMode("flashcards"); setSelectedAnswer(null); setFlipped(false); }}>
          <Text style={[styles.modeText, mode === "flashcards" && styles.modeTextActive]}>Flashcards</Text>
        </Pressable>
        <Pressable style={[styles.modeChip, mode === "multiple-choice" && styles.modeChipActive]} onPress={() => { setMode("multiple-choice"); setSelectedAnswer(null); setFlipped(false); }}>
          <Text style={[styles.modeText, mode === "multiple-choice" && styles.modeTextActive]}>Multiple choice</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        {categories.map((item) => (
          <Pressable
            key={item}
            style={[styles.categoryChip, category === item && styles.categoryChipActive]}
            onPress={() => setCategory(item)}
          >
            <Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.stats}><Text style={styles.progress}>{progress}</Text><Text style={styles.known}>{known.size} mastered</Text></View>
      {mode === "flashcards" ? (
        <>
          <Flashcard card={current} flipped={flipped} onFlip={() => setFlipped((value) => !value)} />
          {flipped && <View style={styles.rating}><Text style={styles.ratingLabel}>How well did you know it?</Text><View style={styles.ratingRow}><Pressable style={[styles.ratingButton, styles.review]} onPress={() => next()}><Text style={styles.buttonText}>Review again</Text></Pressable><Pressable style={[styles.ratingButton, styles.mastered]} onPress={() => next(true)}><Text style={styles.buttonText}>Got it</Text></Pressable></View></View>}
          {!flipped && <Text style={styles.helper}>Think of the answer before you tap.</Text>}
        </>
      ) : (
        <View style={styles.quizCard}>
          <Text style={styles.quizPrompt}>{current.front}</Text>
          <Text style={styles.quizInstruction}>Choose the best answer.</Text>
          <View style={styles.options}>
            {choices.map((choice, optionIndex) => {
              const isCorrect = choice === current.back;
              const isSelected = choice === selectedAnswer;
              return (
                <Pressable
                  key={`${current.id}-${optionIndex}`}
                  style={[styles.option, isSelected && (isCorrect ? styles.correct : styles.incorrect), selectedAnswer && isCorrect && styles.correct]}
                  onPress={() => answer(choice)}
                >
                  <Text style={styles.optionLabel}>{String.fromCharCode(65 + optionIndex)}.</Text>
                  <Text style={styles.optionText}>{choice}</Text>
                </Pressable>
              );
            })}
          </View>
          {selectedAnswer && (
            <>
              <Text style={[styles.feedback, selectedAnswer === current.back ? styles.feedbackCorrect : styles.feedbackIncorrect]}>
                {selectedAnswer === current.back ? "Correct" : "Not quite"} — {current.back}
              </Text>
              <Pressable style={styles.quizNext} onPress={() => next()}>
                <Text style={styles.buttonText}>Next question ›</Text>
              </Pressable>
            </>
          )}
        </View>
      )}
      <View style={styles.controls}><Pressable style={styles.secondary} onPress={() => { setFlipped(false); setSelectedAnswer(null); setIndex((value) => (value - 1 + order.length) % order.length); }}><Text style={styles.buttonText}>‹ Prev</Text></Pressable><Pressable style={styles.secondary} onPress={() => { shuffleAllAfterCategoryChange.current = true; setCategory("All topics"); if (category === "All topics") { shuffleAllAfterCategoryChange.current = false; setOrder(shuffle(deck)); setIndex(0); setFlipped(false); setSelectedAnswer(null); } }}><Text style={styles.buttonText}>Shuffle all</Text></Pressable><Pressable style={styles.primary} onPress={() => next()}><Text style={styles.buttonText}>Next ›</Text></Pressable></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, justifyContent: "center" },
  modeRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  modeChip: { flex: 1, paddingVertical: spacing.sm, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center" },
  modeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  modeText: { color: colors.textMuted, fontSize: 12, fontWeight: "700" },
  modeTextActive: { color: colors.text },
  categoryRow: { gap: spacing.sm, paddingBottom: spacing.md },
  categoryChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  categoryChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryText: { color: colors.textMuted, fontSize: 12, fontWeight: "700" },
  categoryTextActive: { color: colors.text },
  stats: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.md },
  progress: { color: colors.textMuted, fontSize: 15, fontWeight: "700" },
  known: { color: colors.success, fontSize: 15, fontWeight: "700" },
  helper: { color: colors.textMuted, textAlign: "center", marginTop: spacing.md },
  quizCard: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.lg },
  quizPrompt: { color: colors.text, fontSize: 21, fontWeight: "800", lineHeight: 29 },
  quizInstruction: { color: colors.textMuted, marginTop: spacing.sm, marginBottom: spacing.md },
  options: { gap: spacing.sm },
  option: { flexDirection: "row", alignItems: "flex-start", backgroundColor: colors.surfaceAlt, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  correct: { backgroundColor: "#14532d", borderColor: colors.success },
  incorrect: { backgroundColor: "#7f1d1d", borderColor: colors.danger },
  optionLabel: { color: colors.accent, fontWeight: "900", marginRight: spacing.sm },
  optionText: { flex: 1, color: colors.text, lineHeight: 20 },
  feedback: { marginTop: spacing.md, fontWeight: "800", lineHeight: 21 },
  feedbackCorrect: { color: colors.success },
  feedbackIncorrect: { color: colors.danger },
  quizNext: { marginTop: spacing.md, backgroundColor: colors.primary, padding: spacing.md, borderRadius: radius.md, alignItems: "center" },
  rating: { marginTop: spacing.md },
  ratingLabel: { color: colors.textMuted, textAlign: "center", marginBottom: spacing.sm },
  ratingRow: { flexDirection: "row", gap: spacing.sm },
  ratingButton: { flex: 1, padding: spacing.md, borderRadius: radius.md, alignItems: "center" },
  review: { backgroundColor: colors.surfaceAlt }, mastered: { backgroundColor: colors.success },
  controls: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg },
  primary: { flex: 1, backgroundColor: colors.primary, padding: spacing.md, borderRadius: radius.md, alignItems: "center" },
  secondary: { flex: 1, backgroundColor: colors.surfaceAlt, padding: spacing.md, borderRadius: radius.md, alignItems: "center" },
  buttonText: { color: colors.text, fontWeight: "700", fontSize: 15 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl },
  emptyTitle: { color: colors.text, fontSize: 24, fontWeight: "700" },
  emptyText: { color: colors.textMuted, marginTop: spacing.sm },
});
