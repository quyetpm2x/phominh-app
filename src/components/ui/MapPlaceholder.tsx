import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { colors } from '../../constants/design-tokens';

interface MapPlaceholderProps {
  place: string;
  pinColor?: string;
  children?: ReactNode;
}

// Nền bản đồ giả — lưới ô vuông nhạt thay cho bản đồ thật, ghim vị trí ở giữa. Dùng chung cho
// onboarding (chọn Nhà/Chỗ làm), màn Khu vực, và chế độ Bản đồ trong Feed.
export function MapPlaceholder({ place, pinColor = colors.primary.DEFAULT, children }: MapPlaceholderProps) {
  return (
    <View className="flex-1 bg-map overflow-hidden">
      <MapGrid />
      <View className="absolute left-4 right-4 top-3.5 h-[46px] rounded-[13px] bg-white items-start justify-center px-4 shadow-sm">
        <Text className="text-sm text-ink">{place}</Text>
      </View>
      {children}
      <View
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 16,
          height: 16,
          marginLeft: -8,
          marginTop: -8,
          borderRadius: 8,
          backgroundColor: pinColor,
          borderWidth: 3,
          borderColor: '#fff',
        }}
      />
    </View>
  );
}

function MapGrid() {
  const lines = Array.from({ length: 10 });
  return (
    <View className="absolute inset-0">
      {lines.map((_, i) => (
        <View key={`h${i}`} style={{ position: 'absolute', top: i * 44, left: 0, right: 0, height: 1, backgroundColor: colors.border.DEFAULT }} />
      ))}
      {lines.map((_, i) => (
        <View key={`v${i}`} style={{ position: 'absolute', left: i * 44, top: 0, bottom: 0, width: 1, backgroundColor: colors.border.DEFAULT }} />
      ))}
    </View>
  );
}
