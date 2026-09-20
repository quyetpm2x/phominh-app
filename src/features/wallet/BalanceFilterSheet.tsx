import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { Button } from '../../components/ui/Button';
import { FilterChip } from '../../components/ui/Chip';
import { BalanceDateRange } from './BalanceDateRange';
import { defaultBalanceOptions, type BalanceOptions } from './balanceFilterOptions';
export function BalanceFilterSheet({
  value,
  onClose,
  onApply,
}: {
  value: BalanceOptions;
  onClose: () => void;
  onApply: (value: BalanceOptions) => void;
}) {
  const [draft, setDraft] = useState(value);
  return (
    <BottomSheet visible onClose={onClose} variant="actions">
      <View style={styles.heading}>
        <CustomIcon name="balanceFilterTitle" size={18} />
        <Text accessibilityRole="header" className="font-sans-black" style={styles.title}>
          Bộ lọc biến động
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Đóng bộ lọc"
          onPress={onClose}
          style={styles.close}
        >
          <CustomIcon name="balanceFilterClose" size={16} />
        </Pressable>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.body}>
        <BalanceDateRange value={draft} onChange={setDraft} />
        <View style={styles.section}>
          <Text className="font-sans-bold" style={styles.label}>
            LOẠI GIAO DỊCH
          </Text>
          <View style={styles.grid}>
            {(
              [
                ['income', 'Thưởng bài viết', 'balanceFilterReward'],
                ['rank', 'Thưởng đua Top', 'walletRank'],
                ['outgoing', 'Rút tiền', 'walletOutgoing'],
                ['referral', 'Hoa hồng bạn bè', 'balanceReferral'],
              ] as const
            ).map(([key, label, icon]) => (
              <FilterChip
                key={key}
                label={label}
                selected={draft.types.includes(key)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: draft.types.includes(key) }}
                icon={<CustomIcon name={icon} size={16} />}
                style={[styles.type, draft.types.includes(key) && styles.selected]}
                onPress={() =>
                  setDraft({
                    ...draft,
                    types: draft.types.includes(key)
                      ? draft.types.filter((type) => type !== key)
                      : [...draft.types, key],
                  })
                }
              />
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text className="font-sans-bold" style={styles.label}>
            TRẠNG THÁI
          </Text>
          <View style={styles.row}>
            {(
              [
                ['all', 'Tất cả'],
                ['success', 'Thành công'],
                ['pending', 'Đang xử lý'],
              ] as const
            ).map(([key, label]) => (
              <FilterChip
                key={key}
                label={label}
                selected={draft.status === key}
                accessibilityRole="radio"
                accessibilityState={{ selected: draft.status === key }}
                style={[styles.status, draft.status === key && styles.selected]}
                onPress={() => setDraft({ ...draft, status: key })}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          accessibilityRole="button"
          label="Đặt lại"
          variant="secondary"
          style={styles.reset}
          labelStyle={styles.buttonText}
          onPress={() => setDraft({ ...defaultBalanceOptions, types: [] })}
        />
        <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.apply}>
          <Button
            accessibilityRole="button"
            label="Áp dụng bộ lọc"
            disabled={draft.from > draft.to}
            style={styles.applyButton}
            labelStyle={styles.buttonText}
            onPress={() => onApply(draft)}
          />
        </LinearGradient>
      </View>
    </BottomSheet>
  );
}
const styles = StyleSheet.create({
  heading: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  title: { flex: 1, fontSize: 18, lineHeight: 28, color: '#1A1A1A' },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F3F5B3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { gap: 20, paddingBottom: 20 },
  section: { gap: 8 },
  label: { fontSize: 12, lineHeight: 16, letterSpacing: 0.6, color: '#4A4A4A' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  type: {
    width: '48.7%',
    flexGrow: 1,
    height: 40,
    paddingHorizontal: 12,
    paddingVertical: 0,
    justifyContent: 'flex-start',
    borderRadius: 10.556,
    backgroundColor: '#F1F3F599',
    borderColor: '#E9ECEF99',
  },
  selected: { backgroundColor: '#FF416C1A', borderColor: '#FF416C4D' },
  row: { flexDirection: 'row', gap: 8 },
  status: {
    flex: 1,
    height: 34,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 9.444,
    backgroundColor: '#F1F3F599',
    borderColor: 'transparent',
  },
  footer: { flexDirection: 'row', gap: 12, paddingTop: 8 },
  reset: {
    flex: 1,
    height: 40,
    borderRadius: 11.111,
    backgroundColor: '#F1F3F5',
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  apply: { flex: 2, borderRadius: 11.111 },
  applyButton: { height: 40, backgroundColor: 'transparent', paddingHorizontal: 0 },
  buttonText: { fontSize: 12, lineHeight: 16, fontFamily: 'BeVietnamPro_700Bold' },
});
