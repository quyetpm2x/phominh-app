import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { extractErrorMessage } from '../../src/api/client';
import { useCreatePenaltyAppeal } from '../../src/hooks/useUserProfile';

const MIN_LENGTH = 10;

// Khiếu nại phạt oan (tai-lieu-chuc-nang.md #61) — trước đây model PenaltyAppeal orphaned hoàn
// toàn, không có endpoint lẫn màn hình nào. Vào từ trust.tsx, nhận historyId của đúng lần bị trừ
// điểm (sourceType=violation_confirmed) qua query param.
export default function PenaltyAppealScreen() {
  const { historyId, penaltyLabel } = useLocalSearchParams<{
    historyId: string;
    penaltyLabel: string;
  }>();
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const createAppeal = useCreatePenaltyAppeal();

  const onSubmit = async () => {
    if (!historyId || explanation.trim().length < MIN_LENGTH || createAppeal.isPending) return;
    setError(null);
    try {
      await createAppeal.mutateAsync({ historyId, explanation: explanation.trim() });
      router.back();
    } catch (err) {
      setError(await extractErrorMessage(err));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-sm text-ink">Khiếu nại phạt oan</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        {penaltyLabel ? (
          <View className="rounded-[13px] border border-border bg-white p-3.5">
            <Text className="text-[13px] text-ink/85">{penaltyLabel}</Text>
          </View>
        ) : null}

        <Text className="mt-3.5 text-[12.5px] text-muted">
          Giải thích lý do bạn cho rằng lần trừ điểm này không đúng. Đội ngũ quản trị sẽ xem xét và
          phản hồi.
        </Text>

        <TextInput
          value={explanation}
          onChangeText={setExplanation}
          placeholder="Nhập lý do (tối thiểu 10 ký tự)..."
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          className="mt-3 min-h-[120px] rounded-[13px] border border-border bg-white p-3.5 text-sm text-ink"
        />

        {error ? <Text className="mt-2.5 text-[12.5px] text-danger-text">{error}</Text> : null}

        <Pressable
          onPress={() => void onSubmit()}
          disabled={explanation.trim().length < MIN_LENGTH || createAppeal.isPending}
          className={`mt-4 h-[46px] rounded-[13px] bg-primary items-center justify-center ${
            explanation.trim().length < MIN_LENGTH || createAppeal.isPending ? 'opacity-40' : ''
          }`}
        >
          <Text className="font-sans-semibold text-sm text-white">Gửi khiếu nại</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
