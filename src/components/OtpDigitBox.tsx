import { LinearGradient } from 'expo-linear-gradient';
import { Animated, Text, View } from 'react-native';

import { colors } from '../constants/design-tokens';

type OtpBoxState = 'filled' | 'cursor' | 'empty';

interface OtpDigitBoxProps {
  digit: string;
  state: OtpBoxState;
  // Dùng chung 1 Animated.Value với step-badge (tránh chạy 2 vòng loop animation song song cho
  // cùng 1 hiệu ứng nhấp nháy).
  pulse: Animated.Value;
}

const BOX_SIZE = 48;

// Viền gradient (mockup: p-[1.5px] bg-gradient-to-br + inner bg-card) — RN không có border-image,
// giả lập bằng LinearGradient làm nền ngoài + View bo góc nhỏ hơn (borderRadius trừ padding) phủ
// trắng bên trong, độ dày viền = padding của LinearGradient.
export function OtpDigitBox({ digit, state, pulse }: OtpDigitBoxProps) {
  if (state === 'empty') {
    return (
      <View
        style={{ height: BOX_SIZE, width: BOX_SIZE }}
        className="items-center justify-center rounded-2xl border border-border/80 bg-white/60"
      >
        <View style={{ backgroundColor: colors.muted.light }} className="h-2 w-2 rounded-full opacity-60" />
      </View>
    );
  }

  if (state === 'cursor') {
    return (
      // Shadow đặt ở View NGOÀI (nền trắng, không bị clip) — đặt thẳng lên LinearGradient (tự bo
      // góc + clip nội dung bên trong) thì shadow không hiện ra được trên iOS, cùng lỗi đã gặp ở
      // GlowInputCard.
      <View
        style={{
          height: BOX_SIZE,
          width: BOX_SIZE,
          borderRadius: 16,
          backgroundColor: '#fff',
          shadowColor: colors.primary.DEFAULT,
          shadowOpacity: 0.35,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        }}
      >
        <LinearGradient
          colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, borderRadius: 16, padding: 2 }}
        >
          <View className="flex-1 items-center justify-center rounded-[14px] bg-white">
            {/* Chỉ thanh con trỏ nhấp nháy — viền/nền giữ cố định. Nội suy về 0.15 (không về hẳn 0)
                để không biến mất hoàn toàn giữa 2 nhịp nháy, cùng cách làm ở phone-input.tsx. */}
            <Animated.View style={{ opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.15, 1] }) }}>
              <LinearGradient
                colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
                style={{ width: 2, height: 22, borderRadius: 1 }}
              />
            </Animated.View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View
      style={{
        height: BOX_SIZE,
        width: BOX_SIZE,
        borderRadius: 16,
        backgroundColor: '#fff',
        shadowColor: colors.primary.DEFAULT,
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
      }}
    >
      <LinearGradient
        colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1, borderRadius: 16, padding: 1.5 }}
      >
        <View className="flex-1 items-center justify-center rounded-[14px] bg-white">
          <Text className="font-sans-black text-[22px] text-ink">{digit}</Text>
        </View>
      </LinearGradient>
    </View>
  );
}
