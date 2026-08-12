import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PhotoPlaceholder } from '../../../src/components/ui/PhotoPlaceholder';

// on.quick — chụp nhanh kiểu Locket: một chạm, thêm một dòng, gửi thẳng, tự ẩn sau 12 giờ.
export default function QuickCameraScreen() {
  return (
    <SafeAreaView className="flex-1 bg-ink">
      <View className="h-11 flex-row items-center justify-between px-4">
        <Pressable onPress={() => router.replace('/(main)/feed')}>
          <Text className="text-white text-[15px]">Đóng</Text>
        </Pressable>
        <Text className="text-white font-sans-semibold text-[13.5px]">Chụp nhanh</Text>
        <View className="w-11" />
      </View>

      <PhotoPlaceholder dark icon="camera" style={{ flex: 1, marginHorizontal: 12, marginTop: 6, borderRadius: 26 }}>
        <View className="absolute left-3.5 right-3.5 bottom-3.5 h-[38px] rounded-full bg-ink/50 border border-white/20 justify-center px-3.5">
          <Text className="text-[13px] text-[#c9c4b8]">Thêm một dòng…</Text>
        </View>
        <View className="absolute left-3.5 top-3.5 rounded-md bg-ink/50 px-2 py-1">
          <Text className="font-mono-medium text-[10.5px] text-[#e9e6df]">Ngõ 4 Nguyễn Đình Chiểu · 240 m quanh bạn</Text>
        </View>
      </PhotoPlaceholder>

      <View className="flex-row items-center justify-center gap-9 py-3.5">
        <Text className="text-[#7d786d] text-[12.5px]">Đổi cam</Text>
        <Pressable
          onPress={() => router.push('/post/create/quick-caption')}
          className="w-[78px] h-[78px] rounded-full border-[5px] border-white bg-primary"
        />
        <Text className="text-[#7d786d] text-[12.5px]">Đèn</Text>
      </View>
      <Text className="px-6 pb-6 text-center text-xs leading-[18px] text-[#7d786d]">
        Chụp một chạm, thêm một dòng rồi gửi thẳng lên xóm. Tin nhanh tự ẩn sau 12 giờ.
      </Text>
    </SafeAreaView>
  );
}
