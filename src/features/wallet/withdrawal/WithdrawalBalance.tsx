import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../../components/ui/CustomIcon';
import { formatDong } from './withdrawal';

export function WithdrawalBalance({ balance }: { balance: number }) {
  return (
    <View style={styles.shadow}>
      <LinearGradient colors={['#FF416C', '#FF4B2B', '#FF416C']} style={styles.card}>
        <View pointerEvents="none" style={styles.glow} />
        <View style={styles.copy}>
          <Text className="font-sans-semibold" style={styles.label}>
            SỐ DƯ KHẢ DỤNG
          </Text>
          <View style={styles.amountRow}>
            <Text className="font-sans-black" style={styles.amount}>
              {formatDong(balance)}
            </Text>
            <Text className="font-sans-bold" style={styles.currency}>
              đ
            </Text>
          </View>
          <View style={styles.ready}>
            <CustomIcon name="withdrawReady" size={11} />
            <Text className="font-sans" style={styles.readyText}>
              Đã sẵn sàng rút tiền
            </Text>
          </View>
        </View>
        <View style={styles.wallet}>
          <CustomIcon name="withdrawWallet" size={20} />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 30.667,
    backgroundColor: '#FF416C',
    shadowColor: '#FF416C',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  card: {
    padding: 20,
    borderRadius: 30.667,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  glow: {
    position: 'absolute',
    right: -24,
    bottom: -24,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#FFFFFF1A',
    boxShadow: '0 0 24px 12px #FFFFFF1A',
  },
  copy: { gap: 4 },
  label: { fontSize: 12, lineHeight: 16, letterSpacing: 0.6, color: '#FFFFFFCC' },
  amountRow: { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
  amount: { fontSize: 24, lineHeight: 32, letterSpacing: -0.6, color: '#FFF' },
  currency: { fontSize: 14, lineHeight: 20, color: '#FFFFFFE6' },
  ready: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  readyText: { fontSize: 11, lineHeight: 16.5, color: '#FFFFFFB3' },
  wallet: {
    width: 48,
    height: 48,
    borderRadius: 13.333,
    backgroundColor: '#FFFFFF26',
    borderWidth: 1,
    borderColor: '#FFFFFF33',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
