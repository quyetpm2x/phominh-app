import { Pressable, View } from 'react-native';

export function Toggle({
  value,
  onValueChange,
  label,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      hitSlop={10}
      onPress={() => onValueChange(!value)}
      className={`h-6 w-10 justify-center rounded-full px-0.5 ${value ? 'bg-primary' : 'bg-[#D1D5DB]'}`}
    >
      <View className={`h-5 w-5 rounded-full bg-white ${value ? 'self-end' : 'self-start'}`} />
    </Pressable>
  );
}
