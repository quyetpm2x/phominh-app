import { router, useLocalSearchParams } from 'expo-router';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { extractErrorMessage, sendOtp, verifyOtp } from '../../src/api/client';
import { GradientButton } from '../../src/components/ui/Button';
import { Keypad } from '../../src/components/ui/Keypad';

// isOtp — nhập mã 6 số vừa gửi. phone/retryAfter nhận từ phone-input.tsx qua router params (SĐT
// đã chuẩn hoá E.164, retryAfter tính bằng giây do backend trả về — không đếm ngược 1 số cố định).
export default function OtpVerifyScreen() {
  const { phone, retryAfter } = useLocalSearchParams<{ phone: string; retryAfter: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(Number(retryAfter ?? 60));

  // 1 interval sống suốt vòng đời màn hình, tự dừng giảm khi đã về 0 — tránh phải liệt kê
  // secondsLeft vào dependency array (sẽ phải tạo/huỷ lại interval mỗi giây nếu làm vậy).
  useEffect(() => {
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const displayPhone = phone ? (parsePhoneNumberFromString(phone)?.formatNational() ?? phone) : '';

  let resendLabel: string;
  if (resending) {
    resendLabel = 'Đang gửi lại...';
  } else if (secondsLeft > 0) {
    resendLabel = `Gửi lại mã sau 0:${String(secondsLeft).padStart(2, '0')}`;
  } else {
    resendLabel = 'Gửi lại mã';
  }

  const onKey = (key: string) => {
    setError(null);
    if (key === '⌫') setCode((c) => c.slice(0, -1));
    else if (code.length < 6) setCode((c) => c + key);
  };

  const onSubmit = async () => {
    if (loading || !phone) return;
    if (code.length !== 6) {
      setError('Nhập đủ 6 số của mã xác thực');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await verifyOtp(phone, code);
      router.push('/(auth)/permissions');
    } catch (err) {
      setError(await extractErrorMessage(err));
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (secondsLeft > 0 || resending || !phone) return;
    setError(null);
    setResending(true);
    try {
      const res = await sendOtp(phone);
      setSecondsLeft(res.retryAfter);
      setCode('');
    } catch (err) {
      setError(await extractErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  // Vào thẳng màn này (deep link, back/forward lạ) mà thiếu phone — không có gì để verify, không
  // hiện UI rỗng khó hiểu, đưa thẳng về màn nhập SĐT.
  if (!phone) {
    return (
      <SafeAreaView className="flex-1 bg-cream">
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Text className="text-center text-sm text-muted">Thiếu số điện thoại để xác thực.</Text>
          <GradientButton label="Quay lại nhập số điện thoại" onPress={() => router.replace('/(auth)/phone-input')} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 px-6 pt-2">
        <Pressable onPress={() => router.back()} className="w-[38px] h-[38px] justify-center">
          <Text className="text-[22px] text-ink">‹</Text>
        </Pressable>

        <Text className="mt-4 text-[26px] font-sans-bold tracking-tight text-ink">Nhập mã xác thực</Text>
        <Text className="mt-2 text-sm leading-[22px] text-muted">
          Mã 6 số vừa gửi tới <Text className="font-sans-bold text-ink">{displayPhone}</Text>. Một số điện thoại
          chỉ tạo được một tài khoản.
        </Text>

        <View className="mt-7 flex-row gap-2.5">
          {Array.from({ length: 6 }).map((_, i) => {
            let boxStyle: string;
            if (error) {
              boxStyle = 'border-danger bg-danger-50';
            } else if (i < code.length) {
              boxStyle = 'border-primary bg-primary-50';
            } else {
              boxStyle = 'border-border bg-white';
            }
            return (
              <View key={i} className={`flex-1 h-14 rounded-[13px] items-center justify-center border ${boxStyle}`}>
                <Text className="font-mono-medium text-lg text-ink">{code[i] ?? ''}</Text>
              </View>
            );
          })}
        </View>

        {error ? <Text className="mt-2 text-xs text-danger">{error}</Text> : null}

        <View className="mt-5">
          <Keypad onPress={onKey} />
        </View>

        <View className="flex-1" />
        <Pressable onPress={onResend} disabled={secondsLeft > 0 || resending} className="mb-3.5">
          <Text className="text-center text-xs text-muted">{resendLabel}</Text>
        </Pressable>
        <View className="pb-6">
          {loading ? (
            <View className="h-[54px] items-center justify-center">
              <ActivityIndicator />
            </View>
          ) : (
            <GradientButton label="Xác nhận" onPress={onSubmit} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
