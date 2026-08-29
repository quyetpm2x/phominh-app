import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

import { MapSketchBackground } from './ui/MapSketchBackground';

interface WelcomeHeroProps {
  pink: string;
  orange: string;
  muted: string;
  ink: string;
}

export function WelcomeHero({ pink, orange, muted, ink }: WelcomeHeroProps) {
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopRing = (value: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, { toValue: 1, duration: 2200, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        ]),
      );
    loopRing(ring1, 0).start();
    loopRing(ring2, 1100).start();
  }, [ring1, ring2]);

  const ringStyle = (value: Animated.Value) => ({
    opacity: value.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.5, 0] }),
    transform: [{ scale: value.interpolate({ inputRange: [0, 1], outputRange: [1, 4] }) }],
  });

  return (
    <View style={{ height: 260, maxWidth: 340, width: '100%', alignSelf: 'center' }} className="relative">
      <MapSketchBackground width={340} height={260} />

      <View
        style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: -12, marginTop: -12 }}
        className="items-center"
      >
        <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View
            pointerEvents="none"
            style={[{ position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: pink }, ringStyle(ring1)]}
          />
          <Animated.View
            pointerEvents="none"
            style={[{ position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: pink }, ringStyle(ring2)]}
          />
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: pink,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.12,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4,
            }}
          >
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: pink }} />
          </View>
        </View>
        <View
          className="mt-2 flex-row items-center gap-1.5 rounded-full bg-white border border-stone-100 px-3 py-1.5"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
          }}
        >
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: orange }} />
          <Text className="font-sans-bold text-[10px] uppercase tracking-tight text-ink">~3 phút đi bộ</Text>
        </View>
      </View>

      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 180,
          transform: [{ rotate: '-1deg' }, { scale: 1.02 }],
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 6,
        }}
        className="rounded-2xl bg-white border border-stone-100/50 p-3"
      >
        <View className="flex-row items-center justify-between mb-2">
          <Text className="font-mono-bold text-[9px] tracking-wide" style={{ color: pink }}>
            VỪA ĐĂNG
          </Text>
          <Text className="text-[9px]" style={{ color: muted }}>180m</Text>
        </View>
        <View className="h-20 rounded-lg bg-stone-50 items-center justify-center overflow-hidden">
          <Ionicons name="image-outline" size={30} color="#e7e5e4" />
        </View>
        <Text className="mt-2 text-xs font-sans-bold leading-4" style={{ color: ink }}>
          Bún chả đầu ngõ còn 12 suất
        </Text>
      </View>

      <View
        style={{
          position: 'absolute',
          right: 0,
          top: 16,
          width: 170,
          transform: [{ rotate: '1deg' }, { translateY: 8 }],
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 6,
        }}
        className="rounded-2xl bg-white border border-stone-100/50 p-3"
      >
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="font-mono-bold text-[9px] tracking-wide" style={{ color: orange }}>
            5 GIỜ TRƯỚC
          </Text>
          <Text className="text-[9px] font-sans-medium" style={{ color: muted }}>620m</Text>
        </View>
        <Text className="text-xs font-sans-bold leading-4 mb-2" style={{ color: ink }}>
          Mất điện toà T4 từ sáng nay
        </Text>
        <View className="flex-row items-center gap-1">
          <Ionicons name="chatbubble-ellipses" size={11} color={muted} />
          <Text className="text-[10px]" style={{ color: muted }}>24 bình luận</Text>
        </View>
      </View>
    </View>
  );
}
