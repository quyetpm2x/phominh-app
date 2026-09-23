import { router } from 'expo-router';
import { useChatStore } from './chatStore';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CONTACTS, CONVERSATIONS, matchesMessage, type MessageContact } from './data';
import { MessageAvatar } from './MessageAvatar';
import { MessagesHeader } from './MessagesHeader';
import { ConversationRow } from './ConversationRow';

export function MessagesTab() {
  const [query, setQuery] = useState('');
  const localMessages = useChatStore((state) => state.localMessages);
  const readIds = useChatStore((state) => state.readIds);
  const setReadIds = useChatStore((state) => state.markAllRead);
  const unread = CONVERSATIONS.reduce(
    (total, item) => total + (readIds.includes(item.contact.id) ? 0 : item.unread),
    0,
  );
  const contacts = CONTACTS.filter((item) => matchesMessage(query, item.name, item.shortName));
  const conversations = CONVERSATIONS.map((item) => {
    const latest = localMessages[item.contact.id]?.at(-1);
    return latest
      ? {
          ...item,
          text: `Chưa gửi: ${latest.text || '[Hình ảnh]'}`,
          time: latest.time,
          kind: 'text' as const,
        }
      : item;
  }).filter((item) => matchesMessage(query, item.contact.name, item.text, item.badge));
  const open = (contact: MessageContact) => {
    useChatStore.getState().markRead(contact.id);
    router.push({ pathname: '/chat/[id]', params: { id: contact.id } });
  };
  return (
    <View style={styles.screen}>
      <MessagesHeader query={query} onSearch={setQuery} unread={unread} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.section}>
          <View style={styles.heading}>
            <Text className="font-sans-bold" style={styles.headingText}>
              NGƯỜI QUEN ĐANG ONLINE
            </Text>
            <Text className="font-sans-semibold" style={styles.actionText}>
              {contacts.length} người
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.online}>
            {contacts.map((contact) => (
              <Pressable
                key={contact.id}
                accessibilityRole="button"
                accessibilityLabel={`Tin nhắn với ${contact.name}`}
                onPress={() => open(contact)}
                style={styles.person}
              >
                <MessageAvatar contact={contact} size={56} online highlighted={contact.merchant} />
                <Text numberOfLines={1} className="font-sans-bold" style={styles.personName}>
                  {contact.shortName}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        <View style={styles.recent}>
          <View style={styles.heading}>
            <Text className="font-sans-bold" style={styles.headingText}>
              HỘI THOẠI GẦN ĐÂY
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setReadIds(CONVERSATIONS.map((item) => item.contact.id))}
              hitSlop={8}
            >
              <Text className="font-sans-bold" style={styles.actionText}>
                Đã đọc tất cả
              </Text>
            </Pressable>
          </View>
          {conversations.length ? (
            <View style={styles.card}>
              {conversations.map((item, index) => (
                <ConversationRow
                  key={item.contact.id}
                  item={item}
                  unread={item.unread > 0 && !readIds.includes(item.contact.id)}
                  last={index === conversations.length - 1}
                  onPress={() => open(item.contact)}
                />
              ))}
            </View>
          ) : (
            <Text className="font-sans text-sm text-muted" style={styles.empty}>
              Không tìm thấy hội thoại phù hợp.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32, gap: 16 },
  section: { gap: 8 },
  recent: { gap: 6 },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  headingText: { fontSize: 12, lineHeight: 18, letterSpacing: 0.6, color: '#4A4A4A' },
  actionText: { fontSize: 11, lineHeight: 16.5, color: '#FF416C' },
  online: { gap: 14, padding: 4, minHeight: 84.5 },
  person: { width: 56, alignItems: 'center', gap: 4 },
  personName: { width: 56, fontSize: 11, lineHeight: 16.5, textAlign: 'center', color: '#1A1A1A' },
  card: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 19.556,
    overflow: 'hidden',
    boxShadow: '0px 1px 2px #0000000D',
  },
  empty: { padding: 20 },
});
