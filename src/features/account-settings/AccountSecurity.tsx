import Constants from 'expo-constants';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { SettingsSection } from '../settings/SettingsSection';
const ROWS = [
  {
    icon: 'accountPhone',
    title: 'Số điện thoại đăng nhập',
    detail: 'Chưa có dữ liệu số điện thoại',
    action: 'Thay đổi',
    kind: 'phone',
    background: '#FF416C1A',
  },
  {
    icon: 'accountGoogle',
    title: 'Tài khoản Google',
    detail: 'Chưa kết nối tài khoản Google',
    action: null,
    kind: 'google',
    background: '#2B7FFF1A',
  },
  {
    icon: 'accountBank',
    title: 'Tài khoản nhận tiền',
    detail: 'Chưa liên kết ngân hàng',
    action: 'Quản lý',
    kind: 'bank',
    background: '#00BC7D1A',
  },
] as const;
export function AccountSecurity({ onSelect }: { onSelect: (kind: 'phone' | 'bank') => void }) {
  return (
    <>
      <SettingsSection title="BẢO MẬT & LIÊN KẾT" titleStyle={accountHeading}>
        {ROWS.map((row, index) => (
          <View key={row.icon} style={[styles.row, index < 2 && styles.divider]}>
            <View style={[styles.icon, { backgroundColor: row.background }]}>
              <CustomIcon name={row.icon} size={16} />
            </View>
            <View style={styles.copy}>
              <Text className="font-sans-bold" style={styles.title}>
                {row.title}
              </Text>
              <Text className="font-sans" style={styles.subtitle}>
                {row.detail}
              </Text>
            </View>
            {row.action ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${row.action} ${row.title.toLowerCase()}`}
                hitSlop={8}
                onPress={() => onSelect(row.kind as 'phone' | 'bank')}
                style={styles.action}
              >
                <Text className="font-sans-bold" style={styles.actionText}>
                  {row.action}
                </Text>
              </Pressable>
            ) : (
              <Text className="font-sans-bold" style={styles.unlinked}>
                Chưa liên kết
              </Text>
            )}
          </View>
        ))}
      </SettingsSection>
      <SettingsSection title="PHIÊN ĐĂNG NHẬP" titleStyle={accountHeading}>
        <View style={styles.row}>
          <View style={styles.icon}>
            <CustomIcon name="accountDevice" size={16} />
          </View>
          <View style={styles.copy}>
            <View style={styles.deviceTitle}>
              <Text className="font-sans-bold" style={[styles.title, styles.shrink]}>
                {Constants.deviceName ||
                  (Platform.OS === 'ios'
                    ? 'Thiết bị iOS'
                    : Platform.OS === 'android'
                      ? 'Thiết bị Android'
                      : 'Trình duyệt web')}
              </Text>
              <View style={styles.dot} />
            </View>
            <Text className="font-sans" style={styles.subtitle}>
              Thiết bị này
            </Text>
          </View>
          <Text className="font-sans-bold" style={styles.status}>
            Đang hoạt động
          </Text>
        </View>
      </SettingsSection>
    </>
  );
}
export const accountHeading = {
  fontSize: 11,
  lineHeight: 16.5,
  letterSpacing: 0.55,
  color: '#4A4A4A',
  paddingLeft: 1.5,
};
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#E9ECEF' },
  icon: { width: 32, height: 32, borderRadius: 8.444, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1 },
  title: { fontSize: 13, lineHeight: 19.5, color: '#1A1A1A' },
  subtitle: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  action: { backgroundColor: '#FF416C1A', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7.014 },
  actionText: { fontSize: 11.5, lineHeight: 17.25, color: '#FF416C' },
  unlinked: {
    fontSize: 11,
    lineHeight: 16.5,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 2.222,
    backgroundColor: '#F1F3F5',
    color: '#4A4A4A',
  },
  deviceTitle: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  shrink: { flexShrink: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00BC7D' },
  status: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
});
