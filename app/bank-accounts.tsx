import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomIcon } from '../src/components/ui/CustomIcon';
import { LegalCard } from '../src/features/legal/LegalCard';
import { SettingsHeader } from '../src/features/settings/SettingsHeader';
import { BankFaqSheet } from '../src/features/wallet/bank/BankFaqSheet';
import { BankLinkForm } from '../src/features/wallet/bank/BankLinkForm';
import { LinkedBankCard } from '../src/features/wallet/bank/LinkedBankCard';

export default function BankAccountsScreen() {
  const insets = useSafeAreaInsets();
  const [hasPreview, setHasPreview] = useState(true);
  const [faqOpen, setFaqOpen] = useState(false);
  const remove = () =>
    Alert.alert('Gỡ tài khoản mẫu?', 'Thao tác chỉ ẩn thẻ mẫu trong màn hình này.', [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Gỡ liên kết', style: 'destructive', onPress: () => setHasPreview(false) },
    ]);
  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={s.screen}>
      <SettingsHeader
        title="Tài khoản ngân hàng"
        subtitle="Nhận tiền thưởng & rút về tài khoản"
        backIcon="bankBack"
        backStyle={s.headerButton}
        titleStyle={s.title}
        subtitleStyle={s.subtitle}
        style={[s.header, { paddingTop: Math.max(48, insets.top) }]}
        action={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Trợ giúp tài khoản ngân hàng"
            onPress={() => setFaqOpen(true)}
            style={s.headerButton}
          >
            <CustomIcon name="bankHelp" size={20} />
          </Pressable>
        }
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.content}
        >
          <View style={s.notice}>
            <View style={s.noticeIcon}>
              <CustomIcon name="bankSafety" size={18} />
            </View>
            <View style={s.noticeCopy}>
              <Text className="font-sans-bold" style={s.noticeTitle}>
                Tên chủ tài khoản phải trùng khớp
              </Text>
              <Text className="font-sans" style={s.noticeText}>
                Để đảm bảo an toàn giải ngân tiền thưởng, tên tài khoản nhận tiền phải trùng với tên đã xác
                minh:{'\n'}
                <Text className="font-sans-bold" style={s.owner}>
                  NGUYEN VAN QUYET.
                </Text>
              </Text>
            </View>
          </View>
          <View style={s.linkedSection}>
            <View style={s.sectionHeader}>
              <View style={s.sectionLabel}>
                <CustomIcon name="bankLinked" size={12} />
                <Text className="font-sans-black" style={s.sectionTitle}>
                  TÀI KHOẢN ĐÃ LIÊN KẾT
                </Text>
              </View>
              <Text className="font-sans-bold" style={s.count}>
                {hasPreview ? 1 : 0}/3 tài khoản
              </Text>
            </View>
            {hasPreview ? (
              <LinkedBankCard onRemove={remove} />
            ) : (
              <LegalCard>
                <Text className="font-sans" style={s.noticeText}>
                  Chưa có tài khoản ngân hàng được liên kết.
                </Text>
              </LegalCard>
            )}
          </View>
          <View style={s.formSection}>
            <View style={s.sectionHeader}>
              <View style={s.sectionLabel}>
                <CustomIcon name="bankAdd" size={12} />
                <Text className="font-sans-black" style={s.sectionTitle}>
                  LIÊN KẾT TÀI KHOẢN MỚI
                </Text>
              </View>
              <Text className="font-sans" style={s.napas}>
                Napas 247 hỗ trợ
              </Text>
            </View>
            <BankLinkForm />
          </View>
          <LegalCard style={s.security}>
            <CustomIcon name="bankSecurity" size={15.586} />
            <Text className="font-sans-medium" style={s.securityText}>
              Mã hoá bảo mật chuẩn SSL 256-bit theo quy định Ngân hàng Nhà nước.
            </Text>
          </LegalCard>
        </ScrollView>
      </KeyboardAvoidingView>
      <BankFaqSheet visible={faqOpen} onClose={() => setFaqOpen(false)} />
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 18, lineHeight: 28, letterSpacing: -0.45 },
  subtitle: { fontSize: 11, lineHeight: 16.5 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 48, gap: 24 },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 19.556,
    borderWidth: 1,
    borderColor: '#FE9A0033',
    backgroundColor: '#FE9A001A',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  noticeIcon: {
    marginTop: 2,
    width: 32,
    height: 32,
    borderRadius: 8.889,
    backgroundColor: '#FE9A0033',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noticeCopy: { flex: 1, gap: 2 },
  noticeTitle: { fontSize: 12, lineHeight: 16, color: '#1A1A1A' },
  noticeText: { fontSize: 11, lineHeight: 17.875, color: '#4A4A4A' },
  owner: { color: '#1A1A1A' },
  linkedSection: { gap: 12 },
  formSection: { gap: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 },
  sectionLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { fontSize: 12, lineHeight: 16, letterSpacing: 0.6, color: '#4A4A4A' },
  count: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 99,
    overflow: 'hidden',
    fontSize: 11,
    lineHeight: 16.5,
    backgroundColor: '#FF416C1A',
    color: '#FF416C',
  },
  napas: { fontSize: 10, lineHeight: 15, color: '#4A4A4A' },
  security: { padding: 16, borderRadius: 17.083, flexDirection: 'row', gap: 10, alignItems: 'center' },
  securityText: { flex: 1, fontSize: 11, lineHeight: 13.75, color: '#4A4A4A' },
});
