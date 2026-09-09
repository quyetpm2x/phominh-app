import { Pressable, Text, View, type PressableProps } from 'react-native';
import type { ReactNode } from 'react';

type ChipColor = 'green' | 'gold' | 'red' | 'gray' | 'dark';

const BG: Record<ChipColor, string> = {
  green: 'bg-primary-50',
  gold: 'bg-accent-50',
  red: 'bg-danger-50',
  gray: 'bg-cream-surface',
  dark: 'bg-ink',
};

const TEXT: Record<ChipColor, string> = {
  green: 'text-primary',
  gold: 'text-accent-text',
  red: 'text-danger-text',
  gray: 'text-muted',
  dark: 'text-cream',
};

interface ChipProps {
  label: string;
  color?: ChipColor;
  size?: 'sm' | 'md';
}

// Thẻ tag tĩnh (badge/tag trên PostCard) — không bấm được.
export function Chip({ label, color = 'gray', size = 'sm' }: ChipProps) {
  const pad = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1';
  const text = size === 'sm' ? 'text-[11px]' : 'text-xs';
  return (
    <View className={`rounded-md ${BG[color]} ${pad}`}>
      <Text className={`font-sans-semibold ${text} ${TEXT[color]}`}>{label}</Text>
    </View>
  );
}

interface FilterChipProps extends PressableProps {
  label: string;
  selected?: boolean;
  filled?: boolean;
  icon?: ReactNode;
}

// Chip bấm được (loại bài trong bộ lọc, chip trạng thái nhanh...).
export function FilterChip({ label, selected, filled = false, icon, ...props }: FilterChipProps) {
  return (
    <Pressable
      className={`flex-row items-center justify-center gap-1.5 rounded-full border px-3.5 py-2 ${
        selected
          ? filled
            ? 'border-primary bg-primary'
            : 'border-primary bg-primary-50'
          : 'border-border bg-white'
      }`}
      {...props}
    >
      {icon}
      <Text
        className={`font-sans-semibold text-xs ${selected ? (filled ? 'text-white' : 'text-primary') : 'text-ink'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
