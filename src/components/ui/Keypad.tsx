import { Pressable, Text, View } from 'react-native';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

interface KeypadProps {
  onPress: (key: string) => void;
}

// Bàn phím số tại chỗ — thiết kế dùng bàn phím riêng thay vì bàn phím hệ điều hành cho màn nhập SĐT/OTP.
export function Keypad({ onPress }: KeypadProps) {
  return (
    <View className="flex-row flex-wrap gap-2.5">
      {KEYS.map((key, i) =>
        key ? (
          <Pressable
            key={key + i}
            onPress={() => onPress(key)}
            className="h-14 flex-[1_0_30%] items-center justify-center rounded-2xl bg-white active:bg-cream-surface"
          >
            <Text className="font-sans-semibold text-xl text-ink">{key}</Text>
          </Pressable>
        ) : (
          <View key={`spacer-${i}`} className="h-14 flex-[1_0_30%]" />
        ),
      )}
    </View>
  );
}
