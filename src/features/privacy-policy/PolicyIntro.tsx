import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { POLICY_DATE, POLICY_INTRO } from './data';
export function PolicyIntro() {
  return (
    <LinearGradient colors={['#00BC7D1A', '#FF416C0D', '#00BC7D00']} style={styles.card}>
      <View style={styles.heading}>
        <View style={styles.label}>
          <View style={styles.icon}>
            <CustomIcon name="policyShield" size={14} />
          </View>
          <Text className="font-sans-bold" style={styles.title}>
            Bảo mật thông tin người dùng
          </Text>
        </View>
        <Text className="font-sans-medium" style={styles.date}>
          Áp dụng: {POLICY_DATE}
        </Text>
      </View>
      <Text className="font-sans" style={styles.body}>
        {POLICY_INTRO}
      </Text>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  card: { padding: 16, gap: 8, borderWidth: 1, borderColor: '#00BC7D33', borderRadius: 19.556 },
  heading: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
  },
  label: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 7.778,
    backgroundColor: '#00BC7D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 12, lineHeight: 18, color: '#009966', flexShrink: 1 },
  date: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  body: { fontSize: 12, lineHeight: 19.5, color: '#4A4A4A' },
});
