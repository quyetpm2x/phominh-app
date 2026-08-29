import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { extractErrorMessage } from '../../src/api/client';
import { colors } from '../../src/constants/design-tokens';
import { GradientSubmitButton } from '../../src/components/ui/GradientSubmitButton';
import { useAcceptTerms } from '../../src/hooks/useAccountLifecycle';
import { termsBlocks } from '../../src/mocks/phoMinh';

// on.acceptTerms — bắt buộc tick đồng ý mới qua được onboarding (mục 67, lưu vết theo NĐ 13/2023).
// Đặt SAU otp-verify (cần userId để gắn bản ghi TermsAcceptance) — trước permissions.
// Giao diện + NỘI DUNG làm lại theo mockup 2026-08-25 (đổi hẳn nội dung 3→4 mục, theo lựa chọn rõ
// ràng của người dùng — mockup gốc nhắc nhầm tên sản phẩm "Bản Tin Bán Kính", đã sửa đúng "Phố
// Mình"). Số phiên bản đọc THẬT từ app.json qua expo-constants (Constants.expoConfig.version) thay
// vì hardcode "2.4.0" như mockup — con số đó không khớp version thật của app (đang là 1.0.0).
export default function TermsScreen() {
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const acceptTerms = useAcceptTerms();
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

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
      <View className="flex-row items-center gap-3 border-b border-border/60 px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-xl bg-cream-surface active:scale-95"
        >
          <Ionicons name="arrow-back" size={18} color={colors.ink.DEFAULT} />
        </Pressable>
        <Text className="font-sans-black text-[17px] text-ink">Điều khoản sử dụng</Text>
      </View>

      <ScrollView contentContainerClassName="gap-4 px-4 py-4">
        <View className="gap-2 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <Ionicons name="document-text" size={14} color="#fff" />
              </View>
              <Text className="text-xs font-sans-bold text-primary">Quy định cộng đồng & Dịch vụ</Text>
            </View>
            <Text className="text-[11px] font-sans-medium text-muted">Phiên bản {appVersion}</Text>
          </View>
          <Text className="text-xs leading-[19.5px] text-muted">
            Khi đăng ký và sử dụng Phố Mình, bạn đồng ý tuân thủ các quy tắc hoạt động nhằm xây dựng cộng đồng khu
            phố an toàn, văn minh và tin cậy.
          </Text>
        </View>

        <View className="gap-3">
          {termsBlocks.map((b) => (
            <View key={b.title} className="gap-2 rounded-2xl border border-border bg-white p-4 shadow-sm">
              <View className="flex-row items-center gap-2.5">
                <View className="h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                  <Ionicons name={b.icon} size={16} color={colors.primary.DEFAULT} />
                </View>
                <Text className="flex-1 font-sans-bold text-[13.5px] text-ink">{b.title}</Text>
              </View>
              <Text className="text-xs leading-[19.5px] text-muted">{b.body}</Text>
            </View>
          ))}
        </View>

        <View className="gap-2 rounded-2xl border border-border bg-white p-4 shadow-sm">
          <View className="flex-row items-center gap-2">
            <Ionicons name="people" size={16} color={colors.primary.DEFAULT} />
            <Text className="font-sans-bold text-[13px] text-ink">Cam kết xây dựng khu phố số</Text>
          </View>
          <Text className="text-[11.5px] leading-[18.7px] text-muted">
            Cùng chung tay tạo nên một không gian tin tức xóm phố chuẩn xác, kịp thời và gắn kết tình làng nghĩa
            xóm.
          </Text>
        </View>
      </ScrollView>

      <View className="gap-3 border-t border-border/60 px-4 pb-6 pt-3">
        <Pressable
          onPress={() => setAgreed((a) => !a)}
          className="flex-row items-start gap-2.5 rounded-xl border border-border bg-white p-3"
        >
          <View
            className={`mt-0.5 h-4 w-4 items-center justify-center rounded border ${
              agreed ? 'border-primary bg-primary' : 'border-border bg-white'
            }`}
          >
            {agreed ? <Ionicons name="checkmark" size={11} color="#fff" /> : null}
          </View>
          <Text className="flex-1 text-xs font-sans-medium leading-[15px] text-ink">
            Tôi đã đọc, hiểu rõ và đồng ý với <Text className="font-sans-bold text-primary">Điều khoản sử dụng</Text>
          </Text>
        </Pressable>

        {error ? <Text className="text-xs text-danger">{error}</Text> : null}

        <GradientSubmitButton
          label="Tiếp tục"
          disabled={!agreed}
          loading={acceptTerms.isPending}
          onPress={() => void onContinue()}
        />
      </View>
    </SafeAreaView>
  );
}
