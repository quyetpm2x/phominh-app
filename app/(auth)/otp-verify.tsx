import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';
import { useEffect, useState } from 'react';
import { Alert, AppState, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthDecorativeBlobs } from '../../src/components/ui/AuthDecorativeBlobs';
import { CustomIcon } from '../../src/components/ui/CustomIcon';
import { GradientPrimaryButton } from '../../src/components/ui/GradientPrimaryButton';
import { GradientText } from '../../src/components/ui/GradientText';
import { Keypad } from '../../src/components/ui/Keypad';
import { OTP_LENGTH, OtpCodeInput } from '../../src/components/ui/OtpCodeInput';
import { colors } from '../../src/constants/design-tokens';

const RESEND_SECONDS = 45;
export default function OtpVerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const phoneNumber = typeof phone === 'string' ? phone : '';
  const formattedPhone = parsePhoneNumberFromString(phoneNumber)?.formatInternational() ?? phoneNumber;
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resendAt] = useState(() => Date.now() + RESEND_SECONDS * 1000);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  useEffect(() => {
    const update = () => setSecondsLeft(Math.max(0, Math.ceil((resendAt - Date.now()) / 1000)));
    const interval = setInterval(update, 1000);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') update();
    });
    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [resendAt]);
  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(auth)/phone-input');
  };
  const onChangeCode = (value: string) => {
    setCode(value);
    setError(null);
  };
  const onKey = (key: string) => {
    setError(null);
    setCode((current) =>
      key === '⌫' ? current.slice(0, -1) : /^\d$/.test(key) ? (current + key).slice(0, OTP_LENGTH) : current,
    );
  };
  const onConfirm = () => {
    if (!phoneNumber) {
      setError('Vui lòng quay lại và nhập số điện thoại.');
      return;
    }
    if (code.length !== OTP_LENGTH) {
      setError('Vui lòng nhập đủ 6 số trong mã OTP.');
      return;
    }
    Alert.alert('Xác thực chưa khả dụng', 'Tính năng xác thực SMS sẽ sớm được hỗ trợ. Vui lòng thử lại sau.');
  };
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <AuthDecorativeBlobs />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Quay lại nhập số điện thoại"
            onPress={goBack}
            className="h-11 w-11 items-center justify-center rounded-2xl border border-border/80 bg-white shadow-sm active:scale-95"
          >
            <Ionicons name="arrow-back" size={20} color={colors.ink.DEFAULT} />
          </Pressable>
          <View className="overflow-hidden rounded-full border border-primary/20">
            <LinearGradient
              colors={['#FF416C1a', '#FF4B2B1a']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={styles.step}
            >
              <View className="h-1.5 w-1.5 rounded-full bg-primary" />
              <GradientText
                colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
                direction="vertical"
                className="font-sans-bold text-[11.5px] tracking-[0.575px]"
              >
                BƯỚC 2 / 2
              </GradientText>
            </LinearGradient>
          </View>
        </View>
        <View className="mt-8">
          <View className="self-start flex-row items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1">
            <CustomIcon name="otpKey" size={14} />
            <Text className="font-sans-bold text-xs text-primary">Xác minh danh tính</Text>
          </View>
          <View className="mt-3 flex-row flex-wrap items-baseline">
            <Text className="font-sans-black text-[28px] leading-[35px] tracking-[-0.7px] text-primary-darker">
              Xác nhận{' '}
            </Text>
            <GradientText
              colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
              direction="vertical"
              className="font-sans-black text-[28px] leading-[35px] tracking-[-0.7px]"
            >
              mã OTP
            </GradientText>
          </View>
          <Text className="mt-2 font-sans-medium text-[14.5px] leading-6 text-[#4A4A4A]">
            Mã gồm 6 số đã được gửi qua SMS đến
          </Text>
          <View className="mt-1 self-start rounded-md bg-cream-surface px-2 py-1">
            <Text className="font-mono-bold text-[14.5px] text-primary-darker">
              {formattedPhone || 'Số điện thoại của bạn'}
            </Text>
          </View>
          <View className="mt-7">
            <OtpCodeInput value={code} onChange={onChangeCode} error={Boolean(error)} />
          </View>
          {error ? (
            <Text accessibilityLiveRegion="polite" className="mt-3 font-sans-medium text-xs text-danger">
              {error}
            </Text>
          ) : null}
          <View className="mt-7 flex-row flex-wrap items-center justify-center gap-3">
            <Text className="font-sans-medium text-[13px] text-[#4A4A4A]">Chưa nhận được mã?</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={secondsLeft > 0 ? `Gửi lại sau ${secondsLeft} giây` : 'Gửi lại mã OTP'}
              accessibilityState={{ disabled: secondsLeft > 0 }}
              disabled={secondsLeft > 0}
              onPress={() =>
                Alert.alert(
                  'Gửi mã chưa khả dụng',
                  'Tính năng gửi SMS sẽ sớm được hỗ trợ. Vui lòng thử lại sau.',
                )
              }
              style={secondsLeft > 0 ? styles.resendDisabled : undefined}
              className="min-h-11 flex-row items-center gap-1.5 active:opacity-60"
            >
              <CustomIcon name="otpRefresh" size={12} />
              <Text className="font-sans-semibold text-xs text-primary">
                {secondsLeft > 0 ? 'Gửi lại sau' : 'Gửi lại mã'}
              </Text>
              {secondsLeft > 0 ? (
                <Text className="rounded border border-primary/30 bg-primary/10 px-1.5 py-1 font-mono text-[11px] text-primary">
                  0:{String(secondsLeft).padStart(2, '0')}s
                </Text>
              ) : null}
            </Pressable>
          </View>
        </View>
        <View style={styles.spacer} />
        <Keypad onPress={onKey} />
        <View className="pt-8 pb-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Xác nhận mã OTP"
            onPress={onConfirm}
            className="active:scale-[0.98]"
          >
            <GradientPrimaryButton>
              <Text className="font-sans-bold text-base tracking-wide text-white">Xác nhận</Text>
              <CustomIcon name="otpCheck" size={18} />
            </GradientPrimaryButton>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6 },
  spacer: { flexGrow: 1, minHeight: 40, maxHeight: 130 },
  resendDisabled: { opacity: 0.4 },
});
