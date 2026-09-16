import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheet } from '../src/components/ui/BottomSheet';
import { Button } from '../src/components/ui/Button';
import { CustomIcon } from '../src/components/ui/CustomIcon';
import { OTP_LENGTH, OtpCodeInput } from '../src/components/ui/OtpCodeInput';
import { DeleteAccountWarning } from '../src/features/delete-account/DeleteAccountWarning';
import { SettingsHeader } from '../src/features/settings/SettingsHeader';

export default function DeleteAccountScreen() {
  const [code, setCode] = useState('');
  const [notice, setNotice] = useState(false);
  const cancel = () => (router.canGoBack() ? router.back() : router.replace('/account-settings'));
  return (
    <SafeAreaView style={styles.screen}>
      <SettingsHeader title="Xác thực xoá tài khoản" compact whiteBack />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.content}
        >
          <View style={styles.intro}>
            <View style={styles.icon}>
              <CustomIcon name="deleteShield" size={30} />
            </View>
            <Text className="font-sans-black" style={styles.title}>
              Nhập mã xác thực
            </Text>
            <Text className="font-sans" style={styles.description}>
              Chưa gửi mã OTP. Dịch vụ xác thực xoá tài khoản chưa được kết nối.
            </Text>
          </View>
          <View style={styles.otp}>
            <OtpCodeInput variant="plain" autoFocus={false} value={code} onChange={setCode} />
            <View style={styles.resend}>
              <Text className="font-sans" style={styles.resendLabel}>
                Chưa nhận được mã?
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Gửi lại mã OTP"
                hitSlop={8}
                onPress={() => setNotice(true)}
              >
                <Text className="font-sans-bold" style={styles.resendButton}>
                  Gửi lại
                </Text>
              </Pressable>
            </View>
          </View>
          <DeleteAccountWarning />
        </ScrollView>
        <View style={styles.footer}>
          <Button
            accessibilityRole="button"
            label="Xác nhận xoá vĩnh viễn"
            variant="danger"
            disabled={code.length !== OTP_LENGTH}
            leadingIcon={<CustomIcon name="deleteTrash" size={18} />}
            labelStyle={styles.confirmText}
            style={styles.confirm}
            onPress={() => setNotice(true)}
          />
          <Button
            label="Huỷ bỏ & Giữ lại tài khoản"
            variant="outline"
            labelStyle={styles.cancelText}
            style={styles.cancel}
            onPress={cancel}
          />
        </View>
      </KeyboardAvoidingView>
      <BottomSheet visible={notice} onClose={() => setNotice(false)} variant="actions">
        <View style={styles.notice}>
          <Text className="font-sans-bold text-lg text-ink">Chưa kết nối dịch vụ xoá tài khoản</Text>
          <Text className="font-sans text-sm text-muted">
            Chưa thể gửi hoặc xác thực OTP. Không có yêu cầu xoá nào được gửi và tài khoản của bạn vẫn được
            giữ nguyên.
          </Text>
          <Button
            label="Xem trước màn kết quả"
            onPress={() => {
              setNotice(false);
              router.push('/delete-account-sent');
            }}
          />
          <Button label="Đóng" variant="outline" onPress={() => setNotice(false)} />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  flex: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 32, gap: 24 },
  intro: { alignItems: 'center', gap: 8 },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 17.778,
    backgroundColor: '#E639461A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 20, lineHeight: 28, color: '#1A1A1A', textAlign: 'center' },
  description: { maxWidth: 320, fontSize: 13, lineHeight: 21.125, color: '#4A4A4A', textAlign: 'center' },
  otp: { width: '100%', maxWidth: 328, alignSelf: 'center', gap: 16 },
  resend: { flexDirection: 'row', justifyContent: 'center', gap: 4 },
  resendLabel: { fontSize: 12, lineHeight: 18, color: '#4A4A4A' },
  resendButton: { fontSize: 12, lineHeight: 18, color: '#FF416C' },
  footer: { padding: 16, gap: 8, borderTopWidth: 1, borderTopColor: '#E9ECEF' },
  confirm: { height: 48, borderRadius: 13.333, flexDirection: 'row', gap: 8, backgroundColor: '#E63946' },
  confirmText: { fontFamily: 'BeVietnamPro_900Black', fontSize: 14, lineHeight: 21, color: '#1A1A1A' },
  cancel: { height: 44, borderRadius: 12.222, borderWidth: 0 },
  cancelText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 13, lineHeight: 19.5, color: '#1A1A1A' },
  notice: { gap: 16, paddingVertical: 16 },
});
