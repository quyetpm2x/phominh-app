import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { brand } from '../constants/brand';
import { colors } from '../constants/design-tokens';
import { SplashDecorativeBlobs } from './SplashDecorativeBlobs';
import { RINGS, SplashRings } from './SplashRings';

// Đọc thẳng từ design-tokens.ts (rebrand 2026-08-24 áp dụng TOÀN APP, không riêng gì Splash —
// đã xác nhận lại, xoá bỏ file onboardingAccent.ts tách riêng gây hiểu lầm trước đó).
const SPLASH_BG = colors.cream.DEFAULT;
const SPLASH_PINK = colors.primary.DEFAULT;
const SPLASH_ORANGE = colors.accent.DEFAULT;
const SPLASH_PEACH = colors.primary.peach;
const SPLASH_INK = colors.ink.DEFAULT;
const SPLASH_MUTED = colors.muted.DEFAULT;
const SPLASH_BORDER = colors.border.DEFAULT;

const BADGE_SIZE = 112;

interface SplashProps {
  onDone: () => void;
}

// sp.core — làm lại theo mockup 2026-08-24 (tông hồng-cam, badge building-icon, vòng tròn đồng tâm
// nhiều lớp). Không có thư viện gradient-text (@react-native-masked-view chưa cài, không thêm
// dependency native mới giữa phiên vì cần rebuild dev client) nên tiêu đề dùng màu đặc SPLASH_PINK
// thay vì gradient chữ như bản HTML gốc. Trình tự: badge phóng to (0s) → tên/tagline trồi lên
// (0.5s/0.62s) → pill loading (0.74s) → gọi onDone khi xong (~2.9s), các vòng tròn/glow chạy loop
// độc lập suốt thời gian hiện màn hình.
export function Splash({ onDone }: SplashProps) {
  const ringValues = useRef(RINGS.map(() => new Animated.Value(0))).current;
  const glowPulse = useRef(new Animated.Value(0)).current;
  const spinnerRotate = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(0.7)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const title = useRef(new Animated.Value(0)).current;
  const tagline = useRef(new Animated.Value(0)).current;
  const pill = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    RINGS.forEach((ring, i) => {
      const value = ringValues[i];
      value.setValue(0);
      if (ring.kind === 'pulse') {
        Animated.loop(
          Animated.sequence([
            Animated.timing(value, {
              toValue: 1,
              duration: ring.durationMs / 2,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(value, {
              toValue: 0,
              duration: ring.durationMs / 2,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ).start();
      } else {
        // 'ping' và 'spin' đều là 1 vòng lặp tăng dần 0→1 liên tục — với spin, 360deg trùng 0deg
        // nên điểm "reset" giữa 2 vòng lặp không lộ ra, tạo cảm giác quay đều.
        Animated.loop(
          Animated.timing(value, {
            toValue: 1,
            duration: ring.durationMs,
            easing: ring.kind === 'spin' ? Easing.linear : Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ).start();
      }
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(spinnerRotate, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true }),
    ).start();

    Animated.spring(badgeScale, { toValue: 1, useNativeDriver: true, damping: 12, mass: 0.6 }).start();
    Animated.timing(badgeOpacity, { toValue: 1, duration: 500, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
    Animated.timing(title, { toValue: 1, duration: 700, delay: 500, useNativeDriver: true }).start();
    Animated.timing(tagline, { toValue: 1, duration: 700, delay: 620, useNativeDriver: true }).start();
    Animated.timing(pill, { toValue: 1, duration: 700, delay: 740, useNativeDriver: true }).start();

    const doneTimer = setTimeout(onDone, 2950);
    return () => clearTimeout(doneTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const riseStyle = (value: Animated.Value) => ({
    opacity: value,
    transform: [{ translateY: value.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
  });

  return (
    <View style={{ flex: 1, backgroundColor: SPLASH_BG, overflow: 'hidden' }}>
      <SplashDecorativeBlobs pink={SPLASH_PINK} orange={SPLASH_ORANGE} />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 40 }}>
          <View />

          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 360, height: 360, alignItems: 'center', justifyContent: 'center' }}>
              <SplashRings ringValues={ringValues} pink={SPLASH_PINK} orange={SPLASH_ORANGE} />

              <Animated.View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  width: 150,
                  height: 150,
                  borderRadius: 75,
                  backgroundColor: SPLASH_PEACH,
                  opacity: glowPulse.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.4] }),
                }}
              />

              <Animated.View
                style={{
                  width: BADGE_SIZE,
                  height: BADGE_SIZE,
                  opacity: badgeOpacity,
                  transform: [{ scale: badgeScale }],
                  shadowColor: SPLASH_PINK,
                  shadowOpacity: 0.4,
                  shadowRadius: 24,
                  shadowOffset: { width: 0, height: 16 },
                  elevation: 12,
                }}
              >
                <LinearGradient
                  colors={[SPLASH_ORANGE, SPLASH_PINK, SPLASH_ORANGE]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: BADGE_SIZE,
                    height: BADGE_SIZE,
                    borderRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="business" size={50} color="#fff" />
                </LinearGradient>
              </Animated.View>
            </View>

            <View style={{ alignItems: 'center', paddingHorizontal: 34, marginTop: -20 }}>
              <Animated.Text
                style={[
                  { fontFamily: 'BeVietnamPro_700Bold', fontSize: 34, letterSpacing: -0.8, color: SPLASH_PINK },
                  riseStyle(title),
                ]}
              >
                {brand.appName}
              </Animated.Text>
              <Animated.Text
                style={[
                  {
                    marginTop: 6,
                    fontFamily: 'BeVietnamPro_700Bold',
                    fontSize: 11,
                    letterSpacing: 2.2,
                    textTransform: 'uppercase',
                    color: SPLASH_MUTED,
                  },
                  riseStyle(tagline),
                ]}
              >
                {brand.tagline}
              </Animated.Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', gap: 12 }}>
            <Animated.View
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderWidth: 1,
                  borderColor: SPLASH_BORDER,
                },
                riseStyle(pill),
              ]}
            >
              <Animated.View
                style={{
                  transform: [{ rotate: spinnerRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }],
                }}
              >
                <Ionicons name="sync" size={14} color={SPLASH_PINK} />
              </Animated.View>
              <Text style={{ fontFamily: 'BeVietnamPro_500Medium', fontSize: 12.5, color: SPLASH_INK }}>
                Đang tải khu phố của bạn...
              </Text>
            </Animated.View>

            <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 10.5, color: SPLASH_MUTED }}>
              {brand.versionLabel}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
