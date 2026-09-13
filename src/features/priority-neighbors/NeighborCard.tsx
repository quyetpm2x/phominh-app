import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from '../../components/ui/Avatar';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { NeighborStats } from './NeighborStats';
import type { PriorityNeighbor } from './data';
export function NeighborCard({
  neighbor,
  priority,
  disabled,
  onToggle,
}: {
  neighbor: PriorityNeighbor;
  priority: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={[styles.card, !priority && styles.suggestion]}>
      <View style={styles.header}>
        <View>
          <Avatar
            initial={neighbor.name[0]}
            imageSource={neighbor.avatar}
            size={priority ? 52 : 44}
            radius={priority ? 14.4 : 12.2}
          />
          {priority ? (
            <LinearGradient colors={['#FE9A00', '#FFB900']} style={styles.medal}>
              <CustomIcon name="priorityBadge" size={10} />
            </LinearGradient>
          ) : null}
        </View>
        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <Text
              numberOfLines={1}
              className="font-sans-bold"
              style={[styles.name, !priority && styles.smallName]}
            >
              {neighbor.name}
            </Text>
            <Text
              className="font-sans-bold"
              style={[styles.badge, { color: neighbor.color, backgroundColor: neighbor.background }]}
            >
              {neighbor.badge}
            </Text>
          </View>
          <Text className="font-sans" style={styles.address}>
            {neighbor.address}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${priority ? 'Bỏ ưu tiên' : 'Thêm ưu tiên'} ${neighbor.name}`}
          accessibilityState={{ disabled }}
          disabled={disabled}
          style={priority ? styles.star : styles.add}
          onPress={onToggle}
        >
          <CustomIcon name={priority ? 'priorityStar' : 'priorityAdd'} size={priority ? 18 : 11} />
          {!priority ? (
            <Text className="font-sans-bold" style={styles.addText}>
              Thêm
            </Text>
          ) : null}
        </Pressable>
      </View>
      <NeighborStats neighbor={neighbor} compact={!priority} />
      {priority ? (
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Nhắn tin cho ${neighbor.name}`}
            style={styles.action}
            onPress={() =>
              Alert.alert(
                `Nhắn tin cho ${neighbor.name}`,
                'Tính năng nhắn tin chưa được kết nối trong phiên bản này.',
              )
            }
          >
            <CustomIcon name="priorityChat" size={14} />
            <Text className="font-sans-bold" style={styles.actionText}>
              Nhắn tin
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Xem bài viết của ${neighbor.name}`}
            style={styles.action}
            onPress={() =>
              neighbor.postId
                ? router.push({ pathname: '/post/[id]', params: { id: neighbor.postId } })
                : Alert.alert('Bài viết', 'Chưa có bài viết của người này trong dữ liệu hiện tại.')
            }
          >
            <CustomIcon name="priorityFeed" size={14} />
            <Text className="font-sans-bold" style={styles.actionText}>
              Xem bài viết
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    padding: 16,
    gap: 12,
    borderRadius: 19.56,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  suggestion: { padding: 14, gap: 10 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  medal: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  titleRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  name: { fontSize: 14.5, lineHeight: 21.75, color: '#1A1A1A', flexShrink: 1 },
  smallName: { fontSize: 13.5, lineHeight: 20.25 },
  badge: {
    fontSize: 10,
    lineHeight: 15,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 2.2,
    overflow: 'hidden',
  },
  address: { fontSize: 11.5, lineHeight: 17.25, color: '#4A4A4A' },
  star: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FE9A001A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  add: {
    height: 32,
    paddingHorizontal: 12,
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8.4,
    backgroundColor: '#FF416C1A',
  },
  addText: { fontSize: 11, color: '#FF416C' },
  actions: { paddingTop: 4, flexDirection: 'row', gap: 8 },
  action: {
    flex: 1,
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionText: { fontSize: 11, lineHeight: 16.5, color: '#1A1A1A' },
});
