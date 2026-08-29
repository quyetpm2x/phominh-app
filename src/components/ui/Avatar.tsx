import { Image, Text, View } from 'react-native';

import { colors } from '../../constants/design-tokens';

interface AvatarProps {
  initial: string;
  color?: string;
  size?: number;
  radius?: number;
  imageUrl?: string | null; // ảnh đại diện thật (mục 37) — có thì ưu tiên hiện ảnh, không thì fallback bong bóng chữ cái
}

// Bong bóng chữ cái đầu — dùng cho author feed, hồ sơ, chat khi CHƯA có ảnh đại diện thật.
// Màu mặc định trước đây hardcode '#1f6f52' (xanh lá thương hiệu CŨ, sót lại từ trước rebrand
// 2026-08-24) — sửa lại dùng đúng colors.primary.DEFAULT (hồng) hiện tại.
export function Avatar({ initial, color = colors.primary.DEFAULT, size = 38, radius = 12, imageUrl }: AvatarProps) {
  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={{ width: size, height: size, borderRadius: radius }}
        resizeMode="cover"
      />
    );
  }
  return (
    <View
      style={{ width: size, height: size, borderRadius: radius, backgroundColor: color }}
      className="items-center justify-center"
    >
      <Text className="font-sans-semibold text-white" style={{ fontSize: size * 0.42 }}>
        {initial}
      </Text>
    </View>
  );
}
