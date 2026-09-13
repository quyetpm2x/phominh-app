import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsHeader } from '../src/features/settings/SettingsHeader';
import { useDevicePermissions } from '../src/hooks/useDevicePermissions';
import { PERMISSION_ITEMS } from '../src/features/app-permissions/data';
import { PermissionRow } from '../src/features/app-permissions/PermissionRow';
import {
  DeviceSettingsCard,
  PermissionPrivacyCard,
  openDeviceSettings,
} from '../src/features/app-permissions/PermissionInfoCards';
export default function AppPermissionsScreen() {
  const { permissions, pending, request } = useDevicePermissions();
  return (
    <SafeAreaView style={styles.screen}>
      <SettingsHeader title="Quyền ứng dụng" compact badge="Bảo mật" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PermissionPrivacyCard />
        <View style={styles.section}>
          <Text accessibilityRole="header" className="font-sans-black" style={styles.heading}>
            DANH SÁCH QUYỀN HỆ THỐNG
          </Text>
          <View style={styles.list}>
            {PERMISSION_ITEMS.map((item, index) => (
              <PermissionRow
                key={item.key}
                item={item}
                permission={permissions[item.key]}
                pending={pending === item.key}
                disabled={pending !== null}
                last={index === PERMISSION_ITEMS.length - 1}
                onPress={() =>
                  permissions[item.key]?.granted ? openDeviceSettings() : void request(item.key)
                }
              />
            ))}
          </View>
        </View>
        <DeviceSettingsCard />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { padding: 16, paddingBottom: 48, gap: 16 },
  section: { gap: 8 },
  heading: { fontSize: 11, lineHeight: 16.5, letterSpacing: 0.55, color: '#4A4A4A', paddingLeft: 1.5 },
  list: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 19.56,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },
});
