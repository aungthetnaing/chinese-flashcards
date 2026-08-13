import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import { AddCardScreen } from "./src/screens/AddCardScreen";
import { BrowseScreen } from "./src/screens/BrowseScreen";
import { StudyScreen } from "./src/screens/StudyScreen";
import { WriteScreen } from "./src/screens/WriteScreen";
import { colors, spacing } from "./src/theme";
import { useDeck } from "./src/useDeck";

type Tab = "study" | "write" | "browse" | "add";

const TABS: { key: Tab; label: string }[] = [
  { key: "study", label: "Study" },
  { key: "write", label: "Write" },
  { key: "browse", label: "Deck" },
  { key: "add", label: "Add" },
];

export default function App() {
  const { deck, loading, addCard, removeCard } = useDeck();
  const [tab, setTab] = useState<Tab>("study");

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.brand}>中文 Flashcards</Text>
      </View>

      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color={colors.primary}
          />
        ) : tab === "study" ? (
          <StudyScreen deck={deck} />
        ) : tab === "write" ? (
          <WriteScreen deck={deck} />
        ) : tab === "browse" ? (
          <BrowseScreen deck={deck} onRemove={removeCard} />
        ) : (
          <AddCardScreen onAdd={addCard} />
        )}
      </View>

      <View style={styles.tabBar}>
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <Pressable
              key={t.key}
              style={styles.tab}
              onPress={() => setTab(t.key)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {t.label}
              </Text>
              {active && <View style={styles.tabIndicator} />}
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brand: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
  body: {
    flex: 1,
  },
  loading: {
    marginTop: spacing.xl,
  },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  tabText: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: "600",
  },
  tabTextActive: {
    color: colors.text,
  },
  tabIndicator: {
    marginTop: spacing.xs,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});
