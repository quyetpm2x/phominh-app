import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { extractErrorMessage } from '../../src/api/client';
import { TextInput } from '../../src/components/ui/TextInput';
import type { MyReferralItem } from '../../src/api/endpoints/rewards';
import { useMyReferrals, useReferralCode, useRedeemReferralCode } from '../../src/hooks/useRewards';

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

      {isLoading || !data ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView contentContainerClassName="px-6 pt-8 pb-6 items-center">
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

          <RedeemSection />
          <MyReferralsSection />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const STATUS_LABEL = (item: MyReferralItem) => {
  if (item.rewardGranted) return 'Đã thưởng';
  if (item.qualified) return 'Đủ điều kiện';
  return 'Đang chờ hoạt động';
};

const STATUS_CLASS = (item: MyReferralItem) => {
  if (item.rewardGranted) return 'text-primary';
  if (item.qualified) return 'text-ink';
  return 'text-muted';
};

// Danh sách đã giới thiệu thành công (mục 56) — trước đây không có endpoint nào liệt kê, và
// tệ hơn: RewardsService.qualifyIfActive() vốn hoàn toàn mồ côi (không cron/route nào gọi tới) nên
// dù redeem thành công, thưởng cũng không bao giờ được cấp — đã thêm ReferralQualificationCronService
// chạy hàng ngày để khắc phục, màn này hiện kết quả thật của cron đó.
function MyReferralsSection() {
  const { data: referrals } = useMyReferrals();
  if (!referrals || referrals.length === 0) return null;

  return (
    <View className="mt-8 w-full">
      <Text className="font-mono-medium text-xs tracking-wide text-muted">ĐÃ GIỚI THIỆU</Text>
      <View className="mt-2.5 rounded-2xl border border-border bg-white overflow-hidden">
        {referrals.map((item, i) => (
          <View
            key={item.id}
            className={`px-3.5 py-3 flex-row items-center justify-between ${
              i === referrals.length - 1 ? '' : 'border-b border-border-soft'
            }`}
          >
            <View>
              <Text className="text-sm text-ink">{item.invitedUserAlias}</Text>
              <Text className="text-[11px] text-muted-light mt-0.5">
                {new Date(item.createdAt).toLocaleDateString('vi-VN')}
              </Text>
            </View>
            <Text className={`text-xs font-sans-semibold ${STATUS_CLASS(item)}`}>{STATUS_LABEL(item)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// Nhập mã của người mời (khép vòng lặp mục 55) — backend POST .../redeem đã có sẵn từ trước nhưng
// mobile chưa từng có UI nào gọi tới, nên người được mời không có chỗ dùng mã đã nhận.
function RedeemSection() {
  const [code, setCode] = useState('');
  const [redeemed, setRedeemed] = useState(false);
  const redeem = useRedeemReferralCode();

  const onRedeem = () => {
    void redeem.mutateAsync(code.trim().toUpperCase()).then(
      () => {
        setRedeemed(true);
        setCode('');
      },
      async (err) => Alert.alert('Không dùng được mã này', await extractErrorMessage(err)),
    );
  };

  if (redeemed) {
    return (
      <Text className="mt-8 text-sm text-primary text-center">
        Đã ghi nhận mã giới thiệu — cảm ơn bạn!
      </Text>
    );
  }

  return (
    <View className="mt-8 w-full">
      <Text className="font-mono-medium text-xs tracking-wide text-muted">
        CÓ MÃ CỦA NGƯỜI KHÁC?
      </Text>
      <View className="mt-2.5 flex-row gap-2">
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="Nhập mã giới thiệu"
          autoCapitalize="characters"
          className="flex-1"
        />
        <Pressable
          onPress={onRedeem}
          disabled={!code.trim() || redeem.isPending}
          className={`h-12 rounded-xl bg-ink px-4 items-center justify-center ${
            !code.trim() || redeem.isPending ? 'opacity-50' : ''
          }`}
        >
          <Text className="font-sans-semibold text-sm text-white">
            {redeem.isPending ? '…' : 'Dùng mã'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
