import { Pressable, Text, View } from 'react-native';

export interface UnderlineTabOption<T extends string> {
  key: T;
  label: string;
}

interface UnderlineTabsProps<T extends string> {
  options: UnderlineTabOption<T>[];
  value: T;
  onChange: (key: T) => void;
}

// Tab gạch chân (Nhà / Chỗ làm / Quanh đây trong Feed) — đúng {{ tabButtons }} của thiết kế: chữ,
// không nền, tab đang chọn có gạch chân màu primary và chữ đậm hơn.
export function UnderlineTabs<T extends string>({ options, value, onChange }: UnderlineTabsProps<T>) {
  return (
    <View className="flex-row gap-5">
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <Pressable key={opt.key} onPress={() => onChange(opt.key)} className="pb-2">
            <Text className={active ? 'font-sans-bold text-[15px] text-ink' : 'font-sans-medium text-[15px] text-muted'}>
              {opt.label}
            </Text>
            <View className={`mt-1.5 h-[2.5px] rounded-full ${active ? 'bg-primary' : 'bg-transparent'}`} />
          </Pressable>
        );
      })}
    </View>
  );
}
