import { StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
export function DeletionSentHero() {
  return (
    <View style={styles.hero}>
      <View style={styles.iconWrap}>
        <View style={styles.icon}>
          <CustomIcon name="deletionSentHourglass" size={48} />
        </View>
        <View style={styles.badge}>
          <Text className="font-sans-black" style={styles.badgeText}>
            30d
          </Text>
        </View>
      </View>
      <View style={styles.copy}>
        <Text accessibilityRole="header" className="font-sans-black" style={styles.title}>
          Yêu cầu xoá đã được tiếp nhận
        </Text>
        <Text className="font-sans" style={styles.body}>
          Tài khoản của bạn đã được đưa vào danh sách chờ xử lý và sẽ bị{' '}
          <Text className="font-sans-bold" style={styles.emphasis}>
            xoá vĩnh viễn
          </Text>{' '}
          sau đúng 30 ngày.
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 24 },
  iconWrap: { width: 96, height: 96 },
  icon: {
    width: 96,
    height: 96,
    borderRadius: 26.667,
    borderWidth: 2,
    borderColor: '#E6394633',
    backgroundColor: '#E639461A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E63946',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  badge: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F8F9FA',
    backgroundColor: '#E63946',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 12, lineHeight: 16, color: '#1A1A1A' },
  copy: { alignItems: 'center', gap: 8 },
  title: { maxWidth: 315, fontSize: 24, lineHeight: 32, textAlign: 'center', color: '#1A1A1A' },
  body: { fontSize: 13.5, lineHeight: 21.938, textAlign: 'center', color: '#4A4A4A' },
  emphasis: { color: '#E63946', textDecorationLine: 'underline' },
});
