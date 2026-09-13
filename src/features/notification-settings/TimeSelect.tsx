import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { formatTime } from './preferences';
export function TimeSelect({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${formatTime(value)}`}
        accessibilityState={{ disabled }}
        disabled={disabled}
        style={styles.field}
        onPress={() => setOpen(true)}
      >
        <View>
          <Text className="font-sans-bold" style={styles.label}>
            {label}
          </Text>
          <Text className="font-sans-bold" style={styles.time}>
            {formatTime(value)}
          </Text>
        </View>
        <CustomIcon name="quietDown" size={12} />
      </Pressable>
      <BottomSheet visible={open} onClose={() => setOpen(false)} variant="actions">
        <Text accessibilityRole="header" className="font-sans-bold" style={styles.heading}>
          {label === 'BẮT ĐẦU' ? 'Giờ bắt đầu' : 'Giờ kết thúc'}
        </Text>
        <ScrollView
          style={styles.options}
          contentOffset={{ x: 0, y: Math.max(0, Math.floor(value / 15) - 2) * 48 }}
        >
          {Array.from({ length: 96 }, (_, index) => index * 15).map((time) => (
            <Pressable
              key={time}
              accessibilityRole="radio"
              accessibilityState={{ selected: time === value }}
              accessibilityLabel={formatTime(time)}
              style={styles.option}
              onPress={() => {
                onChange(time);
                setOpen(false);
              }}
            >
              <Text className="font-sans-bold" style={styles.time}>
                {formatTime(time)}
              </Text>
              {time === value ? <CustomIcon name="quietCheck" size={16} color="#FF416C" /> : null}
            </Pressable>
          ))}
        </ScrollView>
      </BottomSheet>
    </>
  );
}
const styles = StyleSheet.create({
  field: {
    flex: 1,
    minHeight: 66,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: 'white',
    borderRadius: 8.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: { fontSize: 10, lineHeight: 15, color: '#4A4A4A' },
  time: { fontSize: 14, lineHeight: 21, color: '#1A1A1A' },
  heading: { fontSize: 18, paddingVertical: 16 },
  options: { maxHeight: 350 },
  option: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});
