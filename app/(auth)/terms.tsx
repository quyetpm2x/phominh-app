import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { extractErrorMessage } from '../../src/api/client';
import { GradientButton } from '../../src/components/ui/Button';
import { useAcceptTerms } from '../../src/hooks/useAccountLifecycle';
import { termsBlocks } from '../../src/mocks/phoMinh';

// on.acceptTerms — bắt buộc tick đồng ý mới qua được onboarding (mục 67, lưu vết theo NĐ 13/2023).
// Đặt SAU otp-verify (cần userId để gắn bản ghi TermsAcceptance) — trước permissions.
export default function TermsScreen() {
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const acceptTerms = useAcceptTerms();

  const onContinue = async () => {
    if (!agreed || acceptTerms.isPending) return;
    setError(null);
    try {
      await acceptTerms.mutateAsync();
      router.push('/(auth)/permissions');
    } catch (err) {
      setError(await extractErrorMessage(err));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 px-6 pt-3.5">
        <Text className="text-[26px] font-sans-bold tracking-tight text-ink">Điều khoản sử dụng</Text>
        <Text className="mt-2 text-sm leading-[22px] text-muted">
          Đọc và đồng ý trước khi dùng Phố Mình. Cập nhật 01/2026.
        </Text>

        <ScrollView className="mt-4 flex-1 rounded-2xl border border-border bg-white" contentContainerClassName="p-4 gap-4">
          {termsBlocks.map((b) => (
            <View key={b.title}>
              <Text className="font-sans-bold text-sm text-ink">{b.title}</Text>
              <Text className="mt-1.5 text-[13.5px] leading-[21px] text-muted">{b.body}</Text>
            </View>
          ))}
        </ScrollView>

        <Pressable onPress={() => setAgreed((a) => !a)} className="mt-4 flex-row items-center gap-2.5">
          <View
            className={`w-5 h-5 rounded-[6px] border-2 items-center justify-center ${
              agreed ? 'border-primary bg-primary' : 'border-border bg-white'
            }`}
          >
            {agreed ? <Text className="text-white text-xs">✓</Text> : null}
          </View>
          <Text className="flex-1 text-[13.5px] text-ink">Tôi đã đọc và đồng ý với Điều khoản sử dụng</Text>
        </Pressable>

        {error ? <Text className="mt-2 text-xs text-danger">{error}</Text> : null}

        <View className="pb-6 pt-4">
          <GradientButton label="Tiếp tục" onPress={() => void onContinue()} disabled={!agreed || acceptTerms.isPending} />
        </View>
      </View>
    </SafeAreaView>
  );
}
