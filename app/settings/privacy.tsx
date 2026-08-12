import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { privacyBlocks } from '../../src/mocks/phoMinh';

// on.privacy — quyền riêng tư.
export default function PrivacyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Quyền riêng tư</Text>
      </View>
      <ScrollView contentContainerClassName="p-4.5">
        <View className="rounded-2xl bg-primary-50 border border-primary-100 p-3.5">
          <Text className="text-[13px] leading-[21px] text-primary">
            Vị trí thời gian thực là dữ liệu cá nhân nhạy cảm theo Nghị định 13/2023. App chỉ lấy vị trí khi bạn đang
            mở app.
          </Text>
        </View>
        <View className="mt-4 gap-4">
          {privacyBlocks.map((b) => (
            <View key={b.title}>
              <Text className="font-sans-bold text-sm text-ink">{b.title}</Text>
              <Text className="mt-1.5 text-[13.5px] leading-[21px] text-muted">{b.body}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
