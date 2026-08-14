import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { extractErrorMessage } from '../../src/api/client';
import { TextInput } from '../../src/components/ui/TextInput';
import { useCreateReport } from '../../src/hooks/useReports';

const REASONS = ['Thông tin sai sự thật', 'Quấy rối / xúc phạm', 'Ảnh không phải chụp tại chỗ', 'Spam / quảng cáo', 'Khác'];

// on.reportPost — báo cáo ẩn danh, người đăng không biết ai đã báo cáo.
export default function ReportPostScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const [reason, setReason] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const createReport = useCreateReport();

  const onSubmit = async () => {
    if (!reason || !postId || createReport.isPending) return;
    setError(null);
    try {
      await createReport.mutateAsync({
        targetType: 'post',
        targetId: postId,
        reason,
        description: description.trim() || undefined,
      });
      router.back();
    } catch (err) {
      setError(await extractErrorMessage(err));
    }
  };

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
        <View className="mt-3.5">
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Mô tả thêm (không bắt buộc)…"
            multiline
            style={{ minHeight: 88 }}
          />
        </View>
        {error ? <Text className="mt-2 text-xs text-danger">{error}</Text> : null}
      </ScrollView>

      <View className="px-4.5 pt-3.5 pb-6 border-t border-border">
        <Pressable
          onPress={() => void onSubmit()}
          disabled={!reason || createReport.isPending}
          className={`h-[52px] rounded-2xl items-center justify-center ${reason ? 'bg-danger' : 'bg-border'}`}
        >
          <Text className={`font-sans-semibold text-[15.5px] ${reason ? 'text-white' : 'text-muted'}`}>Gửi báo cáo</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
