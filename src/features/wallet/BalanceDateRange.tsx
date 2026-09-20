import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { FilterChip } from '../../components/ui/Chip';
import { LegalCard } from '../legal/LegalCard';
import {
  dateLabel,
  dateRangeDays,
  periodDates,
  type BalanceOptions,
  type BalancePeriod,
} from './balanceFilterOptions';
export function BalanceDateRange({
  value,
  onChange,
}: {
  value: BalanceOptions;
  onChange: (value: BalanceOptions) => void;
}) {
  const [editing, setEditing] = useState<'from' | 'to' | null>(null);
  return (
    <LegalCard style={styles.card}>
      <View style={styles.heading}>
        <CustomIcon name="balanceFilterCalendar" size={14} />
        <Text className="font-sans-bold" style={styles.headingText}>
          KHOẢNG THỜI GIAN
        </Text>
      </View>
      <View style={styles.grid}>
        {(
          [
            ['month', 'Tháng này'],
            ['previous', 'Tháng trước'],
            ['quarter', '3 tháng qua'],
            ['custom', 'Tùy chỉnh'],
          ] as const
        ).map(([key, label]) => (
          <LinearGradient
            key={key}
            colors={key === value.period ? ['#FF416C', '#FF4B2B'] : ['#FFF', '#FFF']}
            style={styles.half}
          >
            <FilterChip
              label={label}
              filled
              selected={value.period === key}
              accessibilityRole="radio"
              accessibilityState={{ selected: value.period === key }}
              icon={
                key === 'custom' && value.period === key ? (
                  <CustomIcon name="balanceFilterCustom" size={12} />
                ) : undefined
              }
              style={[styles.option, value.period === key && styles.selected]}
              onPress={() => {
                setEditing(null);
                onChange({
                  ...value,
                  period: key as BalancePeriod,
                  ...(key === 'custom' ? {} : periodDates(key)),
                });
              }}
            />
          </LinearGradient>
        ))}
      </View>
      {value.period === 'custom' ? (
        <View style={styles.custom}>
          <View style={styles.between}>
            <Text className="font-sans-semibold" style={styles.caption}>
              Chọn khoảng ngày cụ thể
            </Text>
            <Text className="font-sans-bold" style={styles.days}>
              {dateRangeDays(value.from, value.to) > 0
                ? `${dateRangeDays(value.from, value.to)} ngày`
                : 'Ngày không hợp lệ'}
            </Text>
          </View>
          <View style={styles.dates}>
            {(['from', 'to'] as const).map((key, index) => (
              <View key={key} style={styles.dateWrapper}>
                {index === 1 ? <CustomIcon name="balanceFilterArrow" size={12} /> : null}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${key === 'from' ? 'Từ ngày' : 'Đến ngày'} ${dateLabel(value[key])}`}
                  onPress={() => setEditing(editing === key ? null : key)}
                  style={styles.date}
                >
                  <CustomIcon name="balanceFilterDate" size={14} />
                  <View style={styles.dateCopy}>
                    <Text className="font-sans-bold" style={styles.dateLabel}>
                      {key === 'from' ? 'TỪ NGÀY' : 'ĐẾN NGÀY'}
                    </Text>
                    <Text className="font-sans-bold" style={styles.dateValue}>
                      {dateLabel(value[key])}
                    </Text>
                  </View>
                </Pressable>
              </View>
            ))}
          </View>
          {editing ? (
            <DateTimePicker
              value={new Date(`${value[editing]}T12:00:00`)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              locale="vi-VN"
              onChange={(event, date) => {
                if (Platform.OS !== 'ios') setEditing(null);
                if (event.type === 'set' && date) {
                  const local = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                  onChange({ ...value, [editing]: local });
                }
              }}
            />
          ) : null}
        </View>
      ) : null}
    </LegalCard>
  );
}
const styles = StyleSheet.create({
  card: {
    padding: 14,
    gap: 12,
    backgroundColor: '#F1F3F54D',
    borderColor: '#E9ECEFB3',
    shadowOpacity: 0,
    elevation: 0,
  },
  heading: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  headingText: { fontSize: 11.5, lineHeight: 17.25, letterSpacing: 0.575, color: '#1A1A1A' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  half: { width: '48.7%', flexGrow: 1, borderRadius: 9.444 },
  option: {
    height: 34,
    paddingVertical: 0,
    paddingHorizontal: 4,
    borderRadius: 9.444,
    backgroundColor: 'transparent',
    borderColor: '#E9ECEF',
  },
  selected: { borderColor: 'transparent' },
  custom: { borderTopWidth: 1, borderTopColor: '#E9ECEF80', paddingTop: 5, gap: 6 },
  between: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  caption: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  days: { fontSize: 10, lineHeight: 15, color: '#FF416C' },
  dates: { flexDirection: 'row', gap: 8 },
  dateWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  date: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12.639,
    borderWidth: 1,
    borderColor: '#FF416C66',
    backgroundColor: '#FFF',
  },
  dateCopy: { flex: 1, gap: 2 },
  dateLabel: { fontSize: 9.5, lineHeight: 12, color: '#4A4A4A' },
  dateValue: { fontSize: 12, lineHeight: 16, color: '#1A1A1A' },
});
