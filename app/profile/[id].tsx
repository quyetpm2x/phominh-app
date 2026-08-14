import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '../../src/components/ui/Avatar';
import { Chip } from '../../src/components/ui/Chip';
import { usePostsByAuthor } from '../../src/hooks/useMyPosts';
import { usePublicProfile } from '../../src/hooks/useUserProfile';
import { formatFreshness } from '../../src/utils/formatFreshness';

function joinedMonthsAgo(createdAt: string): number {
  const ms = Date.now() - new Date(createdAt).getTime();
  return Math.max(0, Math.floor(ms / (30 * 24 * 60 * 60 * 1000)));
}

// on.otherProfile — hồ sơ công khai của một hàng xóm khác (mục 36).
export default function OtherProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: profile, isLoading } = usePublicProfile(id);
  const { data: posts } = usePostsByAuthor(id);

  if (isLoading || !profile) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-sm text-ink">{profile.alias}</Text>
        <View className="flex-1" />
      </View>

      <ScrollView>
        <View className="px-4.5 pt-4 pb-4 bg-white border-b border-border">
          <View className="flex-row items-center gap-3.5">
            <Avatar
              initial={profile.alias.charAt(0).toUpperCase()}
              imageUrl={profile.avatarUrl}
              size={56}
              radius={18}
            />
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5">
                <Text className="text-lg font-sans-bold text-ink">{profile.alias}</Text>
                <Chip label={profile.trustBadgeLabel} color="green" />
              </View>
              <Text className="text-[12.5px] text-muted mt-0.5">
                Tham gia {joinedMonthsAgo(profile.createdAt)} tháng
              </Text>
            </View>
          </View>

          <View className="mt-3.5 flex-row gap-2.5">
            <Stat value={profile.postCount} label="bài đăng" />
          </View>
        </View>

        <View className="px-4.5 pt-4 pb-6">
          <Text className="font-mono-medium text-xs tracking-wide text-muted">BÀI CÔNG KHAI CÒN HẠN</Text>
          <View className="mt-2.5 gap-2.5">
            {posts?.length === 0 ? (
              <Text className="text-sm text-muted py-6 text-center">Chưa có bài nào.</Text>
            ) : null}
            {posts?.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => router.push(`/post/${p.id}`)}
                className="rounded-2xl border border-border bg-white p-3.5"
              >
                <Text numberOfLines={2} className="text-[13.5px] leading-[20px] text-ink/85">
                  {p.content}
                </Text>
                <Text className="mt-1.5 font-mono-medium text-[11px] text-muted">{formatFreshness(p.createdAt)}</Text>
              </Pressable>
            ))}
          </View>
          <View className="mt-4 rounded-2xl border border-border bg-white p-3.5">
            <Text className="text-xs leading-[19px] text-muted">
              Bài đã hết hạn không hiện ở hồ sơ công khai. Chỉ chủ tài khoản xem được lịch sử đầy đủ của mình.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View className="flex-1 rounded-xl border border-border p-2.5">
      <Text className="font-mono-semibold text-lg text-ink">{value}</Text>
      <Text className="text-[11px] text-muted mt-0.5">{label}</Text>
    </View>
  );
}
