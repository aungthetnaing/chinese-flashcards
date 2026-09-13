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
  const shuffleAllAfterCategoryChange = useRef(false);
  const categories = useMemo(
    () => ["All topics", ...Array.from(new Set(deck.map((card) => card.category))).sort()],
    [deck],
  );
  useEffect(() => {
    setOrder(deck);
    setIndex(0);
    setFlipped(false);
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
  }, [category, deck]);
  const current = order[index];
  const progress = useMemo(() => order.length ? `${index + 1} / ${order.length}` : "0 / 0", [index, order.length]);
  if (!current) return <View style={styles.empty}><Text style={styles.emptyTitle}>Your deck is empty</Text><Text style={styles.emptyText}>Add a card from the Add tab.</Text></View>;
  const next = (wasKnown?: boolean) => {
    if (wasKnown) setKnown((previous) => new Set(previous).add(current.id));
    setFlipped(false); setIndex((value) => (value + 1) % order.length);
  };
  return (
    <View style={styles.container}>
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
      <Flashcard card={current} flipped={flipped} onFlip={() => setFlipped((value) => !value)} />
      {flipped && <View style={styles.rating}><Text style={styles.ratingLabel}>How well did you know it?</Text><View style={styles.ratingRow}><Pressable style={[styles.ratingButton, styles.review]} onPress={() => next()}><Text style={styles.buttonText}>Review again</Text></Pressable><Pressable style={[styles.ratingButton, styles.mastered]} onPress={() => next(true)}><Text style={styles.buttonText}>Got it</Text></Pressable></View></View>}
      {!flipped && <Text style={styles.helper}>Think of the answer before you tap.</Text>}
      <View style={styles.controls}><Pressable style={styles.secondary} onPress={() => { setFlipped(false); setIndex((value) => (value - 1 + order.length) % order.length); }}><Text style={styles.buttonText}>‹ Prev</Text></Pressable><Pressable style={styles.secondary} onPress={() => { shuffleAllAfterCategoryChange.current = true; setCategory("All topics"); if (category === "All topics") { shuffleAllAfterCategoryChange.current = false; setOrder(shuffle(deck)); setIndex(0); setFlipped(false); } }}><Text style={styles.buttonText}>Shuffle all</Text></Pressable><Pressable style={styles.primary} onPress={() => next()}><Text style={styles.buttonText}>Next ›</Text></Pressable></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, justifyContent: "center" },
  categoryRow: { gap: spacing.sm, paddingBottom: spacing.md },
  categoryChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  categoryChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryText: { color: colors.textMuted, fontSize: 12, fontWeight: "700" },
  categoryTextActive: { color: colors.text },
  stats: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.md },
  progress: { color: colors.textMuted, fontSize: 15, fontWeight: "700" },
  known: { color: colors.success, fontSize: 15, fontWeight: "700" },
  helper: { color: colors.textMuted, textAlign: "center", marginTop: spacing.md },
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
