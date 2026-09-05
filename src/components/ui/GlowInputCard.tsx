import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import { colors } from '../../constants/design-tokens';

export type GlowInputCardState = 'default' | 'error' | 'success';

interface GlowInputCardProps {
  state?: GlowInputCardState;
  children: ReactNode;
}

// Card mờ + vòng glow quanh ô nhập SĐT — tách khỏi phone-input.tsx (đã vượt 250 dòng). Mockup dùng
// CSS `filter: blur()` (TỰ làm mờ chính hình dạng của nó) cho vòng glow. BlurView của RN chỉ làm mờ
// THỨ NẰM SAU nó (kiểu kính mờ/backdrop-blur), khác hẳn cơ chế — dùng nhầm gần như không ra hiệu
// ứng gì. RN không có filter tự-làm-mờ; cách đúng để giả lập "phát sáng mờ" là shadow màu (shadow
// vốn đã mờ mềm tự nhiên). `shadowColor` chỉ nhận 1 màu — không tự pha gradient hồng→cam như mockup
// được, nên lồng 2 lớp shadow lệch hướng (2 tông màu) để chồng lên nhau tạo cảm giác chuyển màu.
//
// Chuyển màu MƯỢT giữa 3 trạng thái (2026-08-25) — trước đó đổi màu tức thì theo state, giờ dùng 1
// Animated.Value chạy -1 (error) → 0 (default) → 1 (success), nội suy màu qua interpolate (Animated
// hỗ trợ nội suy trực tiếp giữa các chuỗi màu). Bắt buộc useNativeDriver:false vì màu/borderColor
// không chạy được trên native thread.
const STATE_TO_NUMBER: Record<GlowInputCardState, number> = { error: -1, default: 0, success: 1 };

export function GlowInputCard({ state = 'default', children }: GlowInputCardProps) {
  const progress = useRef(new Animated.Value(STATE_TO_NUMBER[state])).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: STATE_TO_NUMBER[state],
      duration: 280,
      useNativeDriver: false,
    }).start();
  }, [state, progress]);

  const shadowColorA = progress.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [colors.danger.DEFAULT, colors.primary.DEFAULT, colors.success.DEFAULT],
  });
  const shadowColorB = progress.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [colors.danger.text, colors.accent.DEFAULT, colors.success.dark],
  });
  const borderColor = progress.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [colors.danger.DEFAULT, 'rgba(233,236,239,0.7)', colors.success.DEFAULT],
  });

  return (
    <Animated.View
      style={{
        borderRadius: 20,
        shadowColor: shadowColorA,
        shadowOpacity: 0.18,
        shadowRadius: 16,
        shadowOffset: { width: -4, height: 0 },
        elevation: 8,
      }}
    >
      <Animated.View
        style={{
          borderRadius: 20,
          shadowColor: shadowColorB,
          shadowOpacity: 0.18,
          shadowRadius: 16,
          shadowOffset: { width: 4, height: 0 },
          elevation: 8,
        }}
      >
        {/* shadow-sm phải nằm ở lớp NGOÀI CÙNG này (không overflow:hidden) — nếu đặt ở View con bên
            trong sẽ bị lớp bo góc/overflow:hidden của card cắt mất. Dùng style tường minh thay vì
            className shadow-sm: trên iOS, shadow gần như không hiện nếu View trong suốt hoàn toàn
            (không có backgroundColor) dù có bo góc — cần nền để tính bóng; Android lại cần riêng
            `elevation`, className shadow-sm không tự sinh ra thuộc tính này. */}
        <Animated.View
          style={{
            height: 73,
            borderRadius: 20,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <Animated.View
            style={{ flex: 1, borderRadius: 20, borderWidth: 1.5, overflow: 'hidden', borderColor }}
          >
            {/* card gần như trắng đặc (95%) — mockup "bg-card/95 backdrop-blur-xl": blur chỉ xử lý
                5% mờ còn lại, KHÔNG phải hiệu ứng chính. Từng để BlurView tự lo cả nền lẫn blur nên
                bị ám hồng quá đậm — tách: BlurView chỉ làm mờ, lớp trắng 95% phủ riêng để giữ card
                gần như trắng thật. */}
            <BlurView
              intensity={40}
              tint="light"
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255,255,255,0.95)',
              }}
            />
            <Animated.View
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 }}
            >
              {children}
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}
