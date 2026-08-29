import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '../../constants/design-tokens';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

interface KeypadProps {
  onPress: (key: string) => void;
}

// Bàn phím số tại chỗ — thiết kế dùng bàn phím riêng thay vì bàn phím hệ điều hành cho màn nhập SĐT/OTP.
// Nút xoá (⌫) tách biệt phong cách — icon + tint đỏ (danger) khi bấm, khớp mockup 2026-08-24.
export function Keypad({ onPress }: KeypadProps) {
  return (
    <View className="flex-row flex-wrap gap-2.5">
      {KEYS.map((key, i) => {
        if (!key) return <View key={`spacer-${i}`} className="h-14 flex-[1_0_30%]" />;
        const isDelete = key === '⌫';
        return (
          <Pressable
            key={key + i}
            onPress={() => onPress(key)}
            className={`h-14 flex-[1_0_30%] items-center justify-center rounded-2xl bg-white border border-border/50 shadow-sm active:scale-95 ${
              isDelete ? 'active:bg-danger/10' : 'active:bg-primary/5'
            }`}
          >
            {isDelete ? (
              <Ionicons name="backspace-outline" size={20} color={colors.muted.DEFAULT} />
            ) : (
              <Text className="font-sans-black text-[21px] text-ink">{key}</Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
