import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip } from '../../src/components/ui/Chip';
import { currentUser, trustHistory, trustRules } from '../../src/mocks/phoMinh';

// on.trustDetail — điểm uy tín, nguồn tăng điểm, lịch sử gần đây.
export default function TrustDetailScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-sm text-ink">Điểm uy tín</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        <View className="rounded-2xl border border-border bg-white p-4">
          <View className="flex-row items-baseline gap-2.5">
            <Text className="font-mono-semibold text-[34px] text-ink">{currentUser.trustScore}</Text>
            <Chip label={currentUser.trustTier} color="green" size="md" />
          </View>
          <View className="mt-3 flex-row gap-1.5">
            {Array.from({ length: currentUser.trustTierMax }).map((_, i) => (
              <View
                key={i}
                className={`flex-1 h-1.5 rounded-full ${i < currentUser.trustTierIndex ? 'bg-primary' : 'bg-border'}`}
              />
            ))}
          </View>
          <Text className="mt-2.5 text-[12.5px] text-muted">
            Bậc {currentUser.trustTierIndex} / {currentUser.trustTierMax} · còn {currentUser.nextTierIn} lượt hữu ích
            để lên "Kỳ cựu"
          </Text>
        </View>

        <Text className="mt-4 font-mono-medium text-xs tracking-wide text-muted">ĐIỂM TĂNG TỪ ĐÂU</Text>
        <View className="mt-2.5 rounded-2xl border border-border bg-white overflow-hidden">
          {trustRules.map((r, i) => (
            <View key={r.label} className={`px-3.5 py-3 flex-row ${i < trustRules.length - 1 ? 'border-b border-border-soft' : ''}`}>
              <Text className="flex-1 text-[13.5px] text-ink">{r.label}</Text>
              <Text className="font-mono-medium text-[12.5px] text-muted">{r.points}</Text>
            </View>
          ))}
        </View>

        <View className="mt-3.5 rounded-2xl bg-primary-50 border border-primary-100 p-3.5">
          <Text className="text-xs leading-[19px] text-primary">
            Không có nút hạ điểm. Không ai — kể cả đối thủ cạnh tranh — dìm được điểm của bạn.
          </Text>
        </View>

        <Text className="mt-4.5 font-mono-medium text-xs tracking-wide text-muted">LỊCH SỬ GẦN ĐÂY</Text>
        <View className="mt-2.5 rounded-2xl border border-border bg-white overflow-hidden">
          {trustHistory.map((h, i) => (
            <View key={h.label} className={`px-3.5 py-3 flex-row items-center gap-2 ${i < trustHistory.length - 1 ? 'border-b border-border-soft' : ''}`}>
              <View className="flex-1">
                <Text className="text-[13px] text-ink">{h.label}</Text>
                <Text className="text-[11px] text-muted-light mt-0.5">{h.time}</Text>
              </View>
              {h.delta ? <Text className="font-mono-semibold text-[13px] text-primary">{h.delta}</Text> : null}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
