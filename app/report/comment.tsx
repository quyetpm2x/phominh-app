import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const REASONS = ['Quấy rối / xúc phạm', 'Spam / quảng cáo', 'Thông tin sai sự thật', 'Khác'];

// on.reportComment — báo cáo bình luận; chủ bài có thể tự ẩn ngay không cần chờ kiểm duyệt.
export default function ReportCommentScreen() {
  const [reason, setReason] = useState<string | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Báo cáo bình luận</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        <View className="rounded-[13px] border border-border bg-white p-3.5">
          <Text className="text-[13px] text-ink/85">"Quán này bẩn lắm đừng ăn"</Text>
          <View className="mt-2 flex-row items-center gap-1.5">
            <View className="rounded-md bg-danger-50 px-1.5 py-0.5">
              <Text className="font-mono-medium text-[10.5px] text-danger-text">tài khoản 6 giờ tuổi</Text>
            </View>
            <Text className="text-[11.5px] text-muted">Chưa đủ 48 giờ để bình luận</Text>
          </View>
        </View>

        <View className="mt-3.5 gap-2.5">
          {REASONS.map((r) => (
            <Pressable
              key={r}
              onPress={() => setReason(r)}
              className={`rounded-[13px] border px-3.5 py-3 flex-row items-center gap-2.5 ${
                reason === r ? 'border-primary bg-primary-50' : 'border-border bg-white'
              }`}
            >
              <View className={`w-[18px] h-[18px] rounded-full border-2 ${reason === r ? 'border-primary bg-primary' : 'border-strong'}`} />
              <Text className="text-sm text-ink">{r}</Text>
            </Pressable>
          ))}
        </View>

        <View className="mt-3.5 rounded-[13px] border border-border bg-white px-3.5 py-3">
          <Text className="text-[12.5px] leading-[19px] text-muted">
            Nếu bạn là chủ bài đăng, bạn có thể tự ẩn bình luận này ngay mà không cần chờ kiểm duyệt.
          </Text>
        </View>
        <Pressable onPress={() => router.back()} className="mt-3 h-[46px] rounded-[13px] border border-border bg-white items-center justify-center">
          <Text className="font-sans-semibold text-sm text-ink">Ẩn bình luận trên bài của tôi</Text>
        </Pressable>
      </ScrollView>

      <View className="px-4.5 pt-3.5 pb-6 border-t border-border">
        <Pressable onPress={() => router.back()} className="h-[52px] rounded-2xl bg-danger items-center justify-center">
          <Text className="font-sans-semibold text-[15.5px] text-white">Gửi báo cáo</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
