import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsHeader } from '../src/features/settings/SettingsHeader';
import { Button } from '../src/components/ui/Button';
import { AccountIdentity } from '../src/features/account-settings/AccountIdentity';
import { AccountSecurity } from '../src/features/account-settings/AccountSecurity';
import { AccountActions } from '../src/features/account-settings/AccountActions';
import { AccountSheets, type AccountSheet } from '../src/features/account-settings/AccountSheets';
import { useAccountSettings } from '../src/features/account-settings/useAccountSettings';
export default function AccountSettingsScreen() {
  const { profile, loading, error, retry, loggingOut, logout } = useAccountSettings();
  const [sheet, setSheet] = useState<AccountSheet | null>(null);
  return (
    <SafeAreaView style={styles.screen}>
      <SettingsHeader title="Quản lý & Bảo mật tài khoản" compact whiteBack />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {error ? (
          <View style={styles.error}>
            <Text className="font-sans text-sm text-muted">Chưa tải được hồ sơ.</Text>
            <Button label="Thử lại" variant="outline" onPress={() => void retry()} />
          </View>
        ) : loading ? (
          <Text className="font-sans text-sm text-muted">Đang tải hồ sơ…</Text>
        ) : (
          <AccountIdentity profile={profile} />
        )}
        <AccountSecurity onSelect={setSheet} />
        <AccountActions onLogout={() => setSheet('logout')} onDelete={() => router.push('/delete-account')} />
      </ScrollView>
      <AccountSheets sheet={sheet} onClose={() => setSheet(null)} loggingOut={loggingOut} onLogout={logout} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { padding: 16, paddingBottom: 112, gap: 20 },
  error: { gap: 12 },
});
