import { Text, View } from 'react-native';

import { type DateOfBirthParts } from '../lib/dateOfBirth';
import { TextInput } from './ui/TextInput';

interface DateOfBirthFieldsProps {
  value: DateOfBirthParts;
  onChange: (value: DateOfBirthParts) => void;
}

// 3 ô Ngày/Tháng/Năm thay vì native date picker — tránh thêm dependency native mới (cần rebuild
// dev client), ghép lại thành ISO date qua toIsoDate() (src/lib/dateOfBirth.ts).
export function DateOfBirthFields({ value, onChange }: DateOfBirthFieldsProps) {
  return (
    <View className="flex-row gap-2.5">
      <View className="flex-1">
        <Text className="mb-1 text-xs text-muted">Ngày</Text>
        <TextInput
          value={value.day}
          onChangeText={(day) => onChange({ ...value, day })}
          placeholder="DD"
          keyboardType="number-pad"
          maxLength={2}
        />
      </View>
      <View className="flex-1">
        <Text className="mb-1 text-xs text-muted">Tháng</Text>
        <TextInput
          value={value.month}
          onChangeText={(month) => onChange({ ...value, month })}
          placeholder="MM"
          keyboardType="number-pad"
          maxLength={2}
        />
      </View>
      <View className="flex-[1.4]">
        <Text className="mb-1 text-xs text-muted">Năm</Text>
        <TextInput
          value={value.year}
          onChangeText={(year) => onChange({ ...value, year })}
          placeholder="YYYY"
          keyboardType="number-pad"
          maxLength={4}
        />
      </View>
    </View>
  );
}
