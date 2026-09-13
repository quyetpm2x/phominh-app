import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { GradientSubmitButton } from '../../components/ui/GradientSubmitButton';
import { quietDuration } from './preferences';
import { TimeSelect } from './TimeSelect';
export function CustomQuietHours({
  initialStart,
  initialEnd,
  disabled,
  saving,
  onSave,
}: {
  initialStart: number;
  initialEnd: number;
  disabled: boolean;
  saving: boolean;
  onSave: (start: number, end: number) => Promise<boolean>;
}) {
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);
  const [saved, setSaved] = useState(false);
  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <CustomIcon name="quietClock" size={16} />
        <Text className="font-sans-bold" style={styles.title}>
          Khung giờ tự chọn
        </Text>
        <Text className="font-sans-bold" style={styles.badge}>
          {start === end ? 'Trùng giờ' : `${quietDuration(start, end)} yên tĩnh`}
        </Text>
      </View>
      <View style={styles.fields}>
        <TimeSelect
          label="BẮT ĐẦU"
          value={start}
          disabled={disabled}
          onChange={(value) => {
            setStart(value);
            setSaved(false);
          }}
        />
        <TimeSelect
          label="KẾT THÚC"
          value={end}
          disabled={disabled}
          onChange={(value) => {
            setEnd(value);
            setSaved(false);
          }}
        />
      </View>
      <View style={styles.buttons}>
        <View style={styles.submit}>
          <GradientSubmitButton
            label={saved ? 'Đã lưu khung giờ' : 'Lưu khung giờ'}
            disabled={disabled || start === end}
            loading={saving}
            compact
            vertical
            gradientStyle={styles.gradient}
            labelStyle={styles.submitLabel}
            leadingIcon={<CustomIcon name="quietCheck" size={12} />}
            onPress={() => {
              if (start === end) {
                Alert.alert('Khung giờ chưa hợp lệ', 'Giờ kết thúc cần khác giờ bắt đầu.');
                return;
              }
              void onSave(start, end).then((ok) => {
                if (ok) setSaved(true);
              });
            }}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Đặt lại khung giờ"
          disabled={disabled}
          style={styles.reset}
          onPress={() => {
            setStart(1380);
            setEnd(420);
            setSaved(false);
          }}
        >
          <Text className="font-sans-bold" style={styles.resetText}>
            Đặt lại
          </Text>
        </Pressable>
      </View>
      <View style={styles.tip}>
        <CustomIcon name="quietInfo" size={12} />
        <Text className="font-sans" style={styles.tipText}>
          Nếu chọn <Text className="font-sans-bold">Nghỉ trưa</Text>: tự động áp dụng khung{' '}
          <Text className="font-sans-bold">12:00–13:30</Text>.
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: 1, borderColor: '#E9ECEFCC', padding: 14, gap: 16 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  title: { flex: 1, fontSize: 12, lineHeight: 18, color: '#1A1A1A' },
  badge: {
    fontSize: 11,
    lineHeight: 16.5,
    color: '#FF416C',
    backgroundColor: '#FF416C1A',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10.25,
    overflow: 'hidden',
  },
  fields: { flexDirection: 'row', gap: 10 },
  buttons: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  submit: { flex: 1 },
  gradient: {
    height: 34,
    borderRadius: 8.4,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  submitLabel: { fontSize: 12, lineHeight: 18, letterSpacing: 0 },
  reset: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8.4,
    justifyContent: 'center',
  },
  resetText: { fontSize: 12, color: '#4A4A4A' },
  tip: { flexDirection: 'row', gap: 5, alignItems: 'center', minHeight: 30 },
  tipText: { flex: 1, fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
});
