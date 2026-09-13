import { Pressable, StyleSheet, Text, View } from 'react-native';
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
  variant?: 'underline' | 'segmented';
}

// Tab gạch chân (Nhà / Chỗ làm / Quanh đây trong Feed) — đúng {{ tabButtons }} của thiết kế: chữ,
// không nền, tab đang chọn có gạch chân màu primary và chữ đậm hơn.
export function UnderlineTabs<T extends string>({
  options,
  value,
  onChange,
  compact = false,
  variant = 'underline',
}: UnderlineTabsProps<T>) {
  if (variant === 'segmented')
    return (
      <View style={styles.segmented}>
        {options.map((option) => (
          <Pressable
            key={option.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: value === option.key }}
            style={[styles.segment, value === option.key && styles.active]}
            onPress={() => onChange(option.key)}
          >
            <Text
              className="font-sans-bold"
              style={[styles.label, value === option.key && styles.activeLabel]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    );
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

const styles = StyleSheet.create({
  segmented: {
    height: 40,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#FFFFFF80',
    borderRadius: 11.1,
    flexDirection: 'row',
  },
  segment: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8.3 },
  active: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  label: { fontSize: 12, lineHeight: 18, color: '#4A4A4A' },
  activeLabel: { color: '#1A1A1A' },
});
