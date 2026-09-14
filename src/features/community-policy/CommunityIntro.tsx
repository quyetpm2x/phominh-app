import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
export function CommunityIntro() {
  return (
    <LinearGradient colors={['#FF416C26', '#FF4B2B1A', '#FF416C00']} style={styles.card}>
      <View style={styles.row}>
        <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.icon}>
          <CustomIcon name="communityIntro" size={14} />
        </LinearGradient>
        <Text className="font-sans-bold" style={styles.title}>
          Bộ quy tắc ứng xử xóm phố
        </Text>
        <Text className="font-sans-semibold" style={styles.badge}>
          Bắt buộc
        </Text>
      </View>
      <Text className="font-sans" style={styles.body}>
        Bản Tin Bán Kính cam kết tạo dựng môi trường thông tin lân cận lành mạnh, đáng tin cậy và gắn kết tình
        làng nghĩa xóm.
      </Text>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  card: { padding: 16, gap: 8, borderWidth: 1, borderColor: '#FF416C33', borderRadius: 19.556 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { width: 28, height: 28, borderRadius: 7.778, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 12, lineHeight: 16, color: '#1A1A1A' },
  badge: {
    fontSize: 10,
    lineHeight: 15,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
    backgroundColor: '#FF416C1A',
    color: '#FF416C',
    overflow: 'hidden',
  },
  body: { fontSize: 12, lineHeight: 19.5, color: '#4A4A4A' },
});
