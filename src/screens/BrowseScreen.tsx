import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius, spacing } from "../theme";
import { Flashcard } from "../types";

interface Props { deck: Flashcard[]; onRemove: (id: string) => void; }

export function BrowseScreen({ deck, onRemove }: Props) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    return value ? deck.filter((card) => `${card.front} ${card.back} ${card.category}`.toLowerCase().includes(value)) : deck;
  }, [deck, query]);
  return <FlatList data={filtered} keyExtractor={(item) => item.id} contentContainerStyle={styles.container} ListHeaderComponent={<><Text style={styles.title}>Card library</Text><Text style={styles.subtitle}>{deck.length} cards · search by topic or term</Text><TextInput value={query} onChangeText={setQuery} placeholder="Search cards" placeholderTextColor={colors.textMuted} style={styles.search} /></>} ListEmptyComponent={<Text style={styles.empty}>No matching cards.</Text>} renderItem={({ item }) => <View style={styles.row}><View style={styles.info}><Text style={styles.category}>{item.category}</Text><Text style={styles.front}>{item.front}</Text><Text style={styles.back} numberOfLines={3}>{item.back}</Text></View><Pressable hitSlop={12} onPress={() => onRemove(item.id)}><Text style={styles.delete}>Delete</Text></Pressable></View>} />;
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  title: { color: colors.text, fontSize: 25, fontWeight: "800" },
  subtitle: { color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.md },
  search: { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, fontSize: 16, marginBottom: spacing.md },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderColor: colors.border, borderWidth: 1 },
  info: { flex: 1 },
  category: { color: colors.accent, fontSize: 12, fontWeight: "800", textTransform: "uppercase", marginBottom: spacing.xs },
  front: { color: colors.text, fontSize: 17, fontWeight: "700", lineHeight: 23 },
  back: { color: colors.textMuted, fontSize: 14, lineHeight: 20, marginTop: spacing.xs },
  delete: { color: colors.danger, fontWeight: "700", paddingLeft: spacing.sm },
  empty: { color: colors.textMuted, textAlign: "center", marginTop: spacing.xl },
});
