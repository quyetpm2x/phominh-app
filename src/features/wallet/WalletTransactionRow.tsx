import { StyleSheet, Text, View } from 'react-native';
import { CustomIcon, type CustomIconProps } from '../../components/ui/CustomIcon';
export interface WalletTransactionItem {
  title: string;
  amount: string;
  detail: string;
  icon: CustomIconProps['name'];
  background: string;
  outgoing: boolean;
  metadata?: string;
  balance?: string;
  success?: boolean;
}
export function WalletTransactionRow({
  item,
  last = false,
  detailed = false,
}: {
  item: WalletTransactionItem;
  last?: boolean;
  detailed?: boolean;
}) {
  return (
    <View style={[styles.row, detailed && styles.detailed, !last && styles.divider]}>
      <View style={[styles.icon, { backgroundColor: item.background }]}>
        <CustomIcon name={item.icon} size={20} />
      </View>
      <View style={[styles.copy, detailed && styles.detailedCopy]}>
        <View style={styles.line}>
          <Text className="font-sans-bold" style={[styles.name, detailed && styles.detailedName]}>
            {item.title}
          </Text>
          <Text
            className={detailed ? 'font-sans-black' : 'font-sans-bold'}
            style={[styles.amount, detailed && styles.detailedAmount, item.outgoing && styles.outgoing]}
          >
            {item.amount}
          </Text>
        </View>
        <Text className="font-sans" style={[styles.detail, detailed && styles.description]}>
          {item.detail}
        </Text>
        {detailed ? (
          <View style={styles.footer}>
            <View style={styles.metadata}>
              {item.success ? <CustomIcon name="balanceSuccess" size={11} /> : null}
              <Text
                className={item.success ? 'font-sans-semibold' : 'font-sans-medium'}
                style={[styles.metaText, item.success && styles.success]}
              >
                {item.metadata}
              </Text>
            </View>
            <Text className="font-sans-medium" style={styles.metaText}>
              Số dư: {item.balance}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { padding: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailed: { padding: 16, gap: 12, alignItems: 'flex-start' },
  divider: { borderBottomWidth: 1, borderBottomColor: '#E9ECEF' },
  icon: { width: 40, height: 40, borderRadius: 11.111, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: 2 },
  detailedCopy: { gap: 4 },
  line: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 },
  name: { flex: 1, fontSize: 13, lineHeight: 19.5, color: '#1A1A1A' },
  detailedName: { fontSize: 13.5, lineHeight: 20.25 },
  amount: { fontSize: 13, lineHeight: 19.5, color: '#00D492' },
  detailedAmount: { fontSize: 14, lineHeight: 21 },
  outgoing: { color: '#1A1A1A' },
  detail: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  description: { fontSize: 12, lineHeight: 16 },
  footer: { paddingTop: 4, flexDirection: 'row', justifyContent: 'space-between', gap: 4, flexWrap: 'wrap' },
  metadata: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  success: { color: '#00D492' },
});
