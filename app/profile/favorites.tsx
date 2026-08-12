import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '../../src/components/ui/Avatar';
import { favoriteNeighbors } from '../../src/mocks/phoMinh';

// on.favorites — "Người quen": tin của họ luôn lên đầu, báo ngay thay vì chờ bản tin tuần.
export default function FavoritesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-sm text-ink">Người quen</Text>
        <View className="flex-1" />
        <Text className="font-mono-medium text-[11px] text-muted">{favoriteNeighbors.length}</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        <Text className="text-[13px] leading-[20px] text-muted">
          Tin mới của những người này luôn lên đầu dòng tin, kể cả khi họ ở xa hơn người khác — và được báo ngay
          thay vì chờ bản tin tuần.
        </Text>
        <View className="mt-3.5 gap-2.5">
          {favoriteNeighbors.map((n) => (
            <View key={n.id} className="flex-row items-center gap-2.5 rounded-2xl border border-border bg-white px-3.5 py-3">
              <Avatar initial={n.initial} color={n.color} size={38} radius={12} />
              <View className="flex-1">
                <Text className="font-sans-semibold text-sm text-ink">{n.name}</Text>
                <Text className="text-[11.5px] text-muted mt-0.5">{n.meta}</Text>
              </View>
              <Text className="text-primary text-sm">★</Text>
            </View>
          ))}
        </View>
        <View className="mt-4 rounded-2xl border border-border bg-white p-3.5">
          <Text className="text-xs leading-[19px] text-muted">
            Danh sách này riêng tư — người được thêm không biết. Ưu tiên chỉ áp dụng trong bán kính khu vực bạn đang
            xem, không kéo tin từ khu khác về.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
