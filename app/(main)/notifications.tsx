import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { areas, notifDigestHome, notifDigestWork } from '../../src/mocks/phoMinh';

// on.notifications — bản tin tuần gom theo khu vực + cảnh báo khẩn cấp gửi ngay.
export default function NotificationsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Text className="pl-1.5 font-sans-bold text-[15px] text-ink">Thông báo</Text>
        <View className="flex-1" />
        <Pressable
          onPress={() => router.push('/settings/notifications')}
          className="h-[30px] rounded-lg border border-border bg-white px-2.5 items-center justify-center"
        >
          <Text className="text-xs text-muted">Cài đặt</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="p-4">
        <View className="rounded-2xl border border-border bg-white overflow-hidden">
          <View className="px-3.5 py-3 bg-primary-50 border-b border-primary-100 flex-row items-center gap-2">
            <View className="w-1.5 h-1.5 rounded-full bg-primary" />
            <Text className="font-sans-semibold text-xs text-primary">
              Bản tin tuần này · Nhà · {areas.home.place}
            </Text>
          </View>
          {notifDigestHome.map((n, i) => (
            <View key={n.title} className={`px-3.5 py-3 ${i < notifDigestHome.length - 1 ? 'border-b border-border-soft' : ''}`}>
              <Text className="font-sans-semibold text-[13.5px] text-ink">{n.title}</Text>
              <Text className="text-[11.5px] text-muted mt-0.5">{n.meta}</Text>
            </View>
          ))}
        </View>

        <View className="mt-3 rounded-2xl border border-border bg-white overflow-hidden">
          <View className="px-3.5 py-3 bg-accent-50 border-b border-accent-200 flex-row items-center gap-2">
            <View className="w-1.5 h-1.5 rounded-full bg-accent-300" />
            <Text className="font-sans-semibold text-xs text-accent-text">Bản tin tuần này · Chỗ làm</Text>
          </View>
          {notifDigestWork.map((n) => (
            <View key={n.title} className="px-3.5 py-3">
              <Text className="font-sans-semibold text-[13.5px] text-ink">{n.title}</Text>
              <Text className="text-[11.5px] text-muted mt-0.5">{n.meta}</Text>
            </View>
          ))}
        </View>

        <Text className="mt-4 font-mono-medium text-xs tracking-wide text-muted">GỬI NGAY</Text>
        <View className="mt-2.5 rounded-2xl border-[1.5px] border-danger-200 bg-white overflow-hidden">
          <View className="h-1 bg-danger" />
          <View className="px-3.5 py-3">
            <Text className="font-sans-semibold text-[13.5px] text-ink">Ngập cổng Times City</Text>
            <Text className="text-xs text-muted mt-0.5">3 hàng xóm đã xác nhận · 4 phút trước</Text>
          </View>
        </View>

        <Text className="mt-3.5 text-xs leading-[19px] text-muted">
          Chỉ tin khẩn cấp đủ xác nhận mới báo ngay. Tin thường gom vào bản tin tuần.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
