import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View, type GestureResponderEvent } from 'react-native';

import { colors } from '../../constants/design-tokens';

const MIN_KM = 1;
const MAX_KM = 10;

interface RadiusSliderProps {
  valueKm: number;
  onChange: (km: number) => void;
  minKm?: number;
  maxKm?: number;
  variant?: 'default' | 'home';
  stepKm?: number;
  color?: string;
}

// Thanh trượt bán kính liên tục (chạm vào track để đặt giá trị gần nhất) — đúng dạng track + chấm
// kéo của thiết kế gốc, thay cho dãy nút bước rời rạc trước đây.
export function RadiusSlider({
  valueKm,
  onChange,
  minKm = MIN_KM,
  maxKm = MAX_KM,
  variant = 'default',
  stepKm = 0.5,
  color = colors.primary.DEFAULT,
}: RadiusSliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const ratio = Math.min(1, Math.max(0, (valueKm - minKm) / (maxKm - minKm)));

  const handlePress = (e: GestureResponderEvent) => {
    if (!trackWidth) return;
    const x = Math.min(trackWidth, Math.max(0, e.nativeEvent.locationX));
    const next = minKm + (x / trackWidth) * (maxKm - minKm);
    onChange(Math.min(maxKm, Math.max(minKm, Number((Math.round(next / stepKm) * stepKm).toFixed(3)))));
  };

  return (
    <View>
      <View
        accessibilityRole="adjustable"
        accessibilityLabel="Bán kính xem tin"
        // Fabric requires integer range values. Use meters while announcing kilometers.
        accessibilityValue={{
          min: Math.round(minKm * 1000),
          max: Math.round(maxKm * 1000),
          now: Math.round(valueKm * 1000),
          text: `${valueKm} km`,
        }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(event) =>
          onChange(
            Math.min(
              maxKm,
              Math.max(
                minKm,
                Number(
                  (valueKm + (event.nativeEvent.actionName === 'increment' ? stepKm : -stepKm)).toFixed(3),
                ),
              ),
            ),
          )
        }
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={handlePress}
        onResponderMove={handlePress}
        className="h-11 justify-center"
      >
        <View
          pointerEvents="none"
          className={
            variant === 'home'
              ? 'h-2.5 rounded-full bg-stone-100 overflow-hidden'
              : 'h-1.5 rounded-full bg-border overflow-hidden'
          }
        >
          <LinearGradient
            colors={[color, colors.accent.DEFAULT]}
            style={{ width: `${ratio * 100}%`, height: '100%', borderRadius: 8 }}
          />
        </View>
        {variant === 'default' ? (
          <View
            pointerEvents="none"
            style={{ left: `${ratio * 100}%`, marginLeft: -9, borderColor: color }}
            className="absolute w-[18px] h-[18px] rounded-full bg-white border-2 border-primary"
          />
        ) : null}
      </View>
      <View className="mt-1 flex-row justify-between">
        <Text className="font-sans-black text-[9px] tracking-[0.9px] text-muted">
          {variant === 'home' ? `GẦN (${minKm.toFixed(1)}KM)` : `${minKm} km`}
        </Text>
        {variant === 'default' ? (
          <Text className="font-mono-medium text-[10px] text-muted-light">nội đô Hà Nội hợp 1–4 km</Text>
        ) : null}
        <Text className="font-sans-black text-[9px] tracking-[0.9px] text-muted">
          {variant === 'home' ? `XA (${maxKm.toFixed(1)}KM)` : `${maxKm} km`}
        </Text>
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
