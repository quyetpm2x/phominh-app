import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { LegalCard } from '../legal/LegalCard';
import type { FaqItem } from './data';
export function FaqAccordion({
  item,
  expanded,
  onToggle,
}: {
  item: FaqItem;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <LegalCard style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={item.question}
        accessibilityState={{ expanded }}
        onPress={onToggle}
        style={styles.row}
      >
        <CustomIcon name="faqQuestion" size={16} />
        <Text className="font-sans-bold" style={styles.question}>
          {item.question}
        </Text>
        <View style={expanded && styles.open}>
          <CustomIcon name="faqChevron" size={13} />
        </View>
      </Pressable>
      {expanded ? (
        <View style={styles.answer}>
          <Text className="font-sans" style={styles.body}>
            {item.answer}
          </Text>
        </View>
      ) : null}
    </LegalCard>
  );
}
const styles = StyleSheet.create({
  card: { padding: 0, gap: 0, overflow: 'hidden', borderRadius: 19.167 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  question: { flex: 1, fontSize: 13, lineHeight: 19.5, color: '#1A1A1A' },
  open: { transform: [{ rotate: '180deg' }] },
  answer: {
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF80',
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 16,
  },
  body: { fontSize: 12, lineHeight: 19.5, color: '#4A4A4A' },
});
