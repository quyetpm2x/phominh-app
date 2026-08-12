import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip, FilterChip } from '../../src/components/ui/Chip';
import { PhotoPlaceholder } from '../../src/components/ui/PhotoPlaceholder';

// isMerchant — tab "Quán": tin hôm nay, số điện thoại hồ sơ, bình luận cần xử lý. Là 1 trong 5 tab
// chính ({{ tabBar }} trong thiết kế), không phải màn con của hồ sơ.
export default function MerchantTabScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Text className="pl-1.5 font-sans-bold text-[15px] text-ink">Bún chả Hàng Quạt</Text>
        <View className="ml-1.5">
          <Chip label="Chủ quán" color="gold" />
        </View>
      </View>

      <ScrollView contentContainerClassName="p-4">
        <View className="rounded-2xl border border-border bg-white p-3.5">
          <Text className="font-mono-medium text-xs tracking-wide text-muted">TIN HÔM NAY</Text>
          <View className="mt-2.5 flex-row gap-2.5 items-center">
            <PhotoPlaceholder style={{ width: 52, height: 52, borderRadius: 11 }} />
            <View className="flex-1">
              <Text className="font-sans-semibold text-sm text-ink">Còn 12 suất bún chả, hết là nghỉ</Text>
              <Text className="text-[11.5px] text-muted mt-0.5">18 phút trước · 412 lượt xem · 6 bình luận</Text>
            </View>
          </View>
          <View className="mt-3 h-1.5 rounded-full bg-cream-surface overflow-hidden">
            <View className="w-[22%] h-full bg-accent-300" />
          </View>
          <View className="mt-1.5 flex-row justify-between">
            <Text className="font-mono-medium text-[10.5px] text-muted">tự ẩn sau 18g 42p</Text>
            <Text className="font-mono-medium text-[10.5px] text-muted">đăng 20:14</Text>
          </View>
        </View>

        <View className="mt-3 rounded-2xl border border-border bg-white p-3.5">
          <View className="flex-row items-center gap-2.5">
            <Text className="flex-1 font-sans-semibold text-sm text-ink">Số điện thoại trên hồ sơ quán</Text>
            <Text className="font-mono-semibold text-[13px] text-accent-text">0912 345 678</Text>
          </View>
          <View className="mt-2.5 flex-row gap-1.5">
            <FilterChip label="Luôn hiện" />
            <FilterChip label="Giờ mở cửa" selected />
            <FilterChip label="Ẩn" />
          </View>
          <Text className="mt-2 text-xs leading-[19px] text-muted">Chỉ hiện trong giờ mở cửa 06:00 – 21:00, ngoài giờ tự ẩn.</Text>
        </View>

        <View className="mt-3 flex-row gap-2.5">
          <Pressable
            onPress={() => router.push('/merchant/quick-update')}
            className="flex-1 h-11 rounded-xl bg-ink items-center justify-center"
          >
            <Text className="font-sans-semibold text-[13.5px] text-white">Cập nhật nhanh</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/merchant/stats')}
            className="flex-1 h-11 rounded-xl border border-border bg-white items-center justify-center"
          >
            <Text className="font-sans-semibold text-[13.5px] text-ink">Thống kê</Text>
          </Pressable>
        </View>

        <View className="mt-3 flex-row gap-2.5">
          <Stat value="412" label="lượt xem" />
          <Stat value="1,8 km" label="xa nhất" />
          <Stat value="+31" label="uy tín tuần" tone="green" />
        </View>

        <View className="mt-3 rounded-2xl border border-border bg-white p-3.5">
          <Text className="font-sans-semibold text-sm text-ink">Bình luận trên bài của quán</Text>
          <View className="mt-2.5 gap-2.5">
            <View className="rounded-[11px] border border-border-soft p-2.5">
              <Text className="text-xs text-ink/85">"Quán này bẩn lắm đừng ăn"</Text>
              <View className="mt-2 flex-row items-center gap-1.5">
                <View className="rounded-md bg-danger-50 px-1.5 py-0.5">
                  <Text className="font-mono-medium text-[10.5px] text-danger-text">tài khoản 6 giờ tuổi</Text>
                </View>
                <View className="flex-1" />
                <Pressable className="h-[27px] rounded-md border border-border bg-white px-2.5 items-center justify-center">
                  <Text className="text-[11.5px] text-ink">Ẩn</Text>
                </Pressable>
                <Pressable className="h-[27px] rounded-md border border-border bg-white px-2.5 items-center justify-center">
                  <Text className="text-[11.5px] text-ink">Ghim phản hồi</Text>
                </Pressable>
              </View>
            </View>
            <View className="rounded-[11px] bg-danger-50 border border-danger-100 p-2.5">
              <Text className="text-xs leading-[19px] text-danger-text">
                5 bình luận tiêu cực trong 10 phút. Đã tạm khoá bình luận 1 giờ và báo cho bạn.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ value, label, tone }: { value: string; label: string; tone?: 'green' }) {
  return (
    <View className="flex-1 rounded-[13px] border border-border bg-white p-3">
      <Text className={`font-mono-semibold text-xl ${tone === 'green' ? 'text-primary' : 'text-ink'}`}>{value}</Text>
      <Text className="text-[11px] text-muted mt-0.5">{label}</Text>
    </View>
  );
}
