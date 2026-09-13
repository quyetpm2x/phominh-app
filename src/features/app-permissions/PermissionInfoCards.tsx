import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
export function openDeviceSettings() {
  void Linking.openSettings().catch(() =>
    Alert.alert('Không thể mở Cài đặt', 'Vui lòng mở Cài đặt của thiết bị và chọn Phố Mình.'),
  );
}
export function PermissionPrivacyCard() {
  return (
    <View style={styles.privacy}>
      <View style={styles.icon}>
        <CustomIcon name="appPermissionShield" size={15} />
      </View>
      <View style={styles.copy}>
        <Text className="font-sans-bold" style={styles.title}>
          Minh bạch & An toàn quyền riêng tư
        </Text>
        <Text className="font-sans" style={styles.description}>
          Ứng dụng chỉ sử dụng quyền khi bạn thực hiện chức năng tương ứng.
        </Text>
      </View>
    </View>
  );
}
export function DeviceSettingsCard() {
  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <CustomIcon name="appPermissionGear" size={14.76} />
        <Text className="font-sans-bold" style={styles.title}>
          Cài đặt quyền trong máy
        </Text>
      </View>
      <Text className="font-sans" style={styles.description}>
        Nếu bạn từng chọn &quot;Không cho phép lại&quot;, vui lòng mở Cài đặt thiết bị để bật thủ công.
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Mở Cài đặt trên máy"
        style={styles.button}
        onPress={openDeviceSettings}
      >
        <Text className="font-sans-bold" style={styles.buttonText}>
          Mở Cài đặt trên máy
        </Text>
        <CustomIcon name="appPermissionExternal" size={14} />
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  privacy: {
    backgroundColor: '#FF416C0D',
    borderWidth: 1,
    borderColor: '#FF416C33',
    borderRadius: 19.56,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    minHeight: 88.875,
  },
  icon: {
    width: 36,
    height: 36,
    marginTop: 2,
    borderRadius: 10,
    backgroundColor: '#FF416C26',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  title: { fontSize: 13, lineHeight: 19.5, color: '#1A1A1A' },
  description: { fontSize: 11.5, lineHeight: 18.688, color: '#4A4A4A' },
  card: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#FFF',
    borderRadius: 19.56,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  heading: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  button: { minHeight: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonText: { fontSize: 12, lineHeight: 18, color: '#1A1A1A' },
});
