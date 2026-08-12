import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '../../src/components/ui/Avatar';
import { Chip } from '../../src/components/ui/Chip';
import { areas, currentUser } from '../../src/mocks/phoMinh';

const TIER_BARS = 5;

// isProfile — "Tôi": hồ sơ, điểm uy tín, lọc dòng tin, hai khu vực, tài khoản.
export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      <ScrollView contentContainerClassName="pb-4">
        <View className="px-4.5 pt-4 pb-5 bg-white border-b border-border">
          <View className="flex-row items-center gap-3.5">
            <Avatar initial={currentUser.initial} size={58} radius={18} />
            <View className="flex-1">
              <Text className="text-[19px] font-sans-bold text-ink">{currentUser.displayName}</Text>
              <Text className="text-[12.5px] text-muted mt-0.5">
                Tham gia {currentUser.joinedMonths} tháng · {currentUser.postCount} bài · {currentUser.commentCount}{' '}
                bình luận
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push('/profile/trust')}
            className="mt-4 rounded-2xl border border-border bg-cream p-3.5"
          >
            <View className="flex-row items-center gap-2.5">
              <Chip label={currentUser.trustTier} color="green" size="md" />
              <Text className="text-[12.5px] text-muted">
                bậc {currentUser.trustTierIndex} / {currentUser.trustTierMax}
              </Text>
            </View>
            <View className="mt-3 flex-row gap-1.5">
              {Array.from({ length: TIER_BARS }).map((_, i) => (
                <View
                  key={i}
                  className={`flex-1 h-1.5 rounded-full ${i < currentUser.trustTierIndex ? 'bg-primary' : 'bg-border'}`}
                />
              ))}
            </View>
            <Text className="mt-2.5 text-xs leading-[19px] text-muted">
              Còn <Text className="font-sans-bold text-ink">{currentUser.nextTierIn} lượt hữu ích</Text> nữa để lên
              bậc "Kỳ cựu". Điểm chỉ tăng, không ai hạ được điểm của bạn.
            </Text>
          </Pressable>

          <View className="mt-3 flex-row flex-wrap gap-2">
            <Chip label="Xác thực SĐT" color="green" />
            <Chip label="Tài khoản > 6 tháng" color="gray" />
            <Chip label="12 tin được xác nhận" color="gold" />
          </View>
        </View>

        <View className="px-4.5 pt-4">
          <Text className="font-mono-medium text-xs tracking-wide text-muted">DÒNG TIN CỦA TÔI</Text>
          <Pressable
            onPress={() => router.push('/profile/filter')}
            className="mt-2.5 rounded-2xl border border-border bg-white p-3.5 flex-row items-center gap-3"
          >
            <View className="w-[34px] h-[34px] rounded-[11px] bg-primary-50 items-center justify-center">
              <View className="w-3.5 h-0.5 bg-primary rounded" />
            </View>
            <View className="flex-1">
              <Text className="font-sans-semibold text-sm text-ink">Lọc dòng tin</Text>
              <Text className="text-[11.5px] text-muted mt-0.5">Tất cả loại · mặc định</Text>
            </View>
            <Text className="text-muted-light">›</Text>
          </Pressable>
          <Text className="mt-2 text-[11.5px] leading-[18px] text-muted">
            Chọn loại tin, cách sắp xếp và bán kính. Áp dụng cho cả ba tab Nhà, Chỗ làm, Quanh đây.
          </Text>

          <Text className="mt-5 font-mono-medium text-xs tracking-wide text-muted">KHU VỰC CỦA TÔI</Text>
          <View className="mt-2.5 gap-2.5">
            <AreaRow label={`Nhà · ${areas.home.place}`} meta={`Bán kính ${areas.home.radiusKm} km · nhắc tin mỗi thứ Ba`} dot={areas.home.color} />
            <AreaRow label={`Chỗ làm · ${areas.work.place}`} meta={`Bán kính ${areas.work.radiusKm} km · nhắc tin mỗi thứ Ba`} dot={areas.work.color} />
          </View>

          <Text className="mt-5 font-mono-medium text-xs tracking-wide text-muted">TÀI KHOẢN</Text>
          <View className="mt-2.5 rounded-2xl border border-border bg-white overflow-hidden">
            <NavRow label="Bài của tôi" onPress={() => router.push('/profile/my-posts')} />
            <NavRow label="Chỉnh sửa hồ sơ" onPress={() => router.push('/profile/edit')} />
            <NavRow label="Chuyển sang tài khoản chủ quán" onPress={() => router.push('/merchant/signup')} />
            <NavRow label="Xem hồ sơ hàng xóm (mẫu)" onPress={() => router.push('/profile/lan-t18')} />
            <NavRow label="Cài đặt" onPress={() => router.push('/settings')} last />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AreaRow({ label, meta, dot }: { label: string; meta: string; dot: string }) {
  return (
    <Pressable
      onPress={() => router.push('/profile/areas')}
      className="rounded-[13px] border border-border bg-white px-3.5 py-3 flex-row items-center gap-2.5"
    >
      <View style={{ backgroundColor: dot }} className="w-2 h-2 rounded-full" />
      <View className="flex-1">
        <Text className="font-sans-semibold text-sm text-ink">{label}</Text>
        <Text className="text-[11.5px] text-muted mt-0.5">{meta}</Text>
      </View>
      <Text className="text-muted-light">›</Text>
    </Pressable>
  );
}

function NavRow({ label, onPress, last }: { label: string; onPress: () => void; last?: boolean }) {
  return (
    <Pressable onPress={onPress} className={`px-3.5 py-3.5 flex-row ${last ? '' : 'border-b border-border-soft'}`}>
      <Text className="flex-1 text-sm text-ink">{label}</Text>
      <Text className="text-muted-light">›</Text>
    </Pressable>
  );
}
