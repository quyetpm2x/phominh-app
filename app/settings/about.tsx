import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { brand } from '../../src/constants/brand';

// on.about — về ứng dụng.
export default function AboutScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Về ứng dụng</Text>
      </View>
      <ScrollView contentContainerClassName="items-center px-4.5 py-6.5">
        <View className="w-16 h-16 rounded-[20px] bg-primary items-center justify-center">
          <Text className="text-white text-[28px] font-sans-bold">P</Text>
        </View>
        <Text className="mt-3.5 text-[22px] font-sans-bold text-ink">{brand.appName}</Text>
        <Text className="mt-1 font-mono-medium text-xs text-muted">{brand.versionLabel}</Text>
        <Text className="mt-3.5 text-[13.5px] leading-[22px] text-muted text-center max-w-[280px]">
          {brand.taglineLong}
        </Text>

        <View className="mt-5.5 w-full rounded-2xl border border-border bg-white overflow-hidden">
          <AboutRow label="Khu vực thí điểm" value={brand.pilotArea} />
          <AboutRow label="Liên hệ" value={brand.contactEmail} />
          <AboutRow label="Nguồn tin xác thực" value="HSDC Maps" last />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AboutRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View className={`px-3.5 py-3 flex-row ${last ? '' : 'border-b border-border-soft'}`}>
      <Text className="flex-1 text-[13.5px] text-ink">{label}</Text>
      <Text className="text-[13.5px] text-muted">{value}</Text>
    </View>
  );
}
