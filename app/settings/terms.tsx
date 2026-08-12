import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { termsBlocks } from '../../src/mocks/phoMinh';

// on.terms — điều khoản sử dụng.
export default function TermsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Điều khoản sử dụng</Text>
      </View>
      <ScrollView contentContainerClassName="p-4.5">
        <Text className="font-mono-medium text-[11px] text-muted">CẬP NHẬT 01/2026</Text>
        <View className="mt-3.5 gap-4">
          {termsBlocks.map((b) => (
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
