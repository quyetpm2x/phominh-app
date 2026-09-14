import { useState } from 'react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Button } from '../../components/ui/Button';
import { LOCAL_SIGN_IN_KEY } from '../../lib/personalProfile';
import { usePostInteractions } from '../home/postInteractions';

const details = {
  account: [
    'Đăng xuất & Xoá tài khoản',
    'Đăng xuất khỏi thiết bị này. Chức năng xoá tài khoản chưa được kết nối với máy chủ.',
  ],
} as const;
export type SettingsSheet = keyof typeof details;
export function SettingsSheets({ sheet, onClose }: { sheet: SettingsSheet | null; onClose: () => void }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const logout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await SecureStore.deleteItemAsync(LOCAL_SIGN_IN_KEY);
      usePostInteractions.getState().reset();
      onClose();
      router.replace('/(auth)/welcome');
    } catch {
      Alert.alert('Chưa đăng xuất được', 'Vui lòng thử lại.');
    } finally {
      setLoggingOut(false);
    }
  };
  return (
    <BottomSheet visible={sheet !== null} onClose={onClose} variant="actions">
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" className="font-sans-bold text-lg text-ink">
          {sheet ? details[sheet][0] : ''}
        </Text>
        <Text className="font-sans text-sm text-muted">{sheet ? details[sheet][1] : ''}</Text>
        {sheet === 'account' ? (
          <Button
            label="Đăng xuất"
            disabled={loggingOut}
            onPress={() =>
              Alert.alert('Đăng xuất?', 'Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng.', [
                { text: 'Huỷ', style: 'cancel' },
                { text: 'Đăng xuất', style: 'destructive', onPress: () => void logout() },
              ])
            }
          />
        ) : null}
        <View>
          <Button label="Đóng" variant="outline" onPress={onClose} />
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({ content: { gap: 16, paddingVertical: 16 } });
