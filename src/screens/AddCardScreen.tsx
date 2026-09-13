import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius, spacing } from "../theme";
import { NewFlashcard } from "../types";

interface Props { onAdd: (card: NewFlashcard) => void; }
export function AddCardScreen({ onAdd }: Props) {
  const [category, setCategory] = useState("My cards");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [saved, setSaved] = useState(false);
  const canSave = front.trim().length > 0 && back.trim().length > 0;
  const save = () => { if (!canSave) return; onAdd({ category: category.trim() || "My cards", front: front.trim(), back: back.trim() }); setFront(""); setBack(""); setSaved(true); setTimeout(() => setSaved(false), 1600); };
  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}><ScrollView contentContainerStyle={styles.container}><Text style={styles.title}>Create a card</Text><Text style={styles.label}>Topic</Text><TextInput value={category} onChangeText={setCategory} style={styles.input} placeholder="e.g. Statistics" placeholderTextColor={colors.textMuted} /><Text style={styles.label}>Question</Text><TextInput value={front} onChangeText={setFront} style={[styles.input, styles.multiline]} multiline placeholder="What do you want to remember?" placeholderTextColor={colors.textMuted} /><Text style={styles.label}>Answer</Text><TextInput value={back} onChangeText={setBack} style={[styles.input, styles.answer]} multiline placeholder="Write a concise, test-ready answer." placeholderTextColor={colors.textMuted} /><Pressable style={[styles.button, !canSave && styles.disabled]} onPress={save} disabled={!canSave}><Text style={styles.buttonText}>Save card</Text></Pressable>{saved && <Text style={styles.saved}>Card added to your deck</Text>}</ScrollView></KeyboardAvoidingView>;
}
const styles = StyleSheet.create({
  flex: { flex: 1 }, container: { padding: spacing.lg, paddingBottom: spacing.xl * 2 }, title: { color: colors.text, fontSize: 25, fontWeight: "800", marginBottom: spacing.lg }, label: { color: colors.textMuted, fontSize: 14, fontWeight: "700", marginBottom: spacing.xs, marginTop: spacing.md }, input: { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.sm, padding: spacing.md, fontSize: 17 }, multiline: { minHeight: 100, textAlignVertical: "top" }, answer: { minHeight: 150, textAlignVertical: "top" }, button: { backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, alignItems: "center", marginTop: spacing.lg }, disabled: { backgroundColor: colors.surfaceAlt }, buttonText: { color: colors.text, fontSize: 17, fontWeight: "800" }, saved: { color: colors.success, textAlign: "center", marginTop: spacing.md },
});
