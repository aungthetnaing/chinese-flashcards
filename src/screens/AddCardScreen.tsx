import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors, radius, spacing } from "../theme";
import { NewFlashcard } from "../types";

interface Props {
  onAdd: (card: NewFlashcard) => void;
}

/** Keys of NewFlashcard that hold editable text (excludes the numeric lesson). */
type TextField =
  | "simplified"
  | "traditional"
  | "pinyin"
  | "english"
  | "sentence"
  | "sentenceEnglish";

const EMPTY: Record<TextField, string> = {
  simplified: "",
  traditional: "",
  pinyin: "",
  english: "",
  sentence: "",
  sentenceEnglish: "",
};

const FIELDS: { key: TextField; label: string; placeholder: string }[] =
  [
    { key: "simplified", label: "Simplified 简体", placeholder: "学习" },
    { key: "traditional", label: "Traditional 繁體", placeholder: "學習" },
    { key: "pinyin", label: "Pinyin", placeholder: "xué xí" },
    { key: "english", label: "English", placeholder: "to study; to learn" },
    { key: "sentence", label: "Example sentence", placeholder: "我每天学习中文。" },
    {
      key: "sentenceEnglish",
      label: "Sentence translation",
      placeholder: "I study Chinese every day.",
    },
  ];

export function AddCardScreen({ onAdd }: Props) {
  const [form, setForm] = useState<Record<TextField, string>>(EMPTY);
  const [saved, setSaved] = useState(false);

  const canSave =
    form.simplified.trim().length > 0 && form.english.trim().length > 0;

  const handleSubmit = () => {
    if (!canSave) {
      return;
    }
    const traditional = form.traditional.trim() || form.simplified.trim();
    onAdd({
      simplified: form.simplified.trim(),
      traditional,
      pinyin: form.pinyin.trim(),
      english: form.english.trim(),
      sentence: form.sentence.trim(),
      sentenceEnglish: form.sentenceEnglish.trim(),
    });
    setForm(EMPTY);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>New flashcard</Text>
        {FIELDS.map((field) => (
          <View key={field.key} style={styles.field}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              value={form[field.key]}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, [field.key]: text }))
              }
              placeholder={field.placeholder}
              placeholderTextColor={colors.textMuted}
              multiline={field.key.startsWith("sentence")}
            />
          </View>
        ))}

        <Pressable
          style={[styles.button, !canSave && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!canSave}
        >
          <Text style={styles.buttonText}>Save card</Text>
        </Pressable>
        {saved && <Text style={styles.savedText}>✓ Card added</Text>}
        <Text style={styles.helper}>
          Traditional defaults to the simplified form if left blank.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.lg,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textMuted,
    marginBottom: spacing.xs,
    fontSize: 14,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 18,
    minHeight: 48,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.md,
  },
  buttonDisabled: {
    backgroundColor: colors.surfaceAlt,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 17,
  },
  savedText: {
    color: colors.success,
    textAlign: "center",
    marginTop: spacing.md,
    fontSize: 16,
  },
  helper: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: "center",
    marginTop: spacing.lg,
  },
});
