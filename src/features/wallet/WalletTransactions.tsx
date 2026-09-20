import { WalletTransactionRow } from './WalletTransactionRow';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LegalCard } from '../legal/LegalCard';
import { CustomIcon } from '../../components/ui/CustomIcon';
const transactions = [
  {
    title: 'Thưởng bài viết #8920',
    amount: '+25.000đ',
    detail: 'Hôm nay, 10:24 • Phở Bát Đàn',
    icon: 'walletIncome',
    background: '#00BC7D1A',
    outgoing: false,
  },
  {
    title: 'Rút về MB Bank (**892)',
    amount: '-500.000đ',
    detail: 'Hôm qua, 16:45 • Thành công',
    icon: 'walletOutgoing',
    background: '#E639461A',
    outgoing: true,
  },
  {
    title: 'Thưởng đua Top Tuần #2',
    amount: '+100.000đ',
    detail: '06/10/2023 • Hạng 4 khu vực',
    icon: 'walletGift',
    background: '#00BC7D1A',
    outgoing: false,
  },
  {
    title: 'Hoa hồng giới thiệu bạn bè',
    amount: '+20.000đ',
    detail: '04/10/2023 • Bạn bè hoàn tất đăng bài',
    icon: 'walletReferral',
    background: '#FE9A001A',
    outgoing: false,
  },
] as const;
export function WalletTransactions({
  onAll,
  showHeading = true,
}: {
  onAll?: () => void;
  showHeading?: boolean;
}) {
  return (
    <View style={styles.section}>
      {showHeading ? (
        <View style={styles.heading}>
          <CustomIcon name="walletRecent" size={13} />
          <Text className="font-sans-bold" style={styles.title}>
            BIẾN ĐỘNG GẦN ĐÂY
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Xem tất cả giao dịch"
            hitSlop={8}
            onPress={onAll}
            style={styles.all}
          >
            <Text className="font-sans-bold" style={styles.allText}>
              Tất cả
            </Text>
            <CustomIcon name="walletChevron" size={12} />
          </Pressable>
        </View>
      ) : null}
      <LegalCard style={styles.card}>
        {transactions.map((item, index) => (
          <WalletTransactionRow key={item.title} item={item} last={index === transactions.length - 1} />
        ))}
      </LegalCard>
    </View>
  );
}
const styles = StyleSheet.create({
  section: { gap: 10 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 4 },
  title: { flex: 1, fontSize: 13, lineHeight: 19.5, letterSpacing: 0.325, color: '#1A1A1A' },
  all: { flexDirection: 'row', gap: 2, alignItems: 'center' },
  allText: { fontSize: 12, lineHeight: 18, color: '#FF416C' },
  card: { padding: 0, gap: 0, overflow: 'hidden' },
});
