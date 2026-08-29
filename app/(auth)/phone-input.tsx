import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { extractErrorMessage, sendOtp } from '../../src/api/client';
import { colors } from '../../src/constants/design-tokens';
import { AuthDecorativeBlobs } from '../../src/components/ui/AuthDecorativeBlobs';
import { GlowInputCard } from '../../src/components/ui/GlowInputCard';
import { GradientText } from '../../src/components/ui/GradientText';
import { Keypad } from '../../src/components/ui/Keypad';

// on.phone — xác thực bằng số điện thoại, không cần email/tên thật (mục 2 tài liệu FE). Ô "+84"
// tách riêng nên digits ở đây LUÔN là 9 số sau mã quốc gia (không có số 0 đầu) — khớp đúng cách
// libphonenumber-js chuẩn hoá lại 1 lần nữa ở backend (send-otp DTO).
// Giao diện làm lại theo mockup 2026-08-24 (tông hồng-cam, khớp rebrand design-tokens.ts) — riêng
// nhãn "Mã hoá đầu cuối eKYC" trong mockup gốc SAI với thực tế app (eKYC chỉ áp dụng cho liên kết
// ngân hàng — mục 53, không liên quan luồng OTP này) nên đổi sang mô tả đúng hành vi thật.
export default function PhoneInputScreen() {
  const [digits, setDigits] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dotPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotPulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(dotPulse, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
  }, [dotPulse]);

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

  let cardState: 'default' | 'error' | 'success' = 'default';
  if (displayError) cardState = 'error';
  else if (isValid) cardState = 'success';

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

  const formattedDigits = digits.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' '));

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
                <Text className="text-[11px] font-sans-bold uppercase tracking-wider text-primary">Bước 1/2</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        <View className="mt-6 self-start flex-row items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10">
          <Ionicons name="shield-checkmark" size={14} color={colors.primary.DEFAULT} />
          <Text className="text-xs font-sans-bold text-primary">Bảo mật & Riêng tư</Text>
        </View>

        {/* MaskedView (gradient text thật) là View, không lồng được vào trong <Text> như chữ
            thường — tách "Nhập số " (Text đặc) và "điện thoại" (GradientText) thành 2 phần đặt
            cạnh nhau trên 1 hàng flex-row, thay vì 1 khối Text duy nhất như bản màu đặc cũ. */}
        <View className="mt-3 flex-row flex-wrap items-baseline">
          <Text className="text-[28px] leading-[32px] font-sans-black tracking-tight text-ink">Nhập số </Text>
          <GradientText
            colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
            className="text-[28px] leading-[32px] font-sans-black tracking-tight"
          >
            điện thoại
          </GradientText>
        </View>
        <Text className="mt-2 text-sm leading-[22px] font-sans-medium text-muted">
          Mã OTP sẽ gửi về số này để xác thực vị trí dân cư. Số của bạn luôn được ẩn danh với hàng xóm.
        </Text>

        <View className="mt-8">
          <GlowInputCard state={cardState}>
            <View className="flex-row items-center gap-2 bg-cream-surface/70 py-2.5 px-3 rounded-xl border border-border/70 shrink-0">
              <Text className="text-base">🇻🇳</Text>
              <Text className="font-mono-bold text-sm text-ink">+84</Text>
            </View>
            <View className="h-7 w-[1px] bg-border/80 mx-3" />
            <View className="flex-1 flex-row items-center gap-1.5">
              <Text className="font-sans-black text-[20px] tracking-widest text-ink" numberOfLines={1}>
                {formattedDigits}
              </Text>
              {!loading && digits.length < 9 ? (
                <Animated.View style={{ opacity: dotPulse.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) }}>
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
            <Ionicons name="lock-closed" size={13} color={colors.primary.DEFAULT} />
            <Text className="text-xs text-muted font-sans-medium">Số được mã hoá, ẩn danh với hàng xóm</Text>
          </View>
          <Text className="text-xs font-sans-semibold text-primary">Đã nhập {digits.length}/9 số</Text>
        </View>

        {/* mockup: khoảng trống co giãn nằm TRƯỚC nhóm "bàn phím + nút gửi" (đẩy cả nhóm xuống
            đáy), không phải nằm GIỮA 2 thứ đó — bản trước đặt sai chỗ, tạo khoảng trắng lớn giữa
            bàn phím và nút gửi thay vì 2 thứ nằm sát nhau như mockup. */}
        <View className="flex-1" />

        <View className="mt-7">
          <Keypad onPress={onKey} />
        </View>

        <View className="pt-6 pb-6">
          {/* Giữ nguyên khung nút (gradient/bo góc/shadow) khi loading — trước đó thay hẳn bằng
              1 spinner trần không nền, nhìn giật cục vì cả nút biến mất. Chỉ đổi NỘI DUNG bên
              trong (chữ+icon → spinner trắng), disable onPress qua chính onSubmit (đã có sẵn
              guard `if (loading) return`). */}
          <Pressable onPress={onSubmit} disabled={loading} className="active:scale-[0.98]">
            <LinearGradient
              colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: 54,
                borderRadius: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.25)',
                shadowColor: colors.primary.DEFAULT,
                shadowOpacity: 0.35,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 8 },
                elevation: 6,
                opacity: loading ? 0.85 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text className="font-sans-bold text-base text-white tracking-wide">Gửi mã xác thực</Text>
                  <Ionicons name="paper-plane" size={16} color="#fff" />
                </>
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
