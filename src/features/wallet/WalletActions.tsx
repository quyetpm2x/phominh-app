import { Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
const actions = [
  { label: 'Rút tiền', icon: 'walletWithdraw', colors: ['#FF416C26', '#FF4B2B26'] },
  { label: 'Bảng XH', icon: 'walletRank', colors: ['#FE9A001A', '#FE9A001A'] },
  { label: 'Ngân hàng', icon: 'walletBank', colors: ['#2B7FFF1A', '#2B7FFF1A'] },
  { label: 'Lịch sử', icon: 'walletHistory', colors: ['#AD46FF1A', '#AD46FF1A'] },
] as const;
export function WalletActions({ onPress }: { onPress: (label: string) => void }) {
  return (
    <View style={styles.row}>
      {actions.map((action) => (
        <Pressable
          key={action.label}
          accessibilityRole="button"
          onPress={() => onPress(action.label)}
          style={styles.action}
        >
          <LinearGradient colors={action.colors} style={styles.icon}>
            <CustomIcon name={action.icon} size={20} />
          </LinearGradient>
          <Text className="font-sans-bold" style={styles.label}>
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
  action: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 19.556,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
  },
  icon: { width: 40, height: 40, borderRadius: 11.111, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 10, lineHeight: 15, color: '#1A1A1A' },
});
