import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

import { colors } from '../constants/design-tokens';

// Icon toà nhà (gradient, xoay nhẹ) + 2 pill nổi nhấp nhô — tách khỏi done.tsx cho gọn dưới 250
// dòng. shadow đặt ở View ngoài có backgroundColor riêng (không để trong suốt) — LinearGradient bên
// trong tự bo góc/clip nên đặt shadow trực tiếp lên nó sẽ không hiện trên iOS (cùng lỗi đã gặp ở
// OtpDigitBox/nút "+" bottom nav).
export function DoneBadgeIcon() {
  const bounce1 = useRef(new Animated.Value(0)).current;
  const bounce2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (value: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(value, { toValue: 0, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
      );
    const loop1 = loop(bounce1, 0);
    const loop2 = loop(bounce2, 500);
    loop1.start();
    loop2.start();
    return () => {
      loop1.stop();
      loop2.stop();
    };
  }, [bounce1, bounce2]);

  const translateY1 = bounce1.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
  const translateY2 = bounce2.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });

  return (
    <View style={{ height: 140 }} className="w-full items-center justify-center">
      <View
        style={{
          width: 112,
          height: 112,
          borderRadius: 26,
          padding: 4,
          backgroundColor: colors.primary.DEFAULT,
          transform: [{ rotate: '5deg' }],
          shadowColor: colors.primary.DEFAULT,
          shadowOpacity: 0.4,
          shadowRadius: 28,
          shadowOffset: { width: 0, height: 14 },
          elevation: 12,
        }}
      >
        <LinearGradient
          colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
          style={{ flex: 1, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="business" size={48} color="#fff" />
        </LinearGradient>
      </View>

      <Animated.View
        style={{ position: 'absolute', top: 4, right: 4, transform: [{ rotate: '12deg' }, { translateY: translateY1 }] }}
        className="rounded-xl border border-border bg-white px-3 py-2 shadow-md"
      >
        <Text className="text-[11px] font-sans-black uppercase tracking-wide text-primary">41 tin mới</Text>
      </Animated.View>
      <Animated.View
        style={{ position: 'absolute', bottom: 4, left: 4, transform: [{ rotate: '-8deg' }, { translateY: translateY2 }] }}
        className="rounded-xl border border-border bg-white px-3 py-2 shadow-md"
      >
        <Text className="text-[11px] font-sans-black uppercase tracking-wide text-accent">~3 phút đi bộ</Text>
      </Animated.View>
    </View>
  );
}
