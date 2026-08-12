import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '../../src/components/ui/Avatar';
import { mutedNeighbors } from '../../src/mocks/phoMinh';

// on.muted — "Không quan tâm": ẩn bài/bình luận, không phải chặn hẳn.
export default function MutedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-sm text-ink">Không quan tâm</Text>
        <View className="flex-1" />
        <Text className="font-mono-medium text-[11px] text-muted">{mutedNeighbors.length}</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        <Text className="text-[13px] leading-[20px] text-muted">
          Chọn ẩn bài viết, ẩn bình luận, hoặc cả hai cho từng người. Họ không được báo là đã bị ẩn.
        </Text>
        <View className="mt-3.5 gap-2.5">
          {mutedNeighbors.map((n) => (
            <View key={n.id} className="flex-row items-center gap-2.5 rounded-2xl border border-border bg-white px-3.5 py-3">
              <Avatar initial={n.initial} color={n.color} size={38} radius={12} />
              <View className="flex-1">
                <Text className="font-sans-semibold text-sm text-ink">{n.name}</Text>
                <Text className="text-[11.5px] text-muted mt-0.5">{n.meta}</Text>
              </View>
            </View>
          ))}
        </View>
        <View className="mt-4 rounded-2xl border border-border bg-white p-3.5">
          <Text className="text-xs leading-[19px] text-muted">
            Ẩn không phải là chặn: bạn vẫn có thể vào hồ sơ họ để xem, và tin khẩn cấp đã được nhiều người xác nhận
            vẫn hiện để bạn không bỏ lỡ cảnh báo an toàn.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
