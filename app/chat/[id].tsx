import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheet } from '../../src/components/ui/BottomSheet';
import { Button } from '../../src/components/ui/Button';
import { CONTACTS, CONVERSATIONS } from '../../src/features/messages/data';
import { HOA_MESSAGES, useChatStore, type ChatMessage } from '../../src/features/messages/chatStore';
import { ChatHeader } from '../../src/features/messages/ChatHeader';
import { ChatBubble } from '../../src/features/messages/ChatBubble';
import { ChatComposer } from '../../src/features/messages/ChatComposer';
import { findResident, openResidentProfile } from '../../src/features/resident-profile/resident';
const EMPTY: ChatMessage[] = [];
export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const profile = findResident(id);
  const contact =
    CONTACTS.find((item) => item.id === id) ??
    (profile
      ? {
          id,
          name: profile.name,
          shortName: profile.name,
          avatar: profile.avatar,
          merchant: profile.merchant,
        }
      : null);
  const local = useChatStore((state) => state.localMessages[id] ?? EMPTY);
  const [menu, setMenu] = useState(false);
  const scroll = useRef<ScrollView>(null);
  const scrollAfterSend = useRef(false);
  const insets = useSafeAreaInsets();
  useEffect(() => {
    useChatStore.getState().markRead(id);
  }, [id]);
  const preview = CONVERSATIONS.find((item) => item.contact.id === id);
  const initial: ChatMessage[] =
    id === 'hoa'
      ? HOA_MESSAGES
      : preview
        ? [{ id: `${id}-preview`, text: preview.text, outgoing: false, time: preview.time }]
        : EMPTY;
  if (!contact)
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.empty}>
          <Text className="font-sans text-ink">Không tìm thấy hội thoại.</Text>
          <Button label="Về Tin nhắn" onPress={() => router.replace('/messages')} />
        </View>
      </SafeAreaView>
    );
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={{ paddingTop: Math.max(0, 48 - insets.top) }}>
          <ChatHeader contact={contact} onMenu={() => setMenu(true)} />
        </View>
        <ScrollView
          ref={scroll}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
          onContentSizeChange={() => {
            if (scrollAfterSend.current) {
              scroll.current?.scrollToEnd({ animated: true });
              scrollAfterSend.current = false;
            }
          }}
        >
          <View style={styles.day}>
            <Text className="font-sans-bold" style={styles.dayText}>
              HÔM NAY
            </Text>
          </View>
          {id === 'hoa' && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Xem bài viết đang trao đổi"
              onPress={() => router.push({ pathname: '/post/[id]', params: { id: 'hoa' } })}
              style={styles.post}
            >
              <Image source={require('../../assets/messages/post.png')} style={styles.postImage} />
              <View style={styles.flex}>
                <Text className="font-sans-semibold" style={styles.postLabel}>
                  Đang trao đổi về bài viết:
                </Text>
                <Text numberOfLines={1} className="font-sans-bold" style={styles.postTitle}>
                  Dư 5 suất bún chả nem cua bể trưa nay...
                </Text>
              </View>
              <Text className="font-sans-black" style={styles.price}>
                35k
              </Text>
            </Pressable>
          )}
          {[...initial, ...local].map((message) => (
            <ChatBubble key={message.id} message={message} contact={contact} />
          ))}
        </ScrollView>
        <ChatComposer
          key={id}
          name={contact.shortName}
          onSend={(text, image) => {
            scrollAfterSend.current = true;
            return useChatStore.getState().addLocalMessage(id, text, image);
          }}
        />
      </KeyboardAvoidingView>
      <BottomSheet visible={menu} onClose={() => setMenu(false)} variant="actions">
        <View style={styles.empty}>
          <Text className="font-sans-black text-lg text-ink">{contact.name}</Text>
          {profile && (
            <Button
              label="Xem hồ sơ"
              variant="outline"
              onPress={() => {
                setMenu(false);
                openResidentProfile(id);
              }}
            />
          )}
          <Text className="font-sans text-sm text-muted">
            Hội thoại mẫu. Tin nhắn mới chỉ được giữ tạm trên thiết bị, chưa gửi đến người nhận.
          </Text>
          <Button label="Đóng" variant="soft" onPress={() => setMenu(false)} />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'white' },
  flex: { flex: 1 },
  content: { padding: 16, paddingTop: 24, gap: 14, flexGrow: 1, backgroundColor: '#F8F9FA' },
  empty: { padding: 20, gap: 16 },
  day: { alignItems: 'center', paddingVertical: 4 },
  dayText: {
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0.5,
    color: '#4A4A4A',
    backgroundColor: '#F1F3F5CC',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 3,
    overflow: 'hidden',
  },
  post: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E9ECEFCC',
    borderRadius: 19.556,
    backgroundColor: 'white',
  },
  postImage: { width: 48, height: 48, borderRadius: 13.333 },
  postLabel: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  postTitle: { fontSize: 13, lineHeight: 19.5, color: '#1A1A1A' },
  price: { fontSize: 11, lineHeight: 16.5, color: '#FF416C' },
});
