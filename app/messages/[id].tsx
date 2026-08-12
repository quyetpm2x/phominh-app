import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '../../src/components/ui/Avatar';
import { chatBubbles, chatThreads } from '../../src/mocks/phoMinh';

// on.chat — cuộc trò chuyện mở từ bài đăng, tự đóng khi bài hết hạn.
export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const thread = chatThreads.find((t) => t.id === id) ?? chatThreads[0];
  const [blocked, setBlocked] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[52px] flex-row items-center gap-2.5 px-2.5 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[30px] h-[30px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Avatar initial={thread.initial} color={thread.color} size={34} radius={11} />
        <View className="flex-1">
          <Text className="font-sans-semibold text-sm text-ink">{thread.peer}</Text>
          <Text className="text-[11px] text-muted mt-0.5">
            {thread.distance} · về bài "{thread.postTitle}"
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/report/post')}
          className="h-[30px] rounded-lg border border-border bg-white px-2.5 items-center justify-center"
        >
          <Text className="text-[11.5px] text-muted">Báo cáo</Text>
        </Pressable>
        <Pressable
          onPress={() => setBlocked((b) => !b)}
          className="h-[30px] rounded-lg border border-border bg-white px-2.5 items-center justify-center"
        >
          <Text className="text-[11.5px] text-danger-text">{blocked ? 'Bỏ chặn' : 'Chặn'}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="p-3.5 gap-2.5">
        <View className="rounded-xl border border-border bg-white px-3.5 py-2.5">
          <Text className="text-[11.5px] leading-[18px] text-muted">
            Cuộc trò chuyện mở từ bài đăng, tự đóng khi bài hết hạn. Phố Mình không xử lý thanh toán — mọi giao dịch
            hai bên tự thoả thuận.
          </Text>
        </View>
        {chatBubbles.map((b, i) => (
          <View key={i} className={`max-w-[78%] ${b.fromMe ? 'self-end items-end' : 'self-start items-start'}`}>
            <View className={`rounded-2xl px-3.5 py-2.5 ${b.fromMe ? 'bg-ink' : 'bg-white border border-border'}`}>
              <Text className={`text-[13.5px] ${b.fromMe ? 'text-cream' : 'text-ink'}`}>{b.text}</Text>
            </View>
            <Text className="text-[10px] text-muted-light mt-1">{b.time}</Text>
          </View>
        ))}
      </ScrollView>

      {thread.locked ? (
        <View className="mx-3.5 mb-3.5 rounded-2xl bg-danger-50 border border-danger-100 px-3.5 py-3">
          <Text className="font-sans-semibold text-[13px] text-danger-text">Bài đã hết hạn</Text>
          <Text className="mt-1 text-xs leading-[19px] text-danger-text">
            Cuộc trò chuyện này đã đóng và không thể nhắn thêm.
          </Text>
        </View>
      ) : (
        <View className="border-t border-border px-3.5 pt-2.5 pb-3.5 flex-row items-center gap-2.5 bg-white">
          <View className="flex-1 h-10 rounded-full bg-cream-surface justify-center px-4">
            <Text className="text-[13.5px] text-muted-light">Nhắn cho quán…</Text>
          </View>
          <View className="w-10 h-10 rounded-full bg-ink items-center justify-center">
            <Text className="text-white">↑</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
