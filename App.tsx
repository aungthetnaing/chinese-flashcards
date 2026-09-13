import { useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AddCardScreen } from "./src/screens/AddCardScreen";
import { BrowseScreen } from "./src/screens/BrowseScreen";
import { StudyScreen } from "./src/screens/StudyScreen";
import { colors, spacing } from "./src/theme";
import { useDeck } from "./src/useDeck";

type Tab = "study" | "deck" | "add";
const TABS: { key: Tab; label: string; icon: string }[] = [{ key: "study", label: "Study", icon: "◉" }, { key: "deck", label: "Cards", icon: "▤" }, { key: "add", label: "Add", icon: "+" }];

export default function App() {
  const { deck, loading, addCard, removeCard } = useDeck();
  const [tab, setTab] = useState<Tab>("study");
  return <SafeAreaView style={styles.safe}><StatusBar style="light" /><View style={styles.header}><View><Text style={styles.kicker}>SCIENCE OLYMPIAD</Text><Text style={styles.brand}>Disease Detectives</Text></View><Text style={styles.count}>{deck.length} cards</Text></View><View style={styles.body}>{loading ? <ActivityIndicator style={styles.loading} size="large" color={colors.primary} /> : tab === "study" ? <StudyScreen deck={deck} /> : tab === "deck" ? <BrowseScreen deck={deck} onRemove={removeCard} /> : <AddCardScreen onAdd={addCard} />}</View><View style={styles.tabBar}>{TABS.map((item) => { const active = tab === item.key; return <Pressable key={item.key} style={styles.tab} onPress={() => setTab(item.key)}><Text style={[styles.icon, active && styles.active]}>{item.icon}</Text><Text style={[styles.tabText, active && styles.active]}>{item.label}</Text></Pressable>; })}</View></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomColor: colors.border, borderBottomWidth: 1 }, kicker: { color: colors.accent, fontSize: 10, fontWeight: "800", letterSpacing: 1.2 }, brand: { color: colors.text, fontSize: 22, fontWeight: "800", marginTop: 2 }, count: { color: colors.textMuted, fontSize: 13 }, body: { flex: 1 }, loading: { marginTop: spacing.xl }, tabBar: { flexDirection: "row", backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1, paddingBottom: spacing.xs }, tab: { flex: 1, alignItems: "center", paddingVertical: spacing.sm }, icon: { color: colors.textMuted, fontSize: 20, lineHeight: 23 }, tabText: { color: colors.textMuted, fontSize: 12, fontWeight: "700" }, active: { color: colors.primary },
});
