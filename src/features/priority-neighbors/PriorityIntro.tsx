import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
export function PriorityIntro() {
  return (
    <LinearGradient colors={['#FF416C1A', '#FF416C0D', '#FF416C00']} style={styles.card}>
      <View style={styles.row}>
        <View style={styles.icon}>
          <CustomIcon name="prioritySparkle" size={16} />
        </View>
        <View style={styles.copy}>
          <Text className="font-sans-bold" style={styles.title}>
            Đặc quyền người quen ưu tiên
          </Text>
          <Text className="font-sans" style={styles.subtitle}>
            Luôn ghim lên đầu & nhận thông báo tức thì
          </Text>
        </View>
      </View>
      <View style={styles.benefits}>
        {['Bài đăng ưu tiên đầu tin', 'Báo tin khẩn tức thời'].map((label) => (
          <View key={label} style={styles.benefit}>
            <CustomIcon name="priorityCheck" size={12} />
            <Text className="font-sans" style={styles.subtitle}>
              {label}
            </Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}
export function PriorityPrivacyNote() {
  return (
    <View style={styles.privacy}>
      <CustomIcon name="priorityLock" size={16} />
      <Text className="font-sans" style={styles.note}>
        Danh sách ưu tiên hoàn toàn riêng tư. Người khác sẽ không biết họ được bạn thêm vào danh sách ưu tiên.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: '#FF416C33', borderRadius: 19.56, padding: 16, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 8.9,
    backgroundColor: '#FF416C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
  title: { fontSize: 13, lineHeight: 19.5, color: '#1A1A1A' },
  subtitle: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  benefits: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingTop: 4 },
  benefit: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  privacy: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E9ECEFCC',
    borderRadius: 18.9,
    backgroundColor: '#FFFFFF66',
  },
  note: { flex: 1, fontSize: 11.5, lineHeight: 18.688, color: '#4A4A4A' },
});
