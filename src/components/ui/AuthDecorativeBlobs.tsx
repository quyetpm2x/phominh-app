import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import type { DimensionValue } from 'react-native';
import { Animated } from 'react-native';

import { colors } from '../../constants/design-tokens';

interface AuthDecorativeBlobsProps {
  success?: boolean;
}

// 2 khối gradient hồng-cam trang trí nền — dùng ở các màn onboarding tông mới (2026-08-24).
// Kích thước gốc theo mockup: w-80/w-72 = 320/288px (-top-32/-right-32/-left-24 = -128/-128/-96px)
// — ĐÃ ĐỔI VẾ trái/phải theo yêu cầu 2026-08-25 (khối 1 giờ ở góc trên-PHẢI, khối 2 ở giữa-TRÁI), và
// khối góc (khối 1) đã phóng to thêm 15% (320→368px) theo yêu cầu ngay sau đó, scale quanh đúng góc
// neo trên-phải (top/right offset cũng nhân 1.15 theo, không chỉ riêng size) để không lệch vị trí.
// BlurView phủ rộng hơn khối màu 40px mỗi phía để giả lập blur-3xl thật (cần expo-blur đã cài),
// thay vì gradient tan dần giả trước đó — cho phép giữ nguyên gradient 2 màu chéo góc như mockup.
//
// `success` (2026-08-25) — khi màn cha báo trạng thái hợp lệ (vd số điện thoại đã đúng), đổi khối
// sang xanh lá, có chuyển màu mượt. LinearGradient không nhận Animated.Value trực tiếp cho prop
// `colors` (khác style thường), nên không nội suy màu như GlowInputCard được — thay vào đó xếp
// chồng 2 lớp gradient (hồng-cam + xanh lá) rồi crossfade opacity giữa chúng qua Animated.
export function AuthDecorativeBlobs({ success = false }: AuthDecorativeBlobsProps) {
  const progress = useRef(new Animated.Value(success ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, { toValue: success ? 1 : 0, duration: 280, useNativeDriver: true }).start();
  }, [success, progress]);

  const defaultOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const successOpacity = progress;

  return (
    <>
      <Blob
        top={-147}
        right={-147}
        size={368}
        blurTop={-193}
        blurRight={-193}
        blurSize={460}
        defaultColors={['#FF416C1f', '#FF4B2B18']}
        successColors={[`${colors.success.DEFAULT}1f`, `${colors.success.dark}18`]}
        defaultOpacity={defaultOpacity}
        successOpacity={successOpacity}
      />
      <Blob
        top="55%"
        left={-96}
        size={288}
        blurTop="55%"
        blurLeft={-136}
        blurSize={368}
        blurTranslateY={-40}
        defaultColors={['#FF4B2B18', '#FF416C10']}
        successColors={[`${colors.success.dark}18`, `${colors.success.DEFAULT}10`]}
        defaultOpacity={defaultOpacity}
        successOpacity={successOpacity}
      />
    </>
  );
}

interface BlobProps {
  top: DimensionValue;
  left?: number;
  right?: number;
  size: number;
  blurTop: DimensionValue;
  blurLeft?: number;
  blurRight?: number;
  blurSize: number;
  blurTranslateY?: number;
  defaultColors: [string, string];
  successColors: [string, string];
  defaultOpacity: Animated.AnimatedInterpolation<number>;
  successOpacity: Animated.Value;
}

function Blob({
  top,
  left,
  right,
  size,
  blurTop,
  blurLeft,
  blurRight,
  blurSize,
  blurTranslateY = 0,
  defaultColors,
  successColors,
  defaultOpacity,
  successOpacity,
}: BlobProps) {
  const borderRadius = size / 2;
  return (
    <>
      <Animated.View style={{ position: 'absolute', top, left, right, width: size, height: size, borderRadius, overflow: 'hidden', opacity: defaultOpacity }}>
        <LinearGradient colors={defaultColors} style={{ flex: 1 }} />
      </Animated.View>
      <Animated.View style={{ position: 'absolute', top, left, right, width: size, height: size, borderRadius, overflow: 'hidden', opacity: successOpacity }}>
        <LinearGradient colors={successColors} style={{ flex: 1 }} />
      </Animated.View>
      <BlurView
        intensity={35}
        tint="light"
        style={{
          position: 'absolute',
          top: blurTop,
          left: blurLeft,
          right: blurRight,
          width: blurSize,
          height: blurSize,
          borderRadius: blurSize / 2,
          transform: [{ translateY: blurTranslateY }],
        }}
      />
    </>
  );
}
