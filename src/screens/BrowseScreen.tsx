import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "../theme";
import { Flashcard as FlashcardType } from "../types";

interface Props {
  deck: FlashcardType[];
  onRemove: (id: string) => void;
}

export function BrowseScreen({ deck, onRemove }: Props) {
  return (
    <FlatList
      data={deck}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <Text style={styles.title}>Deck · {deck.length} cards</Text>
      }
      ListEmptyComponent={
        <Text style={styles.empty}>Your deck is empty.</Text>
      }
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View style={styles.info}>
            <Text style={styles.hanzi}>
              {item.simplified}
              {item.traditional !== item.simplified
                ? `  ·  ${item.traditional}`
                : ""}
            </Text>
            <Text style={styles.pinyin}>{item.pinyin}</Text>
            <Text style={styles.english}>{item.english}</Text>
          </View>
          <Pressable
            hitSlop={12}
            onPress={() => onRemove(item.id)}
            style={styles.delete}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  info: {
    flex: 1,
  },
  hanzi: {
    fontSize: 22,
    color: colors.text,
    fontWeight: "600",
  },
  pinyin: {
    fontSize: 15,
    color: colors.accent,
    marginTop: 2,
  },
  english: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  delete: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  deleteText: {
    color: colors.danger,
    fontWeight: "600",
  },
  empty: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xl,
    fontSize: 16,
  },
});
