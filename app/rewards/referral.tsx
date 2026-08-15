import { router } from 'expo-router';
import { ActivityIndicator, Pressable, Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useReferralCode } from '../../src/hooks/useRewards';

const SHARE_MESSAGE = (code: string) =>
  `Vào Phố Mình bằng mã giới thiệu của mình nhé: ${code} — cùng theo dõi tin tức khu phố, cảnh báo an toàn và ưu đãi quán quen.`;

// Chia sẻ mã giới thiệu (tai-lieu-chuc-nang.md #55) — backend GET /rewards/referral-code đã có sẵn
// từ trước, nhưng mobile chưa có màn nào hiển thị/chia sẻ mã. Dùng Share API gốc react-native,
// không cần thêm package clipboard riêng.
export default function ReferralScreen() {
  const { data, isLoading } = useReferralCode();

  const onShare = () => {
    if (!data) return;
    void Share.share({ message: SHARE_MESSAGE(data.code) });
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Mời bạn bè</Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        {isLoading || !data ? (
          <ActivityIndicator />
        ) : (
          <>
            <Text className="text-sm text-muted text-center">
              Mỗi người dùng mã của bạn để tham gia, bạn được thưởng vào ví.
            </Text>
            <View className="mt-4.5 rounded-2xl border border-dashed border-primary bg-white px-6 py-4">
              <Text className="font-mono-semibold text-[26px] tracking-[3px] text-primary">
                {data.code}
              </Text>
            </View>
            <Pressable
              onPress={onShare}
              className="mt-5.5 h-11 w-full rounded-xl bg-primary items-center justify-center"
            >
              <Text className="font-sans-semibold text-sm text-white">Chia sẻ mã</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
