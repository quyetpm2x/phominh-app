import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { faqList } from '../../src/mocks/phoMinh';

// on.help — trung tâm trợ giúp.
export default function HelpScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Trợ giúp</Text>
      </View>
      <ScrollView contentContainerClassName="p-4.5">
        <View className="h-[46px] rounded-[13px] bg-white border border-border justify-center px-4">
          <Text className="text-[13.5px] text-muted-light">Tìm câu hỏi…</Text>
        </View>
        <View className="mt-3.5 gap-2.5">
          {faqList.map((f) => (
            <View key={f.q} className="rounded-2xl border border-border bg-white p-3.5">
              <Text className="font-sans-semibold text-sm text-ink">{f.q}</Text>
              <Text className="mt-1.5 text-[12.5px] leading-[19px] text-muted">{f.a}</Text>
            </View>
          ))}
        </View>
        <View className="mt-4 rounded-2xl border border-border bg-white p-3.5">
          <Text className="font-sans-semibold text-[13.5px] text-ink">Chưa tìm được câu trả lời?</Text>
          <Text className="mt-1 text-xs text-muted">Đội vận hành trả lời trong giờ hành chính.</Text>
          <Pressable className="mt-3 h-11 rounded-xl bg-ink items-center justify-center">
            <Text className="font-sans-semibold text-sm text-white">Gửi câu hỏi</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
