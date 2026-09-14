import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
export function PrivacyIntro() {
  return (
    <LinearGradient colors={['#FF416C1A', '#FF416C0D', '#FF416C00']} style={styles.intro}>
      <View style={styles.heading}>
        <View style={styles.shield}>
          <CustomIcon name="privacyShield" size={18} />
        </View>
        <Text className="font-sans-bold" style={styles.title}>
          Bảo vệ quyền riêng tư vị trí
        </Text>
      </View>
      <Text className="font-sans" style={styles.body}>
        Ứng dụng hoạt động theo bán kính khu phố. Bạn có toàn quyền kiểm soát cách người khác nhìn thấy vị trí
        và thông tin của bạn.
      </Text>
    </LinearGradient>
  );
}
export function PrivacyCommitment() {
  return (
    <View style={styles.footer}>
      <CustomIcon name="privacyLock" size={16} />
      <Text className="font-sans" style={[styles.body, styles.copy]}>
        Chúng tôi cam kết không chia sẻ dữ liệu vị trí GPS thực tế của bạn cho bất kỳ bên thứ ba nào vì mục
        đích quảng cáo.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  intro: { padding: 16, borderWidth: 1, borderColor: '#FF416C33', borderRadius: 19.556, gap: 8 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  shield: {
    width: 32,
    height: 32,
    borderRadius: 8.889,
    backgroundColor: '#FF416C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 14, lineHeight: 21, color: '#1A1A1A', flex: 1 },
  body: { fontSize: 11.5, lineHeight: 18.688, color: '#4A4A4A' },
  copy: { flex: 1 },
  footer: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 19.556,
    backgroundColor: '#FFFFFF66',
  },
});
