import { Pressable, Text, View } from 'react-native';
import type { ReactNode } from 'react';

export interface UnderlineTabOption<T extends string> {
  key: T;
  label: string;
  icon?: (active: boolean) => ReactNode;
}

interface UnderlineTabsProps<T extends string> {
  options: UnderlineTabOption<T>[];
  value: T;
  onChange: (key: T) => void;
  compact?: boolean;
}

// Tab gạch chân (Nhà / Chỗ làm / Quanh đây trong Feed) — đúng {{ tabButtons }} của thiết kế: chữ,
// không nền, tab đang chọn có gạch chân màu primary và chữ đậm hơn.
export function UnderlineTabs<T extends string>({
  options,
  value,
  onChange,
  compact = false,
}: UnderlineTabsProps<T>) {
  return (
    <View className={compact ? 'flex-row justify-between gap-3' : 'flex-row gap-5'}>
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            key={opt.key}
            onPress={() => onChange(opt.key)}
            className={compact ? 'shrink pb-2' : 'pb-2'}
          >
            <View className="flex-row items-center gap-1.5">
              {opt.icon?.(active)}
              <Text
                numberOfLines={compact ? 1 : undefined}
                className={
                  compact
                    ? active
                      ? 'shrink font-sans-bold text-sm text-primary'
                      : 'shrink font-sans-semibold text-sm text-muted'
                    : active
                      ? 'font-sans-bold text-[15px] text-ink'
                      : 'font-sans-medium text-[15px] text-muted'
                }
              >
                {opt.label}
              </Text>
            </View>
            <View className={`mt-1.5 h-[2.5px] rounded-full ${active ? 'bg-primary' : 'bg-transparent'}`} />
          </Pressable>
        );
      })}
    </View>
  );
}
