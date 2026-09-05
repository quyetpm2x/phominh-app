import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientPrimaryButton } from '@/src/components/ui/GradientPrimaryButton';
import { GradientPrimaryView } from '@/src/components/ui/GradientPrimaryView';
import { WelcomeIcon } from '@/src/components/ui/WelcomeIcon';
import { WelcomeHero } from '../../src/components/WelcomeHero';
import { GradientText } from '../../src/components/ui/GradientText';
import { brand } from '../../src/constants/brand';
import { colors } from '../../src/constants/design-tokens';

const OA = {
  pink: colors.primary.DEFAULT,
  orange: colors.accent.DEFAULT,
  peach: colors.primary.peach,
  ink: colors.ink.DEFAULT,
  muted: colors.muted.DEFAULT,
  border: colors.border.DEFAULT,
  background: colors.cream.DEFAULT,
};

const VALUE_PROPS = [
  {
    icon: <WelcomeIcon name="location" />,
    title: 'Gần tới mức đi bộ được',
    body: 'Chỉ thấy bài của người trong bán kính bạn chọn.',
    bg: `${OA.pink}1a`,
    color: OA.pink,
  },
  {
    icon: <WelcomeIcon name="camera" />,
    title: 'Ảnh chụp tại chỗ, không ảnh cũ',
    body: 'Mọi ảnh đều chụp trong app.',
    bg: `${OA.orange}1a`,
    color: OA.orange,
  },
  {
    icon: <WelcomeIcon name="time" />,
    title: 'Hết 24 giờ là tin tự ẩn',
    body: 'Mở lên lúc nào cũng là chuyện đang diễn ra.',
    bg: `${OA.pink}1a`,
    color: OA.pink,
  },
];

export default function WelcomeScreen() {
  const dotPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotPulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(dotPulse, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    ).start();
  }, [dotPulse]);

  return (
    <View style={{ flex: 1, backgroundColor: OA.background }}>
      <View
        style={{
          position: 'absolute',
          top: -96,
          right: -96,
          width: 256,
          height: 256,
          borderRadius: 128,
          overflow: 'hidden',
        }}
      >
        <LinearGradient colors={[`${OA.pink}26`, `${OA.orange}1a`]} style={{ flex: 1 }} />
      </View>
      <BlurView
        intensity={60}
        tint="light"
        style={{ position: 'absolute', top: -136, right: -136, width: 336, height: 336, borderRadius: 168 }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerClassName="">
          <WelcomeHero pink={OA.pink} orange={OA.orange} muted={OA.muted} ink={OA.ink} />
          <View className="gap-2 px-6 pt-3 pb-4">
            <View className="mt-2 flex-row items-center gap-3">
              <GradientPrimaryView size={48} borderRadius={14} borderWidth={2} hasShadow>
                <WelcomeIcon name="buildingMark" />
              </GradientPrimaryView>

              <View
                className="rounded-full border border-border/70 overflow-hidden"
                style={{
                  shadowColor: '#000',
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  shadowOffset: { width: 0, height: 1 },
                  elevation: 1,
                }}
              >
                <BlurView
                  intensity={50}
                  tint="light"
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                />
                <View className="flex-row items-center px-3.5 py-1.5">
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      marginRight: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Animated.View
                      pointerEvents="none"
                      style={{
                        position: 'absolute',
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: OA.pink,
                        opacity: dotPulse.interpolate({ inputRange: [0, 1], outputRange: [0.75, 0] }),
                        transform: [
                          { scale: dotPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.2] }) },
                        ],
                      }}
                    />
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: OA.pink }} />
                  </View>
                  <Text className="font-sans-semibold text-xs text-ink/90">
                    Khu mình đang có{' '}
                    <Text className="font-mono-bold" style={{ color: OA.pink }}>
                      41
                    </Text>{' '}
                    tin mới
                  </Text>
                </View>
              </View>
            </View>

            <Text className="mt-2 text-[42px] leading-[54px] font-sans-black tracking-tighter text-ink">
              {brand.appName}
            </Text>
            <GradientText
              className=" text-lg font-sans-bold"
              colors={[OA.pink, OA.orange]}
              direction="vertical"
            >
              {brand.tagline}
            </GradientText>
            <Text className="mt-2 text-base leading-6 text-[#79716B] max-w-[300px]">{brand.taglineLong}</Text>

            <View className="mt-0 gap-2.5">
              {VALUE_PROPS.map((vp) => (
                <View
                  key={vp.title}
                  className="flex-row gap-4 rounded-2xl bg-white border border-stone-100 p-4"
                  style={{
                    shadowColor: '#000',
                    shadowOpacity: 0.08,
                    shadowRadius: 3,
                    shadowOffset: { width: 0, height: 1 },
                    elevation: 2,
                  }}
                >
                  <View
                    style={{ backgroundColor: vp.bg }}
                    className="w-10 h-10 rounded-xl items-center justify-center"
                  >
                    {vp.icon}
                  </View>
                  <View className="flex-1">
                    <Text className="font-sans-bold text-sm text-ink">{vp.title}</Text>
                    <Text className="mt-0.5 text-xs leading-[18px] text-[#79716B]">{vp.body}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View className="px-6">
            <View className="pb-8 pt-4 gap-3">
              <Pressable onPress={() => router.push('/(auth)/phone-input')} className="active:scale-[0.98]">
                <GradientPrimaryButton>
                  <Text className="font-sans-bold text-base text-white">Bắt đầu với số điện thoại</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </GradientPrimaryButton>
              </Pressable>
              <Text className="text-center text-[11.5px] leading-[17px] text-muted">
                Tiếp tục là bạn đồng ý{' '}
                <Text
                  accessibilityRole="link"
                  onPress={() => router.push('/(auth)/terms-of-use')}
                  className="font-sans-semibold text-[#57534D] underline"
                >
                  Điều khoản sử dụng
                </Text>
                .{'\n'}Vị trí chỉ được lấy khi bạn mở app.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
