import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/ui/Button';
import { CustomIcon } from '../src/components/ui/CustomIcon';
import { useAccountLogout } from '../src/features/account-settings/useAccountLogout';
import { DeletionSentDetails } from '../src/features/delete-account/DeletionSentDetails';
import { DeletionSentHero } from '../src/features/delete-account/DeletionSentHero';
export default function DeleteAccountSentScreen() {
  const { loggingOut, logout } = useAccountLogout();
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.status}>
          <CustomIcon name="deletionSentStatus" size={14} />
          <Text className="font-sans-bold" style={styles.statusText}>
            Trạng thái: Đang chờ xoá
          </Text>
        </View>
        <View style={styles.main}>
          <DeletionSentHero />
          <DeletionSentDetails />
        </View>
        <View style={styles.footer}>
          <Button
            accessibilityRole="button"
            label={loggingOut ? 'Đang đăng xuất…' : 'Đăng xuất ngay về màn hình chính'}
            disabled={loggingOut}
            onPress={() => void logout()}
            trailingIcon={<CustomIcon name="deletionSentLogout" size={16} />}
            style={styles.logout}
            labelStyle={styles.logoutText}
          />
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Liên hệ bộ phận hỗ trợ khách hàng"
            onPress={() => router.push('/help-faq')}
          >
            <Text className="font-sans" style={styles.support}>
              Mọi thắc mắc xin liên hệ bộ phận hỗ trợ khách hàng
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  preview: {
    marginHorizontal: 24,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  previewText: { flex: 1, fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  close: { paddingVertical: 8, color: '#FF416C', fontSize: 12 },
  content: { flexGrow: 1, padding: 24, paddingTop: 32 },
  status: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 30,
    backgroundColor: '#E639461A',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusText: { fontSize: 11, lineHeight: 16.5, color: '#E63946' },
  main: { flexGrow: 1, justifyContent: 'center', paddingTop: 68, paddingBottom: 48, gap: 24 },
  footer: { gap: 12, paddingBottom: 8 },
  logout: {
    minHeight: 48,
    height: 'auto',
    paddingVertical: 13.5,
    paddingHorizontal: 12,
    borderRadius: 13.333,
    flexDirection: 'row',
    gap: 8,
  },
  logoutText: {
    flexShrink: 1,
    textAlign: 'center',
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 14,
    lineHeight: 21,
  },
  support: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A', textAlign: 'center' },
});
