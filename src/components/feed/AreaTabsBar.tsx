import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { colors } from '../../constants/design-tokens';
import type { AreaKey } from '../../mocks/phoMinh';
import { GradientText } from '../ui/GradientText';

export interface AreaTabOption {
  key: AreaKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface AreaTabsBarProps {
  options: AreaTabOption[];
  value: AreaKey;
  onChange: (key: AreaKey) => void;
}

// Thay UnderlineTabs (3 tab đều nhau) bằng dạng pill có icon, tab active tô gradient chữ + gạch
// chân gradient — theo mockup 2026-08-26. Chỉ dùng riêng ở feed.tsx (UnderlineTabs.tsx không nơi
// nào khác dùng nên không xoá, để dành nếu cần lại kiểu tab thường sau này).
export function AreaTabsBar({ options, value, onChange }: AreaTabsBarProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="flex-row gap-6">
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <Pressable key={opt.key} onPress={() => onChange(opt.key)} className="relative pb-2.5">
            <View className="flex-row items-center gap-1.5">
              <Ionicons name={opt.icon} size={15} color={active ? colors.primary.DEFAULT : colors.muted.light} />
              {active ? (
                <GradientText
                  colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
                  className="text-sm font-sans-bold"
                >
                  {opt.label}
                </GradientText>
              ) : (
                <Text className="text-sm font-sans-semibold text-muted-light">{opt.label}</Text>
              )}
            </View>
            {active ? (
              <LinearGradient
                colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2.5, borderRadius: 2 }}
              />
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
