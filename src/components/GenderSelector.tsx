import { View } from 'react-native';

import { FilterChip } from './ui/Chip';

export type Gender = 'male' | 'female' | 'other';

const OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
];

export function GenderSelector({
  value,
  onChange,
}: {
  value: Gender | null;
  onChange: (value: Gender) => void;
}) {
  return (
    <View className="flex-row gap-1.5">
      {OPTIONS.map((o) => (
        <FilterChip key={o.value} label={o.label} selected={value === o.value} onPress={() => onChange(o.value)} />
      ))}
    </View>
  );
}
