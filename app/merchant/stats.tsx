import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useMerchantStats } from '../../src/hooks/useMerchant';

// on.merchantStats — thống kê lượt xem, chỉ số liệu tổng hợp, KHÔNG lộ danh tính người xem (mục 44,
// đã chốt với user). Bỏ phần "Người xem ở đâu" so với bản mock gốc — cần lưu thêm vị trí gắn với
// từng lượt xem mới tính được, ngoài phạm vi đã chốt (chỉ tổng số).
export default function MerchantStatsScreen() {
  const { data: stats, isLoading } = useMerchantStats();
  const maxBar = Math.max(1, ...(stats?.dailyCounts ?? [0]));

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Thống kê lượt xem</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        {isLoading ? <ActivityIndicator /> : null}
        {stats ? (
          <View className="rounded-2xl border border-border bg-white p-4">
            <Text className="text-xs text-muted">Lượt xem 7 ngày</Text>
            <Text className="mt-1 font-mono-semibold text-[30px] text-ink">
              {stats.totalViews.toLocaleString('vi-VN')}
            </Text>
            <View className="mt-3.5 flex-row items-end gap-1.5 h-24">
              {stats.dailyCounts.map((v, i) => (
                <View key={i} className="flex-1 rounded-t bg-accent-300" style={{ height: `${(v / maxBar) * 100}%` }} />
              ))}
            </View>
          </View>
        ) : null}

        <View className="mt-3.5 rounded-[13px] border border-border bg-white p-3.5">
          <Text className="text-xs leading-[19px] text-muted">
            Chỉ hiện số liệu tổng hợp. Không tiết lộ danh tính từng người đã xem bài của bạn.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
