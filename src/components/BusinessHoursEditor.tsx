import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import type { DayBusinessHour } from '../api/endpoints/merchants';
import { FilterChip } from './ui/Chip';

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Thứ Hai..Chủ nhật, thứ tự quen mắt hơn 0..6
const DAY_LABELS: Record<number, string> = {
  0: 'Chủ nhật',
  1: 'Thứ Hai',
  2: 'Thứ Ba',
  3: 'Thứ Tư',
  4: 'Thứ Năm',
  5: 'Thứ Sáu',
  6: 'Thứ Bảy',
};
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

interface BusinessHoursEditorProps {
  value: DayBusinessHour[];
  onChange: (value: DayBusinessHour[]) => void;
}

// Lịch giờ hiện SĐT/Zalo THEO TỪNG NGÀY trong tuần (tai-lieu-chuc-nang.md #43) — mỗi ngày bật/tắt
// riêng + chọn giờ mở/đóng tự do (không giới hạn preset cố định). Tách khỏi quick-update.tsx (giữ
// file dưới 250 dòng theo quy ước dự án) vì đủ phức tạp để là 1 component riêng.
export function BusinessHoursEditor({ value, onChange }: BusinessHoursEditorProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const dayOf = (d: number) => value.find((h) => h.dayOfWeek === d);

  const toggleDay = (d: number) => {
    if (dayOf(d)) {
      onChange(value.filter((h) => h.dayOfWeek !== d));
      if (expandedDay === d) setExpandedDay(null);
    } else {
      onChange([...value, { dayOfWeek: d, startTime: '08:00', endTime: '20:00' }]);
      setExpandedDay(d);
    }
  };

  const updateDay = (d: number, patch: Partial<DayBusinessHour>) => {
    onChange(value.map((h) => (h.dayOfWeek === d ? { ...h, ...patch } : h)));
  };

  return (
    <View className="gap-2">
      {DAY_ORDER.map((d) => {
        const day = dayOf(d);
        return (
          <View key={d} className="rounded-[13px] border border-border bg-white overflow-hidden">
            <Pressable
              onPress={() => (day ? setExpandedDay(expandedDay === d ? null : d) : toggleDay(d))}
              className="px-3.5 py-3 flex-row items-center gap-3"
            >
              <View className={`w-11 h-6 rounded-full p-0.5 ${day ? 'bg-primary' : 'bg-border'}`}>
                <View className={`w-5 h-5 rounded-full bg-white ${day ? 'ml-5' : 'ml-0'}`} />
              </View>
              <Text className="flex-1 font-sans-semibold text-[13.5px] text-ink">{DAY_LABELS[d]}</Text>
              {day ? (
                <Text className="font-mono-semibold text-[12.5px] text-ink">
                  {day.startTime}–{day.endTime}
                </Text>
              ) : (
                <Text className="text-xs text-muted">Đóng cửa</Text>
              )}
            </Pressable>

            {day && expandedDay === d ? (
              <View className="px-3.5 pb-3.5 gap-2.5 border-t border-border-soft pt-3">
                <TimeField label="Giờ mở" value={day.startTime} onChange={(v) => updateDay(d, { startTime: v })} />
                <TimeField label="Giờ đóng" value={day.endTime} onChange={(v) => updateDay(d, { endTime: v })} />
                <Pressable onPress={() => toggleDay(d)} className="self-start mt-0.5">
                  <Text className="text-xs text-danger-text">Đóng cửa ngày này</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function TimeField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [hour, minute] = value.split(':');
  return (
    <View>
      <Text className="text-[11px] text-muted mb-1">{label}</Text>
      <ScrollChipRow options={HOURS} selected={hour} onSelect={(h) => onChange(`${h}:${minute}`)} />
      <View className="mt-1.5">
        <ScrollChipRow options={MINUTES} selected={minute} onSelect={(m) => onChange(`${hour}:${m}`)} />
      </View>
    </View>
  );
}

function ScrollChipRow({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-1.5">
        {options.map((o) => (
          <FilterChip key={o} label={o} selected={selected === o} onPress={() => onSelect(o)} />
        ))}
      </View>
    </ScrollView>
  );
}
