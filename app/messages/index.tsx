import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '../../src/components/ui/Avatar';
import { chatThreads } from '../../src/mocks/phoMinh';

// on.messages — "Nhắn hỏi": chỉ mở từ một bài đăng cụ thể, không có danh bạ tìm người lạ.
// KHÔNG phải tab chính trong thiết kế ({{ tabBar }} thực tế chỉ có Dòng tin/Thông báo/+/Quán/Tôi) —
// route này được push từ bài đăng/thông báo, nên nằm ngoài nhóm (main).
export default function MessagesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-bold text-[15px] text-ink">Nhắn hỏi</Text>
        <View className="flex-1" />
        <Text className="font-mono-medium text-[11px] text-muted">{chatThreads.length} cuộc</Text>
      </View>

      <ScrollView contentContainerClassName="p-4">
        <Text className="text-xs leading-[19px] text-muted">
          Nhắn hỏi chỉ mở từ một bài đăng cụ thể — không có danh bạ để tìm người lạ.
        </Text>
        <View className="mt-3 gap-2.5">
          {chatThreads.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => router.push(`/messages/${t.id}`)}
              className="flex-row items-center gap-2.5 rounded-2xl border border-border bg-white px-3.5 py-3"
            >
              <Avatar initial={t.initial} color={t.color} size={40} radius={13} />
              <View className="flex-1">
                <View className="flex-row items-center gap-1.5">
                  <Text className="font-sans-semibold text-sm text-ink">{t.peer}</Text>
                  {t.locked ? <Text className="text-[10.5px] text-muted-light">· đã đóng</Text> : null}
                </View>
                <Text className="text-[11.5px] text-muted mt-0.5">
                  {t.postTitle} · {t.distance}
                </Text>
                <Text numberOfLines={1} className="text-[12.5px] text-ink/70 mt-1">
                  {t.lastMessage}
                </Text>
              </View>
              <View className="items-end gap-1.5">
                <Text className="text-[10.5px] text-muted-light">{t.time}</Text>
                {t.unread ? <View className="w-2 h-2 rounded-full bg-primary" /> : null}
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
