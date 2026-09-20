import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsHeader } from '../src/features/settings/SettingsHeader';
import { CustomIcon } from '../src/components/ui/CustomIcon';
import { BalanceFilterSheet } from '../src/features/wallet/BalanceFilterSheet';
import { defaultBalanceOptions } from '../src/features/wallet/balanceFilterOptions';
import { BalanceFilters } from '../src/features/wallet/BalanceFilters';
import { BalanceHistoryGroups } from '../src/features/wallet/BalanceHistoryGroups';
import { type BalanceFilter } from '../src/features/wallet/balanceHistory';
export default function BalanceHistoryScreen() {
  const [filter, setFilter] = useState<BalanceFilter>('all');
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState(defaultBalanceOptions);
  return (
    <SafeAreaView style={styles.screen}>
      <SettingsHeader
        compact
        title="Biến động số dư"
        titleStyle={styles.title}
        backIcon="walletBack"
        backStyle={styles.headerButton}
        style={styles.header}
        action={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Lọc biến động số dư"
            onPress={() => setOpen(true)}
            style={styles.headerButton}
          >
            <CustomIcon name="balanceFilter" size={18} />
          </Pressable>
        }
      />
      <BalanceFilters value={filter} onChange={setFilter} />
      <ScrollView key={filter} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <BalanceHistoryGroups filter={filter} options={options} />
        <Text className="font-sans" style={styles.preview}>
          Dữ liệu mẫu theo thiết kế · Chưa kết nối dịch vụ ví.
        </Text>
      </ScrollView>
      {open ? (
        <BalanceFilterSheet
          value={options}
          onClose={() => setOpen(false)}
          onApply={(next) => {
            setOptions(next);
            setOpen(false);
          }}
        />
      ) : null}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#FFFFFFF2', paddingTop: 4, paddingBottom: 14 },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 11.111,
    backgroundColor: '#F1F3F599',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 16, lineHeight: 24, textAlign: 'center', letterSpacing: 0 },
  content: { padding: 16, paddingBottom: 72, gap: 20 },
  preview: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A', textAlign: 'center' },
  sheet: { paddingVertical: 16, gap: 12 },
});
