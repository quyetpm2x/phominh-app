import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../../components/ui/CustomIcon';
import { TextInput } from '../../../components/ui/TextInput';
import { LegalCard } from '../../legal/LegalCard';
import { formatDong } from './withdrawal';

type Props = {
  amount: string;
  balance: number;
  error: string | null;
  onChange: (value: string) => void;
  onFeeInfo: () => void;
};

export function WithdrawalAmount({ amount, balance, error, onChange, onFeeInfo }: Props) {
  const value = Number(amount);
  const options = [
    { label: '100k', value: 100_000 },
    { label: '500k', value: 500_000 },
    { label: '1.000k', value: 1_000_000 },
    { label: 'Tất cả', value: balance },
  ];
  return (
    <LegalCard style={styles.card}>
      <View style={styles.field}>
        <View style={styles.row}>
          <Text className="font-sans-bold" style={styles.label}>
            Nhập số tiền muốn rút
          </Text>
          <Pressable accessibilityRole="button" onPress={() => onChange(String(balance))} hitSlop={8}>
            <Text className="font-sans-semibold" style={styles.all}>
              Rút tất cả
            </Text>
          </Pressable>
        </View>
        <View>
          <TextInput
            accessibilityLabel="Số tiền muốn rút"
            value={amount ? formatDong(value) : ''}
            onChangeText={(text) =>
              onChange(
                text
                  .replace(/\D/g, '')
                  .replace(/^0+(?=\d)/, '')
                  .slice(0, 12),
              )
            }
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor="#1A1A1A"
            style={[styles.input, error ? styles.invalid : null]}
          />
          <Text pointerEvents="none" className="font-sans-black" style={styles.currency}>
            VNĐ
          </Text>
        </View>
        {error ? (
          <Text accessibilityRole="alert" className="font-sans" style={styles.error}>
            {error}
          </Text>
        ) : null}
      </View>
      <View style={styles.quick}>
        <Text className="font-sans-bold" style={styles.quickLabel}>
          Chọn nhanh mức tiền
        </Text>
        <View style={styles.options}>
          {options.map((option) => (
            <Pressable
              key={option.label}
              accessibilityRole="button"
              accessibilityState={{ selected: value === option.value }}
              onPress={() => onChange(String(option.value))}
              style={[styles.option, value === option.value && styles.selected]}
            >
              <Text
                className="font-sans-black"
                style={[styles.optionText, value === option.value && styles.selectedText]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <LegalCard style={styles.summary}>
        <View style={styles.row}>
          <Text className="font-sans" style={styles.summaryLabel}>
            Số tiền yêu cầu
          </Text>
          <Text className="font-sans-bold" style={styles.label}>
            {formatDong(value)} đ
          </Text>
        </View>
        <View style={styles.row}>
          <View style={styles.feeLabel}>
            <Text className="font-sans" style={styles.summaryLabel}>
              Phí giao dịch
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Thông tin phí giao dịch"
              onPress={onFeeInfo}
              hitSlop={10}
            >
              <CustomIcon name="withdrawFeeInfo" size={12} />
            </Pressable>
          </View>
          <Text className="font-sans-bold" style={styles.free}>
            Miễn phí
          </Text>
        </View>
        <View style={[styles.row, styles.total]}>
          <Text className="font-sans-bold" style={styles.label}>
            Thực nhận về tài khoản
          </Text>
          <Text className="font-sans-black" style={styles.totalValue}>
            {formatDong(value)} đ
          </Text>
        </View>
      </LegalCard>
    </LegalCard>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, gap: 16, borderRadius: 30.667 },
  field: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 },
  label: { fontSize: 12, lineHeight: 16, color: '#1A1A1A' },
  all: { fontSize: 11, lineHeight: 14.667, color: '#FF416C' },
  input: {
    height: 68,
    borderRadius: 18.889,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    backgroundColor: '#F1F3F566',
    paddingLeft: 14,
    paddingRight: 64,
    fontFamily: 'BeVietnamPro_900Black',
    fontSize: 24,
    lineHeight: 32,
  },
  currency: { position: 'absolute', top: 24, right: 16, fontSize: 14, lineHeight: 20, color: '#4A4A4A' },
  invalid: { borderColor: '#FF416C' },
  error: { fontSize: 11, lineHeight: 16, color: '#E7000B' },
  quick: { gap: 6 },
  quickLabel: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  options: { flexDirection: 'row', gap: 8 },
  option: {
    flex: 1,
    height: 38,
    borderRadius: 10.556,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#F1F3F580',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: { fontSize: 12, lineHeight: 16, color: '#1A1A1A' },
  selected: { backgroundColor: '#FF416C1A', borderColor: '#FF416C4D' },
  selectedText: { color: '#FF416C' },
  summary: {
    padding: 14,
    gap: 8,
    backgroundColor: '#F1F3F54D',
    borderColor: '#E9ECEFCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  summaryLabel: { fontSize: 12, lineHeight: 16, color: '#4A4A4A' },
  feeLabel: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  free: { fontSize: 12, lineHeight: 16, color: '#00D492' },
  total: { paddingTop: 8, borderTopWidth: 1, borderColor: '#E9ECEF' },
  totalValue: { fontSize: 16, lineHeight: 24, color: '#FF416C' },
});
