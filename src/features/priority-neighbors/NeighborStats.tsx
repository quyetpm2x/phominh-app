import { StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import type { PriorityNeighbor } from './data';
export function NeighborStats({
  neighbor,
  compact = false,
}: {
  neighbor: PriorityNeighbor;
  compact?: boolean;
}) {
  const stats = [
    { title: 'SỐ BÀI ĐĂNG', value: neighbor.posts, icon: 'priorityPosts', color: '#1A1A1A' },
    { title: 'ĐIỂM UY TÍN', value: neighbor.reputation, icon: 'priorityShield', color: '#009966' },
    { title: 'KHOẢNG CÁCH', value: `${neighbor.distance} m`, icon: 'priorityPin', color: '#FF416C' },
  ] as const;
  return (
    <View style={[styles.box, compact && styles.compact]}>
      {stats.map((stat, index) => (
        <View key={stat.title} style={[styles.column, index === 1 && styles.middle]}>
          <Text className="font-sans-bold" style={[styles.label, compact && styles.smallLabel]}>
            {stat.title}
          </Text>
          <View style={styles.valueRow}>
            <CustomIcon name={stat.icon} size={compact ? 11 : 12} />
            <Text
              className="font-sans-black"
              style={[styles.value, { color: stat.color }, compact && styles.smallValue]}
            >
              {stat.value}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: '#E9ECEF80',
    borderRadius: 14,
    padding: 10,
    flexDirection: 'row',
    gap: 8,
  },
  compact: { padding: 8 },
  column: { flex: 1, alignItems: 'center', gap: 2 },
  middle: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#E9ECEF99' },
  label: { fontSize: 10, lineHeight: 15, letterSpacing: -0.25, color: '#4A4A4A' },
  smallLabel: { fontSize: 9.5 },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  value: { fontSize: 13, lineHeight: 19.5 },
  smallValue: { fontSize: 12, lineHeight: 18 },
});
