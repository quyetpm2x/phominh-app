import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { GradientText } from '../../components/ui/GradientText';
export function WalletBalance() {
  return (
    <LinearGradient colors={['#FF416C26', '#FF4B2B1A', '#FFFFFF']} style={styles.card}>
      <View style={styles.badge}>
        <CustomIcon name="walletSparkle" size={12} />
        <Text className="font-sans-bold" style={styles.badgeText}>
          Thu nhập tháng này
        </Text>
      </View>
      <View style={styles.balance}>
        <Text className="font-sans-semibold" style={styles.label}>
          Số dư khả dụng
        </Text>
        <View accessible accessibilityLabel="Số dư khả dụng mẫu: 1.450.000 đồng" style={styles.amountRow}>
          <GradientText
            colors={['#FF416C', '#FF4B2B']}
            direction="vertical"
            className="font-sans-black"
            style={styles.amount}
          >
            1.450.000
          </GradientText>
          <GradientText
            colors={['#FF416C', '#FF4B2B']}
            direction="vertical"
            className="font-sans-bold"
            style={styles.currency}
          >
            đ
          </GradientText>
        </View>
      </View>
      <View style={styles.stats}>
        <View>
          <Text className="font-sans-semibold" style={styles.statLabel}>
            Tạm giữ (chờ duyệt)
          </Text>
          <Text className="font-sans-black" style={styles.statValue}>
            120.000đ
          </Text>
        </View>
        <View style={styles.divider} />
        <View>
          <Text className="font-sans-semibold" style={styles.statLabel}>
            Tổng đã rút
          </Text>
          <Text className="font-sans-black" style={styles.statValue}>
            8.650.000đ
          </Text>
        </View>
        <View style={styles.divider} />
        <View>
          <Text className="font-sans-semibold" style={styles.statLabel}>
            Điểm uy tín
          </Text>
          <View style={styles.reputation}>
            <CustomIcon name="walletShield" size={14} />
            <Text className="font-sans-black" style={[styles.statValue, styles.gold]}>
              98
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  card: {
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: '#FF416C40',
    borderRadius: 30.667,
    overflow: 'hidden',
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#FF416C33',
    borderRadius: 40,
    backgroundColor: '#F8F9FACC',
  },
  badgeText: { fontSize: 12, lineHeight: 16, color: '#FF416C' },
  balance: { gap: 2 },
  label: { fontSize: 12, lineHeight: 18, color: '#4A4A4A' },
  amountRow: { flexDirection: 'row', alignItems: 'baseline', gap: 5 },
  amount: { fontSize: 30, lineHeight: 36, letterSpacing: -0.75 },
  currency: { fontSize: 18, lineHeight: 28, letterSpacing: -0.75 },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF99',
  },
  statLabel: { fontSize: 11, lineHeight: 14.667, color: '#4A4A4A' },
  statValue: { fontSize: 14, lineHeight: 20, color: '#1A1A1A' },
  divider: { height: 24, width: 1, backgroundColor: '#E9ECEF' },
  reputation: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  gold: { color: '#FFB900' },
});
