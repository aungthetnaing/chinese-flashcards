import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../theme";
import { SCIOLY_EVENTS, SciOlyEvent } from "../data/events";

interface Props {
  selectedEventId: string;
  onSelect: (event: SciOlyEvent) => void;
}

export function EventsScreen({ selectedEventId, onSelect }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Biology events</Text>
      <Text style={styles.subtitle}>
        Choose an event to keep its cards and progress separate.
      </Text>
      {SCIOLY_EVENTS.map((event) => {
        const selected = event.id === selectedEventId;
        return (
          <Pressable
            key={event.id}
            disabled={!event.available}
            onPress={() => onSelect(event)}
            style={[
              styles.card,
              { borderLeftColor: event.color },
              selected && styles.selected,
              !event.available && styles.comingSoon,
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.eventName}>{event.name}</Text>
              <Text style={[styles.badge, { color: event.color }]}>
                {event.available ? (selected ? "SELECTED" : "READY") : "COMING SOON"}
              </Text>
            </View>
            <Text style={styles.division}>{event.division}</Text>
            <Text style={styles.description}>{event.description}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  title: { color: colors.text, fontSize: 27, fontWeight: "800" },
  subtitle: { color: colors.textMuted, fontSize: 15, lineHeight: 22, marginTop: spacing.xs, marginBottom: spacing.lg },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, borderLeftWidth: 5, padding: spacing.md, marginBottom: spacing.md },
  selected: { borderColor: colors.accent, backgroundColor: colors.surfaceAlt },
  comingSoon: { opacity: 0.58 },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  eventName: { color: colors.text, fontSize: 19, fontWeight: "800", flex: 1 },
  badge: { fontSize: 10, fontWeight: "900", letterSpacing: 0.7 },
  division: { color: colors.accent, fontSize: 12, fontWeight: "800", marginTop: spacing.xs, textTransform: "uppercase" },
  description: { color: colors.textMuted, lineHeight: 21, marginTop: spacing.sm },
});
