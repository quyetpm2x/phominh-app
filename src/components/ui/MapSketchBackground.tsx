import { View } from 'react-native';

interface MapSketchBackgroundProps {
  width: number;
  height: number;
  color?: string;
  cell?: number;
}

// Lưới kẻ mờ mô phỏng bản đồ đường phố — SƠ ĐỒ MINH HOẠ tạm thời, không phải ảnh bản đồ thật (cùng
// quy ước đã dùng ở trang chủ web marketing: "SƠ ĐỒ MINH HOẠ — CHỜ BẢN ĐỒ THẬT"). Dùng thay cho ảnh
// nền bản đồ trong mockup gốc (URL Supabase của Sleek, không dùng vì phụ thuộc hạ tầng bên thứ ba).
export function MapSketchBackground({ width, height, color = '#00000010', cell = 28 }: MapSketchBackgroundProps) {
  const cols = Math.ceil(width / cell);
  const rows = Math.ceil(height / cell);

  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, width, height, overflow: 'hidden' }}>
      {Array.from({ length: cols + 1 }).map((_, i) => (
        <View key={`v-${i}`} style={{ position: 'absolute', left: i * cell, top: 0, width: 1, height, backgroundColor: color }} />
      ))}
      {Array.from({ length: rows + 1 }).map((_, i) => (
        <View key={`h-${i}`} style={{ position: 'absolute', top: i * cell, left: 0, width, height: 1, backgroundColor: color }} />
      ))}
    </View>
  );
}
