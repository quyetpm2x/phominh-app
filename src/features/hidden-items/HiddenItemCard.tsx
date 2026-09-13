import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import { CustomIcon } from '../../components/ui/CustomIcon';
import type { HiddenItem } from './data';
const BADGES = { user: 'Người dùng', place: 'Địa điểm', post: 'Bài viết', topic: 'Chủ đề' };
export function HiddenItemCard({ item, onUnhide }: { item: HiddenItem; onUnhide: () => void }) {
  const post = item.kind === 'post' || item.kind === 'topic';
  return (
    <View style={styles.card}>
      <View>
        {post ? (
          <View style={styles.postIcon}>
            <CustomIcon name="hiddenPost" size={20} />
          </View>
        ) : (
          <Avatar initial={item.name[0]} imageSource={item.image} size={44} radius={12.22} color="#79716B" />
        )}
        {!post ? (
          <View style={styles.hiddenBadge}>
            <CustomIcon name="hiddenBadge" size={9} />
          </View>
        ) : null}
      </View>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Text className="font-sans-bold" numberOfLines={1} style={styles.name}>
            {item.name}
          </Text>
          <Text
            className="font-sans-bold"
            style={[styles.badge, item.kind === 'place' && styles.placeBadge, post && styles.postBadge]}
          >
            {BADGES[item.kind]}
          </Text>
        </View>
        <Text className="font-sans" style={styles.detail}>
          {item.detail}
        </Text>
        {item.date ? (
          <Text className="font-sans" style={styles.date}>
            Ẩn từ: {item.date}
          </Text>
        ) : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Bỏ ẩn ${item.name}`}
        style={styles.unhide}
        onPress={onUnhide}
      >
        <Text className="font-sans-bold" style={styles.unhideText}>
          Bỏ ẩn
        </Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 19.56,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    minHeight: 83.75,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  postIcon: {
    width: 44,
    height: 44,
    borderRadius: 12.22,
    borderWidth: 1,
    borderColor: '#E6394633',
    backgroundColor: '#E639461A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenBadge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4A4A4ACC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { flexShrink: 1, fontSize: 13.5, lineHeight: 20.25, color: '#1A1A1A' },
  badge: {
    fontSize: 10,
    lineHeight: 15,
    paddingHorizontal: 5,
    backgroundColor: '#F1F3F5',
    color: '#4A4A4A',
    borderRadius: 2.2,
    overflow: 'hidden',
  },
  placeBadge: { backgroundColor: '#FE9A001A', color: '#E17100' },
  postBadge: { backgroundColor: '#E639461A', color: '#E63946' },
  detail: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  date: { fontSize: 10, lineHeight: 17, color: '#4A4A4ACC' },
  unhide: {
    minWidth: 55.45,
    height: 32,
    paddingHorizontal: 10,
    backgroundColor: '#FF416C1A',
    borderRadius: 8.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unhideText: { fontSize: 11, lineHeight: 16.5, color: '#FF416C' },
});
