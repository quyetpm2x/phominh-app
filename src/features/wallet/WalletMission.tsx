import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LegalCard } from '../legal/LegalCard';
import { CustomIcon } from '../../components/ui/CustomIcon';
export function WalletMission() {
  return (
    <LegalCard style={styles.card}>
      <View style={styles.heading}>
        <View style={styles.icon}>
          <CustomIcon name="walletProgress" size={16} />
        </View>
        <Text className="font-sans-bold" style={styles.title}>
          Tiến độ nhiệm vụ tuần
        </Text>
        <Text className="font-sans-bold" style={styles.badge}>
          3/5 bài
        </Text>
      </View>
      <View style={styles.progress}>
        <View style={styles.row}>
          <Text className="font-sans-medium" style={styles.description}>
            Đăng 5 bài review có ảnh check-in
          </Text>
          <Text className="font-sans-bold" style={styles.reward}>
            +50.000đ
          </Text>
        </View>
        <View
          accessibilityRole="progressbar"
          accessibilityLabel="Tiến độ nhiệm vụ tuần"
          accessibilityValue={{ min: 0, max: 5, now: 3 }}
          style={styles.track}
        >
          <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.fill} />
        </View>
        <Text className="font-sans" style={styles.hint}>
          Còn 2 bài đăng nữa để nhận ngay 50.000đ vào ví thưởng.
        </Text>
      </View>
    </LegalCard>
  );
}
const styles = StyleSheet.create({
  card: { gap: 12 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 7.778,
    backgroundColor: '#FF416C1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { flex: 1, fontSize: 13, lineHeight: 19.5, color: '#1A1A1A' },
  badge: {
    fontSize: 11,
    lineHeight: 16.5,
    color: '#FF416C',
    backgroundColor: '#FF416C1A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 30,
    overflow: 'hidden',
  },
  progress: { gap: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  description: { flex: 1, fontSize: 12, lineHeight: 16, color: '#4A4A4A' },
  reward: { fontSize: 12, lineHeight: 16, color: '#1A1A1A' },
  track: { height: 8, borderRadius: 20, overflow: 'hidden', backgroundColor: '#F1F3F5' },
  fill: { width: '60%', height: 8, borderRadius: 20 },
  hint: { fontSize: 10.5, lineHeight: 15.75, color: '#4A4A4A' },
});
