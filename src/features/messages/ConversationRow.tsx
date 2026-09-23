import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { MessageAvatar } from './MessageAvatar';
import type { Conversation } from './data';
export function ConversationRow({
  item,
  unread,
  last,
  onPress,
}: {
  item: Conversation;
  unread: boolean;
  last: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Tin nhắn với ${item.contact.name}${unread ? ', chưa đọc' : ''}`}
      onPress={onPress}
      style={[styles.row, unread && styles.unread, !last && styles.border]}
    >
      <MessageAvatar contact={item.contact} online={item.online} highlighted={unread} />
      <View style={styles.copy}>
        <View style={styles.heading}>
          <Text
            numberOfLines={1}
            className={unread ? 'font-sans-black' : 'font-sans-bold'}
            style={styles.name}
          >
            {item.contact.name}
          </Text>
          <Text
            className="font-sans-bold"
            style={[styles.badge, unread && styles.pinkBadge, item.kind === 'read' && styles.orangeBadge]}
          >
            {item.badge}
          </Text>
          <Text
            className={unread ? 'font-sans-bold' : 'font-sans'}
            style={[styles.time, unread && styles.pink]}
          >
            {item.time}
          </Text>
        </View>
        {item.kind !== 'text' && (
          <CustomIcon name={item.kind === 'read' ? 'messageRead' : 'messagePhoto'} size={13} />
        )}
        <Text
          numberOfLines={1}
          className={unread ? 'font-sans-bold' : 'font-sans'}
          style={[styles.preview, unread && styles.ink]}
        >
          {item.text}
        </Text>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, minHeight: 77 },
  border: { borderBottomWidth: 1, borderBottomColor: '#E9ECEF99' },
  unread: { backgroundColor: '#FF416C0D' },
  copy: { flex: 1, gap: 2 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 14, lineHeight: 21, color: '#1A1A1A', flexShrink: 1 },
  badge: {
    fontSize: 9,
    lineHeight: 13.5,
    backgroundColor: '#F1F3F5',
    color: '#4A4A4A',
    paddingHorizontal: 5,
    borderRadius: 2.222,
    overflow: 'hidden',
  },
  pinkBadge: { backgroundColor: '#FF416C1A', color: '#FF416C' },
  orangeBadge: { backgroundColor: '#FE9A001A', color: '#E17100' },
  time: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A', marginLeft: 'auto' },
  preview: { fontSize: 12.5, lineHeight: 18.75, color: '#4A4A4A' },
  ink: { color: '#1A1A1A' },
  pink: { color: '#FF416C' },
});
