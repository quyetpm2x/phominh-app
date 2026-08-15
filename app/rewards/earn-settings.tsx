import { router } from 'expo-router';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useEarnSettings, useUpdateEarnSettings } from '../../src/hooks/useRewards';

const CONFIRM_MESSAGE =
  'Điểm uy tín (E1/E2) vẫn tính cho bạn dù có bật hay không. Bật công tắc này chỉ quyết định có được QUY ĐỔI thành tiền thật hay không.\n\n' +
  'Không hồi tố: chỉ tính thưởng từ THỜI ĐIỂM bật trở đi — hoạt động trước đó không được tính. Nếu tắt rồi bật lại, tính là mốc thời gian MỚI.';

// on.earnSettings — 2 công tắc opt-in ĐỘC LẬP (mục 51/52/63, bussiness §5.1a).
export default function EarnSettingsScreen() {
  const { data: settings, isLoading } = useEarnSettings();
  const updateSettings = useUpdateEarnSettings();

  const confirmAndToggle = (field: 'earnViaPostsEnabled' | 'affiliateEnabled', nextValue: boolean) => {
    if (!nextValue) {
      void updateSettings.mutateAsync({ [field]: nextValue });
      return;
    }
    Alert.alert('Bật kiếm tiền?', CONFIRM_MESSAGE, [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Bật', onPress: () => void updateSettings.mutateAsync({ [field]: nextValue }) },
    ]);
  };

  if (isLoading || !settings) {
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
        <Text className="font-sans-semibold text-[14.5px] text-ink">Kiếm tiền trên Phố Mình</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        <View className="gap-2.5">
          <ToggleRow
            label="Kiếm tiền qua bài viết"
            hint="Tham gia bảng xếp hạng thưởng theo bậc, mỗi tháng"
            on={settings.earnViaPostsEnabled}
            onToggle={() => confirmAndToggle('earnViaPostsEnabled', !settings.earnViaPostsEnabled)}
          />
          <ToggleRow
            label="Chế độ Affiliate"
            hint="Mã giới thiệu bắt đầu tính thưởng 5.000đ/lượt"
            on={settings.affiliateEnabled}
            onToggle={() => confirmAndToggle('affiliateEnabled', !settings.affiliateEnabled)}
          />
        </View>

        {settings.earnEnabledAt ? (
          <Text className="mt-3.5 text-xs text-muted">
            Đang tính thưởng từ {new Date(settings.earnEnabledAt).toLocaleDateString('vi-VN')}.
          </Text>
        ) : (
          <Text className="mt-3.5 text-xs text-muted">Chưa bật công tắc nào — chưa tích luỹ thưởng.</Text>
        )}

        <View className="mt-5 rounded-2xl border border-border bg-white p-3.5">
          <Text className="text-xs leading-[19px] text-muted">
            Liên kết ngân hàng qua eKYC dùng chung cho cả 2 chế độ, chỉ cần làm 1 lần — kích hoạt khi bạn bật công
            tắc đầu tiên.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ToggleRow({
  label,
  hint,
  on,
  onToggle,
}: {
  label: string;
  hint: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      className="rounded-2xl border border-border bg-white px-3.5 py-3.5 flex-row items-center gap-3"
    >
      <View className="flex-1">
        <Text className="font-sans-semibold text-sm text-ink">{label}</Text>
        <Text className="mt-0.5 text-[11.5px] text-muted">{hint}</Text>
      </View>
      <View className={`w-11 h-6 rounded-full p-0.5 ${on ? 'bg-primary' : 'bg-border'}`}>
        <View className={`w-5 h-5 rounded-full bg-white ${on ? 'ml-5' : 'ml-0'}`} />
      </View>
    </Pressable>
  );
}
