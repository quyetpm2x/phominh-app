import { StyleSheet, Text, View } from 'react-native';
import { Toggle } from '../../components/ui/Toggle';
import { SettingsSection } from '../settings/SettingsSection';
import type { NotificationPreferences } from './preferences';
export function InteractionSettings({
  preferences,
  disabled,
  onChange,
}: {
  preferences: NotificationPreferences;
  disabled: boolean;
  onChange: (patch: Partial<NotificationPreferences>) => void;
}) {
  return (
    <SettingsSection title="HOẠT ĐỘNG TƯƠNG TÁC" titleStyle={styles.heading}>
      {(
        [
          ['comments', 'Bình luận trên bài của tôi', 'Nhận thông báo khi có hàng xóm phản hồi'],
          ['mentions', 'Tin nhắn riêng & nhắc tên', 'Khi ai đó gửi tin hoặc nhắc bạn'],
        ] as const
      ).map(([key, title, subtitle], index) => (
        <View key={key} style={[styles.row, index === 0 && styles.divider]}>
          <View style={styles.copy}>
            <Text className="font-sans-bold" style={styles.title}>
              {title}
            </Text>
            <Text className="font-sans" style={styles.subtitle}>
              {subtitle}
            </Text>
          </View>
          <Toggle
            variant="settings"
            label={title}
            value={preferences[key]}
            disabled={disabled}
            onValueChange={(value) => onChange({ [key]: value })}
          />
        </View>
      ))}
    </SettingsSection>
  );
}
const styles = StyleSheet.create({
  heading: { color: '#4A4A4A' },
  row: { minHeight: 71.25, padding: 15, gap: 12, flexDirection: 'row', alignItems: 'center' },
  divider: { borderBottomWidth: 1, borderBottomColor: '#E9ECEF99' },
  copy: { flex: 1 },
  title: { fontSize: 14, lineHeight: 21, color: '#1A1A1A' },
  subtitle: { fontSize: 11.5, lineHeight: 17.25, color: '#4A4A4A' },
});
