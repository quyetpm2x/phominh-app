import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { merchantStats } from '../../src/mocks/phoMinh';

// on.merchantStats — thống kê lượt xem, chỉ số liệu tổng hợp, không lộ danh tính người xem.
export default function MerchantStatsScreen() {
  const maxBar = Math.max(...merchantStats.dailyBars);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Thống kê lượt xem</Text>
        <View className="flex-1" />
        <View className="rounded-md bg-cream-surface px-2 py-1">
          <Text className="font-sans-semibold text-[10.5px] text-muted">Giai đoạn sau</Text>
        </View>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        <View className="rounded-2xl border border-border bg-white p-4">
          <Text className="text-xs text-muted">Lượt xem 7 ngày</Text>
          <Text className="mt-1 font-mono-semibold text-[30px] text-ink">{merchantStats.weekViews.toLocaleString('vi-VN')}</Text>
          <View className="mt-3.5 flex-row items-end gap-1.5 h-24">
            {merchantStats.dailyBars.map((v, i) => (
              <View key={i} className="flex-1 rounded-t bg-accent-300" style={{ height: `${(v / maxBar) * 100}%` }} />
            ))}
          </View>
        </View>

        <View className="mt-3.5 rounded-2xl border border-border bg-white p-4">
          <Text className="font-sans-semibold text-[13.5px] text-ink">Người xem ở đâu</Text>
          <View className="mt-3 gap-2.5">
            {merchantStats.distanceBreakdown.map((d) => (
              <View key={d.label}>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-ink">{d.label}</Text>
                  <Text className="font-mono-medium text-xs text-muted">{d.pct}%</Text>
                </View>
                <View className="mt-1.5 h-1.5 rounded-full bg-cream-surface overflow-hidden">
                  <View className="h-full bg-primary" style={{ width: `${d.pct}%` }} />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-3.5 rounded-[13px] border border-border bg-white p-3.5">
          <Text className="text-xs leading-[19px] text-muted">
            Chỉ hiện số liệu tổng hợp. Không tiết lộ danh tính từng người đã xem bài của bạn.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
