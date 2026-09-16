import { SettingsHeader } from '../src/features/settings/SettingsHeader';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomIcon } from '../src/components/ui/CustomIcon';
import { SettingsRow, SettingsSection } from '../src/features/settings/SettingsSection';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <SettingsHeader title="Cài đặt" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <SettingsSection title="CHUNG">
          <SettingsRow
            icon="settingsBell"
            title="Thông báo"
            subtitle="Tần suất, giờ yên tĩnh"
            tone="pink"
            onPress={() => router.push('/notification-settings')}
          />
          <SettingsRow
            icon="settingsLanguage"
            title="Ngôn ngữ"
            subtitle="Tiếng Việt"
            tone="orange"
            badge="default"
          />
          <SettingsRow
            icon="settingsPermissions"
            title="Quyền ứng dụng & Vị trí"
            subtitle={'GPS, Thông báo, Camera,\nMicrophone'}
            tone="pink"
            badge="manage"
            last
            onPress={() => router.push('/app-permissions')}
          />
        </SettingsSection>
        <SettingsSection title="QUYỀN RIÊNG TƯ">
          <SettingsRow
            icon="settingsStar"
            title="Người quen ưu tiên"
            onPress={() => router.push('/priority-neighbors')}
          />
          <SettingsRow
            icon="settingsHidden"
            title="Danh sách không quan tâm"
            onPress={() => router.push('/hidden-items')}
          />
          <SettingsRow
            icon="settingsPrivacy"
            title="Chính sách quyền riêng tư"
            onPress={() => router.push('/privacy-settings')}
          />
          <SettingsRow
            icon="settingsTerms"
            title="Điều khoản sử dụng"
            last
            onPress={() => router.push('/(auth)/terms-of-use')}
          />
        </SettingsSection>
        <SettingsSection title="HỖ TRỢ">
          <SettingsRow
            icon="settingsHelp"
            title="Trung tâm trợ giúp"
            onPress={() => router.push('/help-faq')}
          />
          <SettingsRow icon="settingsInfo" title="Về ứng dụng" last onPress={() => router.push('/about')} />
        </SettingsSection>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Đăng xuất và xoá tài khoản"
          style={styles.account}
          onPress={() => router.push('/account-settings')}
        >
          <CustomIcon name="settingsLogout" size={18} />
          <Text className="font-sans-black" style={styles.accountText}>
            ĐĂNG XUẤT & XOÁ TÀI KHOẢN
          </Text>
        </Pressable>
        <View style={styles.footer}>
          <Text className="font-sans-bold" style={styles.version}>
            PHỐ MÌNH VERSION {Constants.expoConfig?.version ?? '1.0.0'}
          </Text>
          <Text className="font-sans" style={styles.credit}>
            Made with ♥ for the neighborhood
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { paddingHorizontal: 20, paddingBottom: 64, gap: 24 },
  account: {
    minHeight: 64.5,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E6394633',
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  accountText: { fontSize: 15, lineHeight: 22.5, color: '#E63946', flexShrink: 1, textAlign: 'center' },
  footer: { alignItems: 'center', gap: 8, paddingTop: 24 },
  version: { fontSize: 11, lineHeight: 17, letterSpacing: 1.1, color: '#A8A29E' },
  credit: { fontSize: 10, lineHeight: 15, color: '#D6D3D1' },
});
