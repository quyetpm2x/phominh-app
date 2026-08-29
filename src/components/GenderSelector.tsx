import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '../constants/design-tokens';

export type Gender = 'male' | 'female' | 'other';

const OPTIONS: { value: Gender; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'male', label: 'Nam', icon: 'male' },
  { value: 'female', label: 'Nữ', icon: 'female' },
  { value: 'other', label: 'Khác', icon: 'sparkles' },
];

// Restyle theo mockup "Thông tin cá nhân" (2026-08-25) — lưới 3 cột đều nhau kèm icon, thay cho
// FilterChip dạng pill không icon trước đó. Dùng ở cả personal-info.tsx (onboarding) và
// profile/edit.tsx — đổi style ở đây ảnh hưởng cả 2 nơi, đồng bộ theo đúng tinh thần rebrand.
export function GenderSelector({
  value,
  onChange,
}: {
  value: Gender | null;
  onChange: (value: Gender) => void;
}) {
  return (
    <View className="flex-row gap-2">
      {OPTIONS.map((o) => {
        const selected = value === o.value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border py-2.5 px-3 ${
              selected ? 'border-primary bg-primary-50' : 'border-border bg-white'
            }`}
          >
            <Ionicons name={o.icon} size={14} color={selected ? colors.primary.DEFAULT : colors.muted.DEFAULT} />
            <Text className={`font-sans-bold text-xs ${selected ? 'text-primary' : 'text-muted'}`}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
