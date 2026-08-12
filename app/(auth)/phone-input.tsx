import { router } from 'expo-router';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { extractErrorMessage, sendOtp } from '../../src/api/client';
import { GradientButton } from '../../src/components/ui/Button';
import { Keypad } from '../../src/components/ui/Keypad';

// on.phone — xác thực bằng số điện thoại, không cần email/tên thật (mục 2 tài liệu FE). Ô "+84"
// tách riêng nên digits ở đây LUÔN là 9 số sau mã quốc gia (không có số 0 đầu) — khớp đúng cách
// libphonenumber-js chuẩn hoá lại 1 lần nữa ở backend (send-otp DTO).
export default function PhoneInputScreen() {
  const [digits, setDigits] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onKey = (key: string) => {
    setError(null);
    if (key === '⌫') setDigits((d) => d.slice(0, -1));
    else if (digits.length < 9) setDigits((d) => d + key);
  };

  const isValid = digits.length === 9 && parsePhoneNumberFromString(`+84${digits}`)?.isValid() === true;
  // Báo lỗi ngay khi gõ đủ 9 số mà sai định dạng, không đợi bấm nút — và không khoá nút/bàn phím,
  // để user luôn sửa/bấm lại được thay vì bị chặn không rõ lý do.
  const formatError = digits.length === 9 && !isValid ? 'Số điện thoại không hợp lệ, kiểm tra lại' : null;
  const displayError = error ?? formatError;

  const onSubmit = async () => {
    if (loading) return;
    if (!isValid) {
      setError('Số điện thoại không hợp lệ, kiểm tra lại');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { retryAfter } = await sendOtp(`+84${digits}`);
      router.push({
        pathname: '/(auth)/otp-verify',
        params: { phone: `+84${digits}`, retryAfter: String(retryAfter) },
      });
    } catch (err) {
      setError(await extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 px-6 pt-2">
        <Pressable onPress={() => router.back()} className="w-[38px] h-[38px] justify-center">
          <Text className="text-[22px] text-ink">‹</Text>
        </Pressable>

        <Text className="mt-4 text-[26px] font-sans-bold tracking-tight text-ink">Số điện thoại của bạn</Text>
        <Text className="mt-2 text-sm leading-[22px] text-muted">
          Không cần email, không cần tên thật. Một số điện thoại chỉ tạo được một tài khoản.
        </Text>

        <View className="mt-6 flex-row gap-2">
          <View className="w-[76px] h-14 rounded-[13px] bg-white border border-border items-center justify-center">
            <Text className="font-sans-semibold text-base text-ink">+84</Text>
          </View>
          <View
            className={`flex-1 h-14 rounded-[13px] bg-white border-[1.5px] flex-row items-center px-4 ${displayError ? 'border-danger' : 'border-primary'}`}
          >
            <Text className="font-sans-semibold text-lg text-ink tracking-wide">
              {digits.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' '))}
            </Text>
          </View>
        </View>

        {displayError ? <Text className="mt-2 text-xs text-danger">{displayError}</Text> : null}

        <View className="mt-3.5 flex-row gap-2 rounded-[13px] bg-white border border-border p-3.5">
          <View className="w-2 h-2 rounded-full bg-primary mt-1.5" />
          <Text className="flex-1 text-xs leading-[19px] text-muted">
            Số của bạn không hiển thị công khai. Hàng xóm chỉ thấy tên bạn tự đặt.
          </Text>
        </View>

        <View className="mt-7">
          <Keypad onPress={onKey} />
        </View>

        <View className="flex-1" />
        <View className="pb-6">
          {loading ? (
            <View className="h-[54px] items-center justify-center">
              <ActivityIndicator />
            </View>
          ) : (
            <GradientButton label="Gửi mã xác thực" onPress={onSubmit} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
