import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PostCard } from '../../src/components/PostCard';
import { Avatar } from '../../src/components/ui/Avatar';
import { Chip } from '../../src/components/ui/Chip';
import { otherNeighbor, posts } from '../../src/mocks/phoMinh';

// on.otherProfile — hồ sơ công khai của một hàng xóm khác (mẫu tĩnh, không phân biệt theo id).
export default function OtherProfileScreen() {
  const otherPosts = posts.slice(1, 3);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-sm text-ink">{otherNeighbor.name}</Text>
        <View className="flex-1" />
        <Pressable
          onPress={() => router.push('/report/post')}
          className="h-[30px] rounded-lg border border-border bg-white px-2.5 items-center justify-center"
        >
          <Text className="text-xs text-muted">Báo cáo</Text>
        </Pressable>
      </View>

      <ScrollView>
        <View className="px-4.5 pt-4 pb-4 bg-white border-b border-border">
          <View className="flex-row items-center gap-3.5">
            <Avatar initial={otherNeighbor.initial} color={otherNeighbor.color} size={56} radius={18} />
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5">
                <Text className="text-lg font-sans-bold text-ink">{otherNeighbor.name}</Text>
                <Chip label={otherNeighbor.badge} color="green" />
              </View>
              <Text className="text-[12.5px] text-muted mt-0.5">
                Hàng xóm cách bạn {otherNeighbor.distance} · tham gia {otherNeighbor.joinedMonths} tháng
              </Text>
            </View>
          </View>

          <View className="mt-3.5 flex-row gap-2.5">
            <Stat value={otherNeighbor.postCount} label="bài đăng" />
            <Stat value={otherNeighbor.usefulCount} label="lượt hữu ích" />
            <Stat value={otherNeighbor.reportedCount} label="bị báo cáo" tone="green" />
          </View>
        </View>

        <View className="px-4.5 pt-4 pb-6">
          <Text className="font-mono-medium text-xs tracking-wide text-muted">BÀI CÔNG KHAI CÒN HẠN</Text>
          <View className="mt-2.5 gap-2.5">
            {otherPosts.map((p) => (
              <PostCard key={p.id} post={p} />
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

function Stat({ value, label, tone }: { value: number; label: string; tone?: 'green' }) {
  return (
    <View className="flex-1 rounded-xl border border-border p-2.5">
      <Text className={`font-mono-semibold text-lg ${tone === 'green' ? 'text-primary' : 'text-ink'}`}>{value}</Text>
      <Text className="text-[11px] text-muted mt-0.5">{label}</Text>
    </View>
  );
}
