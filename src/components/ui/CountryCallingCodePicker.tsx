import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { colors } from '../../constants/design-tokens';
import type { PhoneCountry } from '../../constants/phone-countries';
import { BottomSheet } from './BottomSheet';

interface CountryCallingCodePickerProps {
  value: PhoneCountry;
  options: PhoneCountry[];
  onChange: (country: PhoneCountry) => void;
}

export function CountryCallingCodePicker({ value, options, onChange }: CountryCallingCodePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="flex-row items-center gap-2 rounded-xl border border-border/70 bg-cream-surface/70 px-3 py-2.5 shrink-0 active:scale-95"
      >
        <Text className="text-base">{value.flag}</Text>
        <Text className="font-mono-bold text-sm text-ink">+{value.callingCode}</Text>
        <Ionicons name="chevron-down" size={16} color={colors.muted.DEFAULT} />
      </Pressable>

      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        <View className="mb-4">
          <Text className="font-sans-bold text-base text-ink">Chon ma quoc gia</Text>
          <Text className="mt-1 text-sm text-muted">Chon dau so phu hop voi so dien thoai ban muon xac thuc.</Text>
        </View>

        <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
          {options.map((option, index) => {
            const selected = option.iso2 === value.iso2;
            return (
              <Pressable
                key={option.iso2}
                onPress={() => {
                  setOpen(false);
                  onChange(option);
                }}
                className={`flex-row items-center justify-between py-3 ${index < options.length - 1 ? 'border-b border-border-soft' : ''}`}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-xl">{option.flag}</Text>
                  <View>
                    <Text className="font-sans-semibold text-[15px] text-ink">{option.name}</Text>
                    <Text className="mt-0.5 text-xs text-muted">+{option.callingCode} · VD {option.example}</Text>
                  </View>
                </View>
                {selected ? <Ionicons name="checkmark-circle" size={20} color={colors.primary.DEFAULT} /> : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </BottomSheet>
    </>
  );
}
