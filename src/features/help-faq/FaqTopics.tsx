import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { FAQ_TOPICS, type FaqTopic } from './data';
export function FaqTopics({
  selected,
  onSelect,
}: {
  selected: FaqTopic | null;
  onSelect: (topic: FaqTopic | null) => void;
}) {
  return (
    <View style={styles.row}>
      {FAQ_TOPICS.map((topic) => (
        <Pressable
          key={topic.id}
          accessibilityRole="button"
          accessibilityLabel={topic.label.replace('\n', ' ')}
          accessibilityState={{ selected: selected === topic.id }}
          onPress={() => onSelect(selected === topic.id ? null : topic.id)}
          style={[styles.card, selected === topic.id && styles.selected]}
        >
          <View style={[styles.icon, { backgroundColor: topic.background }]}>
            <CustomIcon name={topic.icon} size={16} />
          </View>
          <Text className="font-sans-bold" style={styles.label}>
            {topic.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  card: {
    flex: 1,
    minHeight: 93,
    padding: 10,
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 14,
  },
  selected: { borderColor: '#FF416C', backgroundColor: '#FFF5F7' },
  icon: { width: 32, height: 32, borderRadius: 8.444, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 11, lineHeight: 16.5, color: '#1A1A1A', textAlign: 'center' },
});
