import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';
import { ActionSheetMenu } from '../../components/ui/ActionSheetMenu';

const DATE_RANGES = [7, 14, 30] as const;
export type ShopDateRange = (typeof DATE_RANGES)[number];

export function ShopDateRangeSelect({
  value,
  onChange,
}: {
  value: ShopDateRange;
  onChange: (value: ShopDateRange) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Khoảng thời gian: ${value} ngày qua`}
        accessibilityHint="Mở danh sách chọn khoảng thời gian"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(true)}
        hitSlop={8}
        className="flex-row items-center gap-1 rounded-lg border border-[#E9ECEF] bg-white px-2 py-2"
      >
        <Ionicons name="calendar-outline" size={12} color="#FF416C" />
        <Text className="font-sans-bold text-[10px] text-[#1A1A1A]">{value} ngày qua</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={12} color="#4A4A4A" />
      </Pressable>
      <ActionSheetMenu
        visible={open}
        onClose={() => setOpen(false)}
        title="Chọn khoảng thời gian"
        headerIcon={<Ionicons name="calendar-outline" size={18} color="#FF416C" />}
        items={DATE_RANGES.map((days) => ({
          label: `${days} ngày qua`,
          description: value === days ? 'Đang chọn' : undefined,
          icon: (
            <Ionicons
              name={value === days ? 'checkmark-circle' : 'ellipse-outline'}
              size={20}
              color={value === days ? '#FF416C' : '#A0A0A0'}
            />
          ),
          onPress: () => onChange(days),
        }))}
      />
    </>
  );
}
