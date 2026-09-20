import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../src/components/ui/Button';
import { CustomIcon } from '../src/components/ui/CustomIcon';
import { SettingsHeader } from '../src/features/settings/SettingsHeader';
import { WithdrawalAmount } from '../src/features/wallet/withdrawal/WithdrawalAmount';
import { WithdrawalBalance } from '../src/features/wallet/withdrawal/WithdrawalBalance';
import { WithdrawalRecipient } from '../src/features/wallet/withdrawal/WithdrawalRecipient';
import { validateWithdrawal, WITHDRAWAL_BALANCE } from '../src/features/wallet/withdrawal/withdrawal';

export default function WithdrawalScreen() {
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('500000');
  const [error, setError] = useState<string | null>(null);
  const changeAmount = (value: string) => {
    setAmount(value);
    setError(null);
  };
  const confirm = () => {
    Keyboard.dismiss();
    const message = validateWithdrawal(Number(amount), WITHDRAWAL_BALANCE);
    setError(message);
    if (message) return;
    Alert.alert(
      'Chưa thể rút tiền',
      'Dịch vụ rút tiền chưa được kết nối. Số dư và tài khoản đang là dữ liệu mẫu; chưa có yêu cầu rút tiền nào được gửi.',
    );
  };
  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.screen}>
      <SettingsHeader
        title="Rút tiền về tài khoản"
        subtitle="Xử lý tự động qua Napas 24/7"
        backIcon="withdrawBack"
        backIconSize={20}
        backStyle={styles.headerButton}
        titleStyle={styles.title}
        subtitleStyle={styles.subtitle}
        style={[styles.header, { paddingTop: Math.max(48, insets.top) }]}
        action={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Lịch sử rút tiền"
            onPress={() => router.push('/balance-history')}
            style={styles.headerButton}
          >
            <CustomIcon name="withdrawHistory" size={18} />
          </Pressable>
        }
      />
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <WithdrawalBalance balance={WITHDRAWAL_BALANCE} />
          <WithdrawalRecipient />
          <WithdrawalAmount
            amount={amount}
            balance={WITHDRAWAL_BALANCE}
            error={error}
            onChange={changeAmount}
            onFeeInfo={() =>
              Alert.alert('Phí giao dịch', 'Rút tiền về tài khoản ngân hàng được miễn phí giao dịch.')
            }
          />
          <View style={styles.notice}>
            <CustomIcon name="withdrawClock" size={18} />
            <Text className="font-sans" style={styles.noticeText}>
              <Text className="font-sans-bold" style={styles.noticeTitle}>
                Thời gian chuyển tiền:{' '}
              </Text>
              Tiền sẽ được chuyển ngay vào tài khoản qua hệ thống Napas 24/7 (tối đa 5-15 phút trong giờ cao
              điểm).
            </Text>
          </View>
          <View style={styles.footer}>
            <Button
              accessibilityRole="button"
              label="Xác nhận rút tiền"
              onPress={confirm}
              className="flex-row gap-2"
              style={styles.confirm}
              labelStyle={styles.confirmText}
              leadingIcon={
                <>
                  <LinearGradient
                    pointerEvents="none"
                    colors={['#FF416C', '#FF4B2B']}
                    style={styles.gradient}
                  />
                  <CustomIcon name="withdrawConfirm" size={16.667} />
                </>
              }
            />
            <Text className="font-sans-medium" style={styles.limit}>
              Hạn mức rút tối thiểu là 50.000đ / lần
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#E9ECEF99',
    backgroundColor: '#F8F9FA',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 11.111,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 18, lineHeight: 28, letterSpacing: -0.45 },
  subtitle: { fontSize: 11, lineHeight: 16.5 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 48, gap: 24 },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 19.556,
    backgroundColor: '#F1F3F566',
  },
  noticeText: { flex: 1, fontSize: 11, lineHeight: 17.875, color: '#4A4A4A' },
  noticeTitle: { color: '#1A1A1A' },
  footer: { gap: 12, paddingTop: 8 },
  confirm: {
    height: 56,
    borderRadius: 15.556,
    paddingHorizontal: 12,
    shadowColor: '#FF416C',
    shadowOpacity: 0.25,
    shadowRadius: 7.5,
    shadowOffset: { width: 0, height: 10 },
  },
  gradient: { ...StyleSheet.absoluteFill, borderRadius: 15.556 },
  confirmText: { fontFamily: 'BeVietnamPro_900Black', fontSize: 16, lineHeight: 24 },
  limit: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A', textAlign: 'center' },
});
