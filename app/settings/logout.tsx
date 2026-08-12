import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DELETE_NOTES = [
  'Số điện thoại được giải phóng, có thể đăng ký lại tài khoản mới.',
  'Bình luận của người khác dưới bài bạn cũng bị xoá theo.',
];

// on.logout — đăng xuất khỏi máy này, hoặc xoá tài khoản vĩnh viễn (30 ngày khôi phục được).
export default function LogoutScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Đăng xuất & xoá tài khoản</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        <Pressable
          onPress={() => router.replace('/(auth)/welcome')}
          className="h-[52px] rounded-2xl border border-border bg-white items-center justify-center"
        >
          <Text className="font-sans-semibold text-[15px] text-ink">Đăng xuất khỏi máy này</Text>
        </Pressable>
        <Text className="mt-2 text-xs text-muted">Bài đăng và điểm uy tín vẫn giữ nguyên.</Text>

        <View className="mt-6.5 rounded-2xl border-[1.5px] border-danger-200 bg-white overflow-hidden">
          <View className="h-1 bg-danger" />
          <View className="p-4">
            <Text className="text-[15.5px] font-sans-bold text-ink">Xoá tài khoản vĩnh viễn</Text>
            <Text className="mt-2 text-xs leading-[19px] text-muted">
              Sau 30 ngày, toàn bộ bài đăng, bình luận, điểm uy tín và số điện thoại của bạn bị xoá khỏi hệ thống.
              Trong 30 ngày đó, đăng nhập lại là khôi phục được.
            </Text>
            <View className="mt-3 gap-1.5">
              {DELETE_NOTES.map((n) => (
                <View key={n} className="flex-row gap-2.5">
                  <View className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5" />
                  <Text className="flex-1 text-xs leading-[19px] text-muted">{n}</Text>
                </View>
              ))}
            </View>
            <Pressable className="mt-3.5 h-12 rounded-[13px] bg-danger items-center justify-center">
              <Text className="font-sans-semibold text-[14.5px] text-white">Tôi muốn xoá tài khoản</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
