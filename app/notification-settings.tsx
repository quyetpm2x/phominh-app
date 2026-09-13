import { Button } from '../src/components/ui/Button';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsHeader } from '../src/features/settings/SettingsHeader';
import { InteractionSettings } from '../src/features/notification-settings/InteractionSettings';
import { QuietHoursSettings } from '../src/features/notification-settings/QuietHoursSettings';
import { useNotificationPreferences } from '../src/features/notification-settings/useNotificationPreferences';
export default function NotificationSettingsScreen() {
  const { preferences, ready, saving, update, loadError, retry } = useNotificationPreferences();
  return (
    <SafeAreaView style={styles.screen}>
      <SettingsHeader title="Thông báo" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {ready ? (
          <>
            <InteractionSettings
              preferences={preferences}
              disabled={saving}
              onChange={(patch) => void update(patch)}
            />
            <QuietHoursSettings preferences={preferences} saving={saving} update={update} />
            <Text className="font-sans italic" style={styles.note}>
              * Hệ thống vẫn lưu trữ thông báo nhưng sẽ tắt rung & chuông đẩy trong khung giờ bạn đã chọn.
            </Text>
          </>
        ) : loadError ? (
          <Button label="Không tải được cài đặt · Thử lại" onPress={retry} />
        ) : (
          <ActivityIndicator accessibilityLabel="Đang tải cài đặt thông báo" color="#FF416C" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { paddingHorizontal: 20, paddingBottom: 64, gap: 28 },
  note: { fontSize: 11.5, lineHeight: 18, color: '#79716B', paddingHorizontal: 5, marginTop: -12 },
});
