import { router } from 'expo-router';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip, FilterChip } from '../../src/components/ui/Chip';
import { PhotoPlaceholder } from '../../src/components/ui/PhotoPlaceholder';
import { useMerchantDashboard, useMyMerchantProfile, useUpdatePhoneVisibility } from '../../src/hooks/useMerchant';
import { formatFreshness } from '../../src/utils/formatFreshness';

const PHONE_VISIBILITY_OPTIONS: { label: string; value: 'always' | 'business_hours' | 'hidden' }[] = [
  { label: 'Luôn hiện', value: 'always' },
  { label: 'Giờ mở cửa', value: 'business_hours' },
  { label: 'Ẩn', value: 'hidden' },
];

function countdownLabel(expiresAt: string | null): string {
  if (!expiresAt) return '';
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return 'đã hết hạn';
  const hours = Math.floor(ms / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  return `tự ẩn sau ${hours}g ${minutes}p`;
}

// isMerchant — tab "Quán" (mục 40): tin hôm nay, số điện thoại hồ sơ.
export default function MerchantTabScreen() {
  const { data: merchant, isLoading: merchantLoading, isError } = useMyMerchantProfile();
  const { data: dashboard } = useMerchantDashboard();
  const updatePhoneVisibility = useUpdatePhoneVisibility();

  if (merchantLoading) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center" edges={['top']}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (isError || !merchant) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center px-6" edges={['top']}>
        <Text className="text-center text-sm text-muted mb-3">Bạn chưa có tài khoản chủ quán.</Text>
        <Pressable onPress={() => router.push('/merchant/signup')} className="h-11 px-5 rounded-xl bg-ink items-center justify-center">
          <Text className="font-sans-semibold text-sm text-white">Đăng ký ngay</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const activePost = dashboard?.activePost;
  const progressPct = activePost?.expiresAt
    ? Math.min(
        100,
        Math.max(
          0,
          ((Date.now() - new Date(activePost.createdAt).getTime()) /
            (new Date(activePost.expiresAt).getTime() - new Date(activePost.createdAt).getTime())) *
            100,
        ),
      )
    : 0;

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Text className="pl-1.5 font-sans-bold text-[15px] text-ink">{merchant.businessName}</Text>
        <View className="ml-1.5">
          <Chip label="Chủ quán" color="gold" />
        </View>
      </View>

      <ScrollView contentContainerClassName="p-4">
        {activePost ? (
          <View className="rounded-2xl border border-border bg-white p-3.5">
            <Text className="font-mono-medium text-xs tracking-wide text-muted">TIN HÔM NAY</Text>
            <View className="mt-2.5 flex-row gap-2.5 items-center">
              {activePost.imageUrl ? (
                <Image source={{ uri: activePost.imageUrl }} style={{ width: 52, height: 52, borderRadius: 11 }} resizeMode="cover" />
              ) : (
                <PhotoPlaceholder style={{ width: 52, height: 52, borderRadius: 11 }} />
              )}
              <View className="flex-1">
                <Text numberOfLines={1} className="font-sans-semibold text-sm text-ink">
                  {activePost.content}
                </Text>
                <Text className="text-[11.5px] text-muted mt-0.5">
                  {formatFreshness(activePost.createdAt)} · {activePost.viewCount} lượt xem · {activePost.commentCount} bình luận
                </Text>
              </View>
            </View>
            <View className="mt-3 h-1.5 rounded-full bg-cream-surface overflow-hidden">
              <View style={{ width: `${progressPct}%` }} className="h-full bg-accent-300" />
            </View>
            <Text className="mt-1.5 font-mono-medium text-[10.5px] text-muted">
              {countdownLabel(activePost.expiresAt)}
            </Text>
          </View>
        ) : (
          <View className="rounded-2xl border border-border bg-white p-3.5 items-center">
            <Text className="text-sm text-muted mb-2.5">Chưa có tin nào đang hoạt động.</Text>
            <Pressable onPress={() => router.push('/merchant/quick-update')} className="h-9 px-4 rounded-lg bg-ink items-center justify-center">
              <Text className="font-sans-semibold text-xs text-white">Đăng tin ngay</Text>
            </Pressable>
          </View>
        )}

        <View className="mt-3 rounded-2xl border border-border bg-white p-3.5">
          <View className="flex-row items-center gap-2.5">
            <Text className="flex-1 font-sans-semibold text-sm text-ink">Hiện số điện thoại</Text>
          </View>
          <View className="mt-2.5 flex-row gap-1.5">
            {PHONE_VISIBILITY_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.value}
                label={opt.label}
                selected={merchant.phoneVisibility === opt.value}
                onPress={() => void updatePhoneVisibility.mutateAsync({ phoneVisibility: opt.value })}
              />
            ))}
          </View>
        </View>

        <View className="mt-3 flex-row gap-2.5">
          <Pressable onPress={() => router.push('/merchant/quick-update')} className="flex-1 h-11 rounded-xl bg-ink items-center justify-center">
            <Text className="font-sans-semibold text-[13.5px] text-white">Cập nhật nhanh</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/merchant/stats')} className="flex-1 h-11 rounded-xl border border-border bg-white items-center justify-center">
            <Text className="font-sans-semibold text-[13.5px] text-ink">Thống kê</Text>
          </Pressable>
        </View>
        <Pressable
          onPress={() => router.push('/merchant/menu-photos')}
          className="mt-2.5 h-11 rounded-xl border border-border bg-white items-center justify-center"
        >
          <Text className="font-sans-semibold text-[13.5px] text-ink">Quản lý ảnh Menu</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/merchant/payments')}
          className="mt-2.5 h-11 rounded-xl border border-border bg-white items-center justify-center"
        >
          <Text className="font-sans-semibold text-[13.5px] text-ink">Lịch sử thanh toán gói</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
