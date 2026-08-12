import { useState } from 'react';
import { Pressable, Text, View, type GestureResponderEvent } from 'react-native';

import { colors } from '../../constants/design-tokens';

const MIN_KM = 1;
const MAX_KM = 10;

interface RadiusSliderProps {
  valueKm: number;
  onChange: (km: number) => void;
}

// Thanh trượt bán kính liên tục (chạm vào track để đặt giá trị gần nhất) — đúng dạng track + chấm
// kéo của thiết kế gốc, thay cho dãy nút bước rời rạc trước đây.
export function RadiusSlider({ valueKm, onChange }: RadiusSliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const ratio = Math.min(1, Math.max(0, (valueKm - MIN_KM) / (MAX_KM - MIN_KM)));

  const handlePress = (e: GestureResponderEvent) => {
    if (!trackWidth) return;
    const x = Math.min(trackWidth, Math.max(0, e.nativeEvent.locationX));
    const next = MIN_KM + (x / trackWidth) * (MAX_KM - MIN_KM);
    onChange(Math.round(next * 2) / 2);
  };

  return (
    <View>
      <Pressable
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        onPress={handlePress}
        className="h-7 justify-center"
      >
        <View className="h-1.5 rounded-full bg-border overflow-hidden">
          <View style={{ width: `${ratio * 100}%` }} className="h-full bg-primary" />
        </View>
        <View
          style={{ left: `${ratio * 100}%`, marginLeft: -9 }}
          className="absolute w-[18px] h-[18px] rounded-full bg-white border-2 border-primary"
        />
      </Pressable>
      <View className="mt-1 flex-row justify-between">
        <Text className="font-mono-medium text-[10px] text-muted-light">1 km</Text>
        <Text className="font-mono-medium text-[10px] text-muted-light">nội đô Hà Nội hợp 1–4 km</Text>
        <Text className="font-mono-medium text-[10px] text-muted-light">10 km</Text>
      </View>
    </View>
  );
}

interface RadiusCircleProps {
  valueKm: number;
  color?: string;
}

// Vòng tròn bán kính vẽ trên nền bản đồ giả — kích thước co giãn nhẹ theo bán kính đã chọn.
export function RadiusCircle({ valueKm, color = colors.primary.DEFAULT }: RadiusCircleProps) {
  const size = 70 + valueKm * 14;
  return (
    <View
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: size / 2,
        backgroundColor: `${color}1a`,
        borderWidth: 1.5,
        borderColor: `${color}99`,
      }}
    />
  );
}
