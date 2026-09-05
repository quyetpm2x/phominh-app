import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js/max';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CustomIcon } from '@/src/components/ui/CustomIcon';
import { GradientPrimaryButton } from '@/src/components/ui/GradientPrimaryButton';
import { AuthDecorativeBlobs } from '../../src/components/ui/AuthDecorativeBlobs';
import { CountryCallingCodePicker } from '../../src/components/ui/CountryCallingCodePicker';
import { GlowInputCard } from '../../src/components/ui/GlowInputCard';
import { GradientText } from '../../src/components/ui/GradientText';
import { Keypad } from '../../src/components/ui/Keypad';
import { colors } from '../../src/constants/design-tokens';
import { PHONE_COUNTRIES, type PhoneCountry } from '../../src/constants/phone-countries';

export default function PhoneInputScreen() {
  const [country, setCountry] = useState<PhoneCountry>(PHONE_COUNTRIES[0]);
  const [digits, setDigits] = useState('');
  const [error, setError] = useState<string | null>(null);
  const dotPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotPulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(dotPulse, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [dotPulse]);

  const onKey = (key: string) => {
    setError(null);
    if (key === '⌫') setDigits((d) => d.slice(0, -1));
    else if (digits.length < country.maxLength) setDigits((d) => d + key);
  };

  const parsedPhoneNumber = digits ? parsePhoneNumberFromString(digits, country.iso2) : undefined;
  const isValid =
    digits.length >= country.minLength &&
    digits.length <= country.maxLength &&
    parsedPhoneNumber?.isValid() === true;
  // Báo lỗi ngay khi gõ đủ 9 số mà sai định dạng, không đợi bấm nút — và không khoá nút/bàn phím,
  // để user luôn sửa/bấm lại được thay vì bị chặn không rõ lý do.
  const formatError =
    digits.length === country.maxLength && !isValid ? 'Số điện thoại không hợp lệ, kiểm tra lại' : null;
  const displayError = error ?? formatError;

  let cardState: 'default' | 'error' | 'success' = 'default';
  if (displayError) cardState = 'error';
  else if (isValid) cardState = 'success';

  // Gửi OTP thật (sendOtp) sẽ nối lại khi làm tiếp luồng đăng ký — hiện tạm validate định dạng rồi
  // điều hướng sang màn OTP placeholder để giữ trọn luồng onboarding.
  const onSubmit = () => {
    if (!isValid || !parsedPhoneNumber) {
      setError('Số điện thoại không hợp lệ, kiểm tra lại');
      return;
    }
    setError(null);
    router.push({ pathname: '/(auth)/otp-verify', params: { phone: parsedPhoneNumber.number } });
  };

  const formattedDigits = digits ? new AsYouType(country.iso2).input(digits) : '';

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <AuthDecorativeBlobs success={cardState === 'success'} />

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
                <Text className="text-[11px] font-sans-bold uppercase tracking-wider text-primary">
                  Bước 1/2
                </Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        <View className="mt-6 self-start flex-row items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10">
          <CustomIcon name="shieldCheckmark" size={10} color={colors.primary.DEFAULT} />
          <Text className="text-xs font-sans-bold text-primary">Bảo mật & Riêng tư</Text>
        </View>

        <View className="mt-3 flex-row flex-wrap items-baseline">
          <Text className="text-[28px] leading-[32px] font-sans-black tracking-tight text-ink">Nhập số </Text>
          <GradientText
            colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
            className="text-[28px] leading-[32px] font-sans-black tracking-tight"
          >
            điện thoại
          </GradientText>
        </View>
        <Text className="mt-2 text-sm leading-[22px] font-sans-medium text-[#4A4A4A]">
          Mã OTP sẽ gửi về số này để xác thực vị trí dân cư. Số của bạn luôn được ẩn danh với hàng xóm.
        </Text>

        <View className="mt-8">
          <GlowInputCard state={cardState}>
            <CountryCallingCodePicker
              value={country}
              options={PHONE_COUNTRIES}
              onChange={(nextCountry) => {
                setCountry(nextCountry);
                setError(null);
                setDigits((current) => current.slice(0, nextCountry.maxLength));
              }}
            />
            <View className="h-7 w-[1px] bg-border/80 mx-3" />
            <View className="flex-1 flex-row items-center gap-1.5">
              <Text className="font-sans-black text-[20px] tracking-widest text-ink" numberOfLines={1}>
                {formattedDigits}
              </Text>
              {digits.length < 9 ? (
                <Animated.View
                  style={{ opacity: dotPulse.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) }}
                >
                  <LinearGradient
                    colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
                    style={{ width: 2, height: 20, borderRadius: 1 }}
                  />
                </Animated.View>
              ) : null}
            </View>
            {digits.length > 0 ? (
              <Pressable
                onPress={() => {
                  setDigits('');
                  setError(null);
                }}
                className="w-8 h-8 items-center justify-center rounded-xl bg-cream-surface/50 active:scale-90"
              >
                <Ionicons name="close-circle" size={18} color={colors.muted.DEFAULT} />
              </Pressable>
            ) : null}
          </GlowInputCard>
        </View>

        {displayError ? <Text className="mt-2 text-xs text-danger">{displayError}</Text> : null}
        <View className="mt-3.5 flex-row items-center justify-between px-1">
          <View className="flex-row items-center gap-1.5">
            <CustomIcon name="lockIcon" size={10} color={colors.primary.DEFAULT} />
            <Text className="text-xs text-[#4A4A4A] font-sans-medium">Mã hoá đầu cuối eKYC</Text>
          </View>
          <Text className="text-xs font-sans-semibold text-primary">
            Đã nhập {digits.length}/{country.maxLength} số
          </Text>
        </View>

        <View className="flex-1" />

        <View className="mt-7">
          <Keypad onPress={onKey} />
        </View>

        <View className="pt-6 pb-6">
          <Pressable onPress={onSubmit} className="active:scale-[0.98]">
            <GradientPrimaryButton>
              <Text className="font-sans-bold text-base text-white tracking-wide">Gửi mã xác thực</Text>
              <CustomIcon name="planeIcon" size={18} />
            </GradientPrimaryButton>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
