import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const REASONS = ['Thông tin sai sự thật', 'Quấy rối / xúc phạm', 'Ảnh không phải chụp tại chỗ', 'Spam / quảng cáo', 'Khác'];

// on.reportPost — báo cáo ẩn danh, người đăng không biết ai đã báo cáo.
export default function ReportPostScreen() {
  const [reason, setReason] = useState<string | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Báo cáo bài đăng</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        <Text className="text-[13px] leading-[20px] text-muted">
          Báo cáo được gửi ẩn danh vào hàng đợi kiểm duyệt. Người đăng không biết ai đã báo cáo.
        </Text>
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
        <View className="mt-3.5 rounded-[13px] border border-border bg-white p-3.5 min-h-[88px]">
          <Text className="text-[13.5px] text-muted-light">Mô tả thêm (không bắt buộc)…</Text>
        </View>
      </ScrollView>

      <View className="px-4.5 pt-3.5 pb-6 border-t border-border">
        <Pressable onPress={() => router.back()} className="h-[52px] rounded-2xl bg-danger items-center justify-center">
          <Text className="font-sans-semibold text-[15.5px] text-white">Gửi báo cáo</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
