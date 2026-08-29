import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { brand } from '../../src/constants/brand';
import { colors } from '../../src/constants/design-tokens';
import { WelcomeHero } from '../../src/components/WelcomeHero';

// Đọc thẳng từ design-tokens.ts (rebrand 2026-08-24 áp dụng TOÀN APP — đã xác nhận lại, xoá bỏ
// file onboardingAccent.ts tách riêng gây hiểu lầm là chỉ Splash/Welcome mới hồng-cam).
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
    icon: 'location' as const,
    title: 'Gần tới mức đi bộ được',
    body: 'Chỉ thấy bài của người trong bán kính bạn chọn.',
    bg: `${OA.pink}1a`,
    color: OA.pink,
  },
  {
    icon: 'camera' as const,
    title: 'Ảnh chụp tại chỗ, không ảnh cũ',
    body: 'Mọi ảnh đều chụp trong app.',
    bg: `${OA.orange}1a`,
    color: OA.orange,
  },
  {
    icon: 'timer-outline' as const,
    title: 'Hết 24 giờ là tin tự ẩn',
    body: 'Mở lên lúc nào cũng là chuyện đang diễn ra.',
    bg: `${OA.pink}1a`,
    color: OA.pink,
  },
];

// isWelcome — làm lại theo mockup HTML gốc (2026-08-24). Ảnh nền bản đồ mờ trong mockup trỏ tới
// Supabase Storage của chính công cụ Sleek (không phải backend Phố Mình) — CỐ TÌNH bỏ qua, không
// hotlink hạ tầng bên thứ ba (đã xác nhận với người dùng), giữ nền trơn/gradient blob như trước.
export default function WelcomeScreen() {
  const dotPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotPulse, { toValue: 1, duration: 900, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(dotPulse, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    ).start();
  }, [dotPulse]);

  return (
    <View style={{ flex: 1, backgroundColor: OA.background }}>
      {/* Blob trang trí — blur THẬT (BlurView phủ rộng hơn khối màu 40px mỗi phía), cùng kỹ thuật
          AuthDecorativeBlobs bên màn Nhập SĐT / SplashDecorativeBlobs bên Splash. */}
      <View style={{ position: 'absolute', top: -96, right: -96, width: 256, height: 256, borderRadius: 128, overflow: 'hidden' }}>
        <LinearGradient colors={[`${OA.pink}26`, `${OA.orange}1a`]} style={{ flex: 1 }} />
      </View>
      <BlurView
        intensity={60}
        tint="light"
        style={{ position: 'absolute', top: -136, right: -136, width: 336, height: 336, borderRadius: 168 }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerClassName="px-6 pt-3 pb-4">
          <View className="gap-2">
            <WelcomeHero pink={OA.pink} orange={OA.orange} muted={OA.muted} ink={OA.ink} />

            <View className="mt-2 flex-row items-center gap-3">
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  overflow: 'hidden',
                  shadowColor: OA.pink,
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 5,
                }}
              >
                <LinearGradient
                  colors={[OA.orange, OA.pink]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Ionicons name="business" size={24} color="#fff" />
                </LinearGradient>
              </View>

              {/* Pill "41 tin mới" — mockup dùng backdrop-blur-md (kính mờ thật). BlurView không
                  chắc hỗ trợ className cho layout (component native đặc biệt) — bọc ngoài bằng
                  View lo hình dáng (bo tròn/viền/overflow), BlurView chỉ phủ tuyệt đối bên trong
                  để làm mờ, giống đúng cách đã dùng ổn định ở card Nhập SĐT. */}
              <View
                className="self-start rounded-full border border-border/70 overflow-hidden"
                style={{
                  shadowColor: '#000',
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  shadowOffset: { width: 0, height: 1 },
                  elevation: 1,
                }}
              >
                <BlurView intensity={50} tint="light" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                <View className="flex-row items-center px-3.5 py-1.5">
                  <View style={{ width: 8, height: 8, marginRight: 8, alignItems: 'center', justifyContent: 'center' }}>
                    <Animated.View
                      pointerEvents="none"
                      style={{
                        position: 'absolute',
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: OA.pink,
                        opacity: dotPulse.interpolate({ inputRange: [0, 1], outputRange: [0.75, 0] }),
                        transform: [{ scale: dotPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.2] }) }],
                      }}
                    />
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: OA.pink }} />
                  </View>
                  <Text className="font-sans-semibold text-xs text-ink/90">
                    Khu mình đang có <Text className="font-mono-bold" style={{ color: OA.pink }}>41</Text> tin mới
                  </Text>
                </View>
              </View>
            </View>

            <Text className="mt-2 text-[42px] leading-[44px] font-sans-black tracking-tighter text-ink">
              {brand.appName}
            </Text>
            <Text className="mt-1 text-lg font-sans-bold" style={{ color: OA.pink }}>
              {brand.tagline}
            </Text>
            <Text className="mt-2 text-base leading-6 text-muted max-w-[300px]">{brand.taglineLong}</Text>

            <View className="mt-3 gap-2.5">
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
                    <Ionicons name={vp.icon} size={20} color={vp.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-sans-bold text-sm text-ink">{vp.title}</Text>
                    <Text className="mt-0.5 text-xs leading-[18px] text-muted">{vp.body}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View className="pb-8 pt-8 gap-3">
            <Pressable onPress={() => router.push('/(auth)/phone-input')} className="active:scale-[0.98]">
              <LinearGradient
                colors={[OA.pink, OA.orange]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  height: 60,
                  borderRadius: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.25)',
                  shadowColor: OA.pink,
                  shadowOpacity: 0.35,
                  shadowRadius: 16,
                  shadowOffset: { width: 0, height: 8 },
                  elevation: 6,
                }}
              >
                <Text className="font-sans-bold text-base text-white">Bắt đầu với số điện thoại</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </LinearGradient>
            </Pressable>
            <Text className="text-center text-[11.5px] leading-[17px] text-muted">
              Tiếp tục là bạn đồng ý Điều khoản sử dụng.{'\n'}Vị trí chỉ được lấy khi bạn mở app.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
