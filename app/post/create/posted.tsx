import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../../src/components/ui/Button';

// isPosted — xác nhận đăng thành công.
export default function PostedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream items-center justify-center px-8 gap-4">
      <View className="w-[62px] h-[62px] rounded-full bg-primary items-center justify-center">
        <Text className="text-white text-3xl">✓</Text>
      </View>
      <Text className="text-[22px] font-sans-bold text-ink text-center">Đã đăng lên xóm</Text>
      <Text className="text-[14.5px] leading-[22px] text-muted text-center">
        Hàng xóm quanh bạn sẽ thấy ngay. Bài tự ẩn sau 48 giờ.
      </Text>
      <Button label="Về dòng tin" variant="dark" className="mt-2 px-6" onPress={() => router.replace('/(main)/feed')} />
    </SafeAreaView>
  );
}
