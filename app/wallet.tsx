import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsHeader } from '../src/features/settings/SettingsHeader';
import { CustomIcon } from '../src/components/ui/CustomIcon';
import { BottomSheet } from '../src/components/ui/BottomSheet';
import { Button } from '../src/components/ui/Button';
import { WalletBalance } from '../src/features/wallet/WalletBalance';
import { WalletActions } from '../src/features/wallet/WalletActions';
import { WalletMission } from '../src/features/wallet/WalletMission';
import { WalletTransactions } from '../src/features/wallet/WalletTransactions';
const notices: Record<string, string> = {
  'Rút tiền':
    'Dịch vụ rút tiền chưa được kết nối. Số dư trên màn hình là dữ liệu mẫu; chưa có yêu cầu rút tiền nào được tạo.',
  'Bảng XH': 'Bảng xếp hạng thu nhập chưa được kết nối với dữ liệu cộng đồng.',
  'Ngân hàng':
    'Chưa kết nối dịch vụ liên kết ngân hàng. Thông tin MB Bank trong lịch sử là dữ liệu mẫu từ thiết kế.',
  'Cài đặt ví':
    'Ví đang hiển thị dữ liệu mẫu theo thiết kế. Số dư, điểm uy tín, tiến độ và giao dịch chưa phải dữ liệu tài khoản thực.',
};
export default function WalletScreen() {
  const [sheet, setSheet] = useState<string | null>(null);
  return (
    <SafeAreaView style={styles.screen}>
      <SettingsHeader
        compact
        title="Ví thưởng & Thu nhập"
        subtitle="Dữ liệu mẫu · Chưa kết nối ví"
        backIcon="walletBack"
        backStyle={styles.headerButton}
        titleStyle={styles.title}
        subtitleStyle={styles.subtitle}
        style={styles.header}
        action={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cài đặt ví"
            onPress={() => router.push('/monetization-settings')}
            style={styles.headerButton}
          >
            <CustomIcon name="walletSettings" size={20} />
          </Pressable>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <WalletBalance />
        <WalletActions
          onPress={(label) => {
            if (label === 'Lịch sử') router.push('/balance-history');
            else if (label === 'Bảng XH') router.push('/reward-ranking');
            else setSheet(label);
          }}
        />
        <WalletMission />
        <WalletTransactions onAll={() => router.push('/balance-history')} />
      </ScrollView>
      <BottomSheet visible={sheet !== null} onClose={() => setSheet(null)} variant="actions">
        <ScrollView contentContainerStyle={styles.sheet}>
          <Text accessibilityRole="header" className="font-sans-bold text-lg text-ink">
            {sheet}
          </Text>
          <Text className="font-sans text-sm leading-6 text-muted">{sheet ? notices[sheet] : ''}</Text>
          <Button accessibilityRole="button" label="Đóng" variant="outline" onPress={() => setSheet(null)} />
        </ScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingTop: 4, paddingBottom: 14, backgroundColor: '#FFFFFFF2', gap: 8 },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 11.111,
    backgroundColor: '#F1F3F599',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { textAlign: 'center', fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  subtitle: { textAlign: 'center', fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  content: { padding: 16, paddingBottom: 32, gap: 16 },
  sheet: { gap: 16, paddingVertical: 16 },
});
