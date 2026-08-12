import { Text, View } from 'react-native';

interface AvatarProps {
  initial: string;
  color?: string;
  size?: number;
  radius?: number;
}

// Bong bóng chữ cái đầu — dùng cho author feed, hồ sơ, chat (không có ảnh đại diện thật, chỉ UI).
export function Avatar({ initial, color = '#1f6f52', size = 38, radius = 12 }: AvatarProps) {
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
