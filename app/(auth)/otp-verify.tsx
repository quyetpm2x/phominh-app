import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { extractErrorMessage, sendOtp, verifyOtp } from '../../src/api/client';
import { colors } from '../../src/constants/design-tokens';
import { OtpDigitBox } from '../../src/components/OtpDigitBox';
import { AuthDecorativeBlobs } from '../../src/components/ui/AuthDecorativeBlobs';
import { GradientButton } from '../../src/components/ui/Button';
import { GradientSubmitButton } from '../../src/components/ui/GradientSubmitButton';
import { GradientText } from '../../src/components/ui/GradientText';
import { Keypad } from '../../src/components/ui/Keypad';

// isOtp — nhập mã 6 số vừa gửi. phone/retryAfter nhận từ phone-input.tsx qua router params (SĐT
// đã chuẩn hoá E.164, retryAfter tính bằng giây do backend trả về — không đếm ngược 1 số cố định).
// Giao diện làm lại theo mockup 2026-08-25 (ô mã dạng viền gradient + cursor nhấp nháy, khớp
// phone-input.tsx cùng luồng). Mockup không có dòng "Một số điện thoại chỉ tạo được một tài khoản"
// (bản cũ có) — bỏ theo đúng mockup, đây chỉ là câu nhắc phụ không phải rule bắt buộc hiện UI.
export default function OtpVerifyScreen() {
  const { phone, retryAfter } = useLocalSearchParams<{ phone: string; retryAfter: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(Number(retryAfter ?? 60));
  const dotPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  // 1 vòng loop animation dùng chung cho cả dot ở step-badge lẫn cursor nhấp nháy ở ô mã đang gõ.
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotPulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(dotPulse, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
  }, [dotPulse]);

  const displayPhone = phone ? (parsePhoneNumberFromString(phone)?.formatNational() ?? phone) : '';

  const onKey = (key: string) => {
    setError(null);
    if (key === '⌫') setCode((c) => c.slice(0, -1));
    else if (code.length < 6) setCode((c) => c + key);
  };

  const onSubmit = async () => {
    if (loading || !phone || code.length !== 6) return;
    setError(null);
    setLoading(true);
    try {
      const { restored } = await verifyOtp(phone, code);
      if (restored) {
        // Đã bấm xoá tài khoản trước đó, đăng nhập lại trong 30 ngày => khôi phục (mục 69/73).
        Alert.alert('Tài khoản đã được khôi phục', 'Yêu cầu xoá tài khoản trước đó đã được huỷ.');
      }
      router.push('/(auth)/terms');
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
      <AuthDecorativeBlobs success={false} />

      <View className="flex-1 px-6 pt-2">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="w-11 h-11 items-center justify-center rounded-2xl bg-white border border-border/80 shadow-sm active:scale-95"
          >
            <Ionicons name="arrow-back" size={18} color={colors.ink.DEFAULT} />
          </Pressable>
          <View className="rounded-full overflow-hidden border border-primary/20">
            <LinearGradient colors={['#FF416C1a', '#FF4B2B1a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <View className="flex-row items-center gap-1.5 px-3 py-1.5">
                <Animated.View
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                  style={{ opacity: dotPulse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }}
                />
                <Text className="text-[11px] font-sans-bold uppercase tracking-wider text-primary">Bước 2/2</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        <View className="mt-6 self-start flex-row items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10">
          <Ionicons name="key" size={14} color={colors.primary.DEFAULT} />
          <Text className="text-xs font-sans-bold text-primary">Xác minh danh tính</Text>
        </View>

        <View className="mt-3 flex-row flex-wrap items-baseline">
          <Text className="text-[28px] leading-[32px] font-sans-black tracking-tight text-ink">Xác nhận </Text>
          <GradientText
            colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
            className="text-[28px] leading-[32px] font-sans-black tracking-tight"
          >
            mã OTP
          </GradientText>
        </View>
        <Text className="mt-2 text-sm leading-[22px] font-sans-medium text-muted">
          Mã gồm 6 số đã được gửi qua SMS đến{' '}
          <Text className="font-mono-bold text-accent">{displayPhone}</Text>
        </Text>

        <View className="mt-7 w-full flex-row justify-between gap-2.5">
          {Array.from({ length: 6 }).map((_, i) => {
            let state: 'filled' | 'cursor' | 'empty' = 'empty';
            if (i < code.length) state = 'filled';
            else if (i === code.length) state = 'cursor';
            return <OtpDigitBox key={i} digit={code[i] ?? ''} state={state} pulse={dotPulse} />;
          })}
        </View>

        {error ? <Text className="mt-3 text-center text-xs text-danger">{error}</Text> : null}

        <View className="mt-6 flex-row items-center justify-center gap-2">
          <Text className="text-[13px] font-sans-medium text-muted">Chưa nhận được mã?</Text>
          <Pressable
            onPress={() => void onResend()}
            disabled={secondsLeft > 0 || resending}
            className="flex-row items-center gap-1.5 rounded-xl px-2.5 py-1 active:scale-95"
          >
            <Ionicons name="refresh" size={13} color={colors.primary.DEFAULT} />
            {resending ? (
              <Text className="text-xs font-sans-bold text-primary">Đang gửi lại...</Text>
            ) : secondsLeft > 0 ? (
              <View className="flex-row items-center gap-1.5">
                <Text className="text-xs font-sans-semibold text-muted">Gửi lại sau</Text>
                <Text className="rounded-md border border-primary/30 bg-primary/15 px-1.5 py-0.5 font-mono-bold text-xs text-primary">
                  0:{String(secondsLeft).padStart(2, '0')}s
                </Text>
              </View>
            ) : (
              <GradientText colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]} className="text-xs font-sans-bold">
                Gửi lại mã
              </GradientText>
            )}
          </Pressable>
        </View>

        <View className="flex-1" />

        <View className="mt-7">
          <Keypad onPress={onKey} />
        </View>

        <View className="pt-6 pb-6">
          <GradientSubmitButton
            label="Xác nhận"
            icon="checkmark"
            disabled={code.length !== 6}
            loading={loading}
            onPress={() => void onSubmit()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
