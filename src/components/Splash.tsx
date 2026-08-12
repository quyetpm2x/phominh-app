import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { brand } from '../constants/brand';
import { colors } from '../constants/design-tokens';

// Màu đất nung (terracotta) chỉ dùng riêng ở màn Splash (theo Splash.dc.html) — chưa có trong
// design-tokens dùng chung, không thêm vào bảng màu toàn app chỉ vì 1 màn hình.
const TERRACOTTA = '#c0562e';
const GOLD = colors.accent[300];

interface SplashProps {
  onDone: () => void;
}

// sp.core — mô phỏng lại trình tự animation của Splash.dc.html: mark phóng to từ giữa (0s) →
// ghim vị trí rơi xuống (0.35s) → tên + tagline trồi lên (0.5s/0.62s) → pill trạng thái (0.74s) →
// thanh tiến trình chạy đầy trong 2.4s (bắt đầu 0.4s) → gọi onDone khi xong (~2.9s).
export function Splash({ onDone }: SplashProps) {
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;
  const blobA = useRef(new Animated.Value(0)).current;
  const blobB = useRef(new Animated.Value(0)).current;
  const markScale = useRef(new Animated.Value(0.7)).current;
  const markOpacity = useRef(new Animated.Value(0)).current;
  const pin = useRef(new Animated.Value(0)).current;
  const title = useRef(new Animated.Value(0)).current;
  const tagline = useRef(new Animated.Value(0)).current;
  const pill = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const ringLoop = (value: Animated.Value, delay: number) => {
      const timer = setTimeout(() => {
        Animated.loop(
          Animated.timing(value, {
            toValue: 1,
            duration: 3400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ).start();
      }, delay);
      return timer;
    };
    const ringTimers = [ringLoop(ring1, 0), ringLoop(ring2, 1150), ringLoop(ring3, 2300)];

    const blobLoop = (value: Animated.Value, duration: number, reverse: boolean) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: reverse ? 0 : 1,
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: reverse ? 1 : 0,
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };
    blobA.setValue(0);
    blobB.setValue(1);
    blobLoop(blobA, 13000, false);
    blobLoop(blobB, 16000, true);

    Animated.spring(markScale, { toValue: 1, delay: 0, useNativeDriver: true, damping: 12, mass: 0.6 }).start();
    Animated.timing(markOpacity, {
      toValue: 1,
      duration: 500,
      delay: 0,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
    Animated.spring(pin, { toValue: 1, delay: 350, useNativeDriver: true, damping: 11, mass: 0.5 }).start();
    Animated.timing(title, { toValue: 1, duration: 700, delay: 500, useNativeDriver: true }).start();
    Animated.timing(tagline, { toValue: 1, duration: 700, delay: 620, useNativeDriver: true }).start();
    Animated.timing(pill, { toValue: 1, duration: 700, delay: 740, useNativeDriver: true }).start();
    Animated.timing(progress, {
      toValue: 1,
      duration: 2400,
      delay: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    const doneTimer = setTimeout(onDone, 2950);

    return () => {
      ringTimers.forEach(clearTimeout);
      clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ringStyle = (value: Animated.Value) => ({
    opacity: value.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] }),
    transform: [{ scale: value.interpolate({ inputRange: [0, 1], outputRange: [0.5, 2.6] }) }],
  });

  const riseStyle = (value: Animated.Value) => ({
    opacity: value,
    transform: [{ translateY: value.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
  });

  return (
    <LinearGradient
      colors={[colors.primary[300], colors.primary.DEFAULT, colors.primary.dark]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={{ flex: 1 }}
    >
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: -90,
          top: 60,
          width: 280,
          height: 280,
          borderRadius: 140,
          backgroundColor: GOLD,
          opacity: 0.16,
          transform: [
            { translateX: blobA.interpolate({ inputRange: [0, 1], outputRange: [0, 16] }) },
            { translateY: blobA.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) },
            { scale: blobA.interpolate({ inputRange: [0, 1], outputRange: [1, 1.14] }) },
          ],
        }}
      />
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          right: -100,
          bottom: 120,
          width: 300,
          height: 300,
          borderRadius: 150,
          backgroundColor: TERRACOTTA,
          opacity: 0.16,
          transform: [
            { translateX: blobB.interpolate({ inputRange: [0, 1], outputRange: [0, 16] }) },
            { translateY: blobB.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) },
            { scale: blobB.interpolate({ inputRange: [0, 1], outputRange: [1, 1.14] }) },
          ],
        }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 28 }}>
          <View style={{ width: 120, height: 120, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View
              style={[
                { position: 'absolute', width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
                ringStyle(ring1),
              ]}
            />
            <Animated.View
              style={[
                { position: 'absolute', width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
                ringStyle(ring2),
              ]}
            />
            <Animated.View
              style={[
                { position: 'absolute', width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
                ringStyle(ring3),
              ]}
            />

            <Animated.View
              style={{
                width: 104,
                height: 104,
                borderRadius: 34,
                backgroundColor: colors.cream.DEFAULT,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: markOpacity,
                transform: [{ scale: markScale }],
                shadowColor: '#000',
                shadowOpacity: 0.32,
                shadowRadius: 24,
                shadowOffset: { width: 0, height: 14 },
                elevation: 10,
              }}
            >
              <Text style={{ fontSize: 46, fontWeight: '700', letterSpacing: -0.5, color: colors.primary.DEFAULT }}>P</Text>
            </Animated.View>

            <Animated.View
              style={{
                position: 'absolute',
                right: 4,
                top: 6,
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: GOLD,
                borderWidth: 3,
                borderColor: colors.cream.DEFAULT,
                opacity: pin,
                transform: [{ translateY: pin.interpolate({ inputRange: [0, 1], outputRange: [-40, 0] }) }],
              }}
            />
          </View>

          <View style={{ alignItems: 'center', paddingHorizontal: 34 }}>
            <Animated.Text
              style={[
                { fontSize: 38, fontWeight: '700', letterSpacing: -1, color: '#fff' },
                riseStyle(title),
              ]}
            >
              {brand.appName}
            </Animated.Text>
            <Animated.Text
              style={[
                { marginTop: 8, fontSize: 15.5, lineHeight: 22, color: 'rgba(255,255,255,0.82)', textAlign: 'center' },
                riseStyle(tagline),
              ]}
            >
              {brand.tagline}
            </Animated.Text>
          </View>
        </View>

        <View style={{ paddingBottom: 34, alignItems: 'center', gap: 16 }}>
          <Animated.View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.14)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.22)',
              },
              riseStyle(pill),
            ]}
          >
            <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: GOLD }} />
            <Text style={{ fontSize: 12.5, fontWeight: '600', color: 'rgba(255,255,255,0.92)' }}>
              Đang tìm khu vực quanh bạn…
            </Text>
          </Animated.View>

          <View
            style={{
              width: '100%',
              paddingHorizontal: 34,
            }}
          >
            <View
              style={{
                height: 3,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.16)',
                overflow: 'hidden',
              }}
            >
              <Animated.View
                style={{
                  height: '100%',
                  borderRadius: 2,
                  backgroundColor: GOLD,
                  width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                }}
              />
            </View>
          </View>

          <Text
            style={{
              fontSize: 10.5,
              fontWeight: '500',
              letterSpacing: 1,
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            VỊ TRÍ CHỈ LẤY KHI MỞ APP
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
