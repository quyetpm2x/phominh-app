import type { ReactNode } from 'react';
import { Text, View, type ViewStyle } from 'react-native';

import { colors } from '../../constants/design-tokens';

type PlaceholderIcon = 'photo' | 'video' | 'camera' | 'map';

interface PhotoPlaceholderProps {
  style?: ViewStyle;
  label?: string;
  dark?: boolean;
  icon?: PlaceholderIcon;
  children?: ReactNode;
}

const ICON_TEXT: Record<PlaceholderIcon, string> = {
  camera: 'camera',
  video: '▶',
  map: 'bản đồ',
  photo: 'ảnh',
};

// Ô vuông sọc chéo thay cho ảnh/video/camera/bản đồ thật — đúng quy ước placeholder của bản thiết kế
// gốc (Phố Mình.dc.html dùng repeating-linear-gradient thay mọi ảnh). Giữ nguyên quy ước này thay vì
// bịa ảnh giả, vì đây là màn hình "chỉ UI".
export function PhotoPlaceholder({ style, label, dark, icon, children }: PhotoPlaceholderProps) {
  const stripeA = dark ? '#26241e' : colors.cream.surface;
  const stripeB = dark ? '#2e2b24' : colors.border.DEFAULT;
  const textColor = dark ? '#7d786d' : colors.muted.DEFAULT;
  const labelColor = dark ? '#e9e6df' : colors.muted.DEFAULT;

  return (
    <View
      style={[
        { backgroundColor: stripeA, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
        style,
      ]}
    >
      <DiagonalStripes color={stripeB} />
      {(icon || label) && (
        <View className="items-center gap-1">
          {icon ? (
            <Text style={{ color: textColor }} className="font-mono-medium text-[11px]">
              {ICON_TEXT[icon]}
            </Text>
          ) : null}
          {label ? (
            <Text style={{ color: labelColor }} className="font-mono-medium text-[10px]">
              {label}
            </Text>
          ) : null}
        </View>
      )}
      {children}
    </View>
  );
}

// Mô phỏng sọc chéo bằng các dải lệch nhau — RN không có repeating-linear-gradient.
function DiagonalStripes({ color }: { color: string }) {
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.6 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: i * 24 - 60,
            top: -20,
            width: 12,
            height: 260,
            backgroundColor: color,
            transform: [{ rotate: '35deg' }],
          }}
        />
      ))}
    </View>
  );
}
