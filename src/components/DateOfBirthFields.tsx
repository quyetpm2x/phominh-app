import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { colors } from '../constants/design-tokens';
import { MIN_YEAR, type DateOfBirthParts } from '../lib/dateOfBirth';

interface DateOfBirthFieldsProps {
  value: DateOfBirthParts;
  onChange: (value: DateOfBirthParts) => void;
}

const DEFAULT_DATE = new Date(2000, 0, 1);
const MIN_DATE = new Date(MIN_YEAR, 0, 1);
const MAX_DATE = new Date();

function partsToDate({ day, month, year }: DateOfBirthParts): Date {
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  if (!d || !m || !y) return DEFAULT_DATE;
  return new Date(y, m - 1, d);
}

function dateToParts(date: Date): DateOfBirthParts {
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: String(date.getMonth() + 1).padStart(2, '0'),
    year: String(date.getFullYear()),
  };
}

// Dùng picker lịch GỐC hệ điều hành (@react-native-community/datetimepicker) — tự biết tháng nào
// 28/29/30/31 ngày (kể cả năm nhuận). iOS dùng display="compact": 1 view native TRONG SUỐT (opacity
// 0) phủ kín ô hiển thị của mình — chạm vào, hệ điều hành tự mở popover lịch NỔI ĐÈ lên màn hình,
// không chiếm chỗ trong layout, không cần tự quản lý mở/đóng hay nút "Xong". Bản trước dùng
// display="inline" render THẲNG vào luồng layout khiến ô lịch chiếm hết chỗ, đẩy nội dung phía dưới
// ra ngoài vùng nhìn thấy mà ScrollView ngoài không cuộn tới được. Android dùng display="default" —
// vốn đã là dialog hệ thống nổi đè sẵn, không đổi.
export function DateOfBirthFields({ value, onChange }: DateOfBirthFieldsProps) {
  const [androidOpen, setAndroidOpen] = useState(false);
  const date = partsToDate(value);
  const isComplete = value.day && value.month && value.year;
  const displayText = isComplete ? `${value.day}/${value.month}/${value.year}` : 'DD/MM/YYYY';

  const onChangeNative = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setAndroidOpen(false);
    if ((Platform.OS === 'ios' || event.type === 'set') && selectedDate) onChange(dateToParts(selectedDate));
  };

  return (
    <View style={{ position: 'relative' }}>
      <Pressable
        onPress={() => {
          if (Platform.OS === 'android') setAndroidOpen(true);
        }}
        className={`h-12 flex-row items-center gap-2.5 rounded-xl border bg-white px-4 ${
          androidOpen ? 'border-primary' : 'border-gray-350'
        }`}
      >
        <Ionicons name="calendar" size={16} color={colors.muted.DEFAULT} />
        <Text className={`text-base ${isComplete ? 'font-sans-semibold text-ink' : 'text-muted-light'}`}>
          {displayText}
        </Text>
      </Pressable>

      {Platform.OS === 'ios' ? (
        <DateTimePicker
          value={date}
          mode="date"
          display="compact"
          maximumDate={MAX_DATE}
          minimumDate={MIN_DATE}
          locale="vi-VN"
          onChange={onChangeNative}
          // opacity phải > 0 — iOS bỏ qua hit-test cho UIDatePicker (compact) khi alpha đúng bằng 0,
          // 0.011 đủ nhỏ để mắt thường không thấy nhưng vẫn nhận được chạm.
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.011 }}
        />
      ) : null}

      {Platform.OS === 'android' && androidOpen ? (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          maximumDate={MAX_DATE}
          minimumDate={MIN_DATE}
          onChange={onChangeNative}
        />
      ) : null}
    </View>
  );
}
