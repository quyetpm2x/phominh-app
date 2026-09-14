import { StyleSheet, Text, View } from 'react-native';
import { CustomIcon, type CustomIconProps } from '../../components/ui/CustomIcon';
import { LegalCard } from '../legal/LegalCard';
import { COMMUNITY_RULES } from './data';
export function CommunityHeading({
  title,
  subtitle,
  icon,
  color,
  background,
  badge,
}: {
  title: string;
  subtitle: string;
  icon: CustomIconProps['name'];
  color: string;
  background: string;
  badge?: string;
}) {
  return (
    <View style={[styles.heading, badge ? styles.divider : undefined]}>
      <View style={[styles.icon, { backgroundColor: background }]}>
        <CustomIcon name={icon} size={16} />
      </View>
      <View style={styles.copy}>
        <Text accessibilityRole="header" className="font-sans-bold" style={[styles.title, { color }]}>
          {title}
        </Text>
        <Text className="font-sans" style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>
      {badge ? (
        <Text className="font-sans-bold" style={[styles.badge, { color, backgroundColor: background }]}>
          {badge}
        </Text>
      ) : null}
    </View>
  );
}
export function CommunityRuleCard({ rule }: { rule: (typeof COMMUNITY_RULES)[number] }) {
  return (
    <LegalCard style={styles.card}>
      <CommunityHeading {...rule} />
      <View style={styles.items}>
        {rule.items.map(([title, body]) => (
          <View key={title} style={styles.item}>
            <View style={[styles.dot, { backgroundColor: rule.dot }]} />
            <View style={styles.itemCopy}>
              <Text className="font-sans-bold" style={styles.itemTitle}>
                {title}
              </Text>
              <Text className="font-sans" style={styles.body}>
                {body}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </LegalCard>
  );
}
const styles = StyleSheet.create({
  card: { gap: 12 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  divider: { paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#E9ECEFCC' },
  icon: { width: 32, height: 32, borderRadius: 8.889, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1 },
  title: { fontSize: 12, lineHeight: 16 },
  subtitle: { fontSize: 10, lineHeight: 15, color: '#4A4A4A' },
  badge: {
    fontSize: 9,
    lineHeight: 13.5,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4.861,
    overflow: 'hidden',
  },
  items: { gap: 10, paddingTop: 2 },
  item: { flexDirection: 'row', gap: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  itemCopy: { flex: 1, gap: 2 },
  itemTitle: { fontSize: 12, lineHeight: 16, color: '#1A1A1A' },
  body: { fontSize: 11.5, lineHeight: 18.688, color: '#4A4A4A' },
});
