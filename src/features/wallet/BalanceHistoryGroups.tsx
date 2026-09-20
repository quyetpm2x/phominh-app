import type { BalanceOptions } from './balanceFilterOptions';
import { StyleSheet, Text, View } from 'react-native';
import { LegalCard } from '../legal/LegalCard';
import { WalletTransactionRow } from './WalletTransactionRow';
import { filterBalanceHistory, formatWalletMoney, type BalanceFilter } from './balanceHistory';
export function BalanceHistoryGroups({
  filter,
  options,
}: {
  filter: BalanceFilter;
  options?: BalanceOptions;
}) {
  const groups = filterBalanceHistory(filter, options);
  if (!groups.length)
    return <Text className="font-sans text-sm text-muted">Không có giao dịch phù hợp với bộ lọc.</Text>;
  return (
    <>
      {groups.map((group) => {
        const total = group.entries.reduce((sum, item) => sum + item.amount, 0);
        return (
          <View key={group.label} style={styles.group}>
            <View style={styles.heading}>
              <Text className="font-sans-bold" style={styles.label}>
                {group.label}
              </Text>
              <Text className="font-sans-bold" style={[styles.total, total < 0 && styles.negative]}>
                {formatWalletMoney(total, true)}
              </Text>
            </View>
            <LegalCard style={styles.card}>
              {group.entries.map((entry, index) => (
                <WalletTransactionRow
                  key={entry.id}
                  detailed
                  last={index === group.entries.length - 1}
                  item={{
                    ...entry,
                    amount: formatWalletMoney(entry.amount, true),
                    detail: entry.description,
                    balance: formatWalletMoney(entry.balance),
                    outgoing: entry.amount < 0,
                  }}
                />
              ))}
            </LegalCard>
          </View>
        );
      })}
    </>
  );
}
const styles = StyleSheet.create({
  group: { gap: 10 },
  heading: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, paddingHorizontal: 4 },
  label: { fontSize: 12, lineHeight: 16, letterSpacing: 0.6, color: '#4A4A4A' },
  total: { fontSize: 12, lineHeight: 16, color: '#00D492' },
  negative: { color: '#E63946' },
  card: { padding: 0, gap: 0, overflow: 'hidden' },
});
