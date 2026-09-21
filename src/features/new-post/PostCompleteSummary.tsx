import { StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { LegalCard } from '../legal/LegalCard';

export function PostCompleteSummary({ autoHide }: { autoHide: boolean }) {
  return (
    <LegalCard style={styles.card}>
      <View style={styles.row}>
        <View style={styles.timer}>
          <CustomIcon name="postCompleteTimer" size={18} />
        </View>
        <View style={styles.copy}>
          <Text className="font-sans-bold" style={styles.title}>
            Thời hạn bài đăng
          </Text>
          <Text className="font-sans" style={styles.subtitle}>
            {autoHide ? 'Tự động ẩn sau 48 giờ' : 'Không tự động ẩn'}
          </Text>
        </View>
        <View style={styles.status}>
          <View style={styles.dot} />
          <Text className="font-sans-bold" style={styles.statusText}>
            Đang phát
          </Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.range}>
        <View style={styles.rangeLabel}>
          <CustomIcon name="postCompleteRange" size={14} />
          <Text className="font-sans" style={styles.rangeText}>
            Phạm vi hiển thị
          </Text>
        </View>
        <Text className="font-sans-bold" style={styles.rangeValue}>
          Bán kính ~1.5 km
        </Text>
      </View>
    </LegalCard>
  );
}
const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 338,
    backgroundColor: '#FFFFFFE6',
    borderColor: '#E9ECEFB3',
    gap: 12,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  copy: { flex: 1 },
  timer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FF416C1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 13, lineHeight: 19.5, color: '#1A1A1A' },
  subtitle: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#00BC7D1A',
    borderWidth: 1,
    borderColor: '#00BC7D33',
    borderRadius: 100,
  },
  statusText: { fontSize: 11, lineHeight: 16.5, color: '#009966' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00BC7D', opacity: 0.58 },
  divider: { height: 1, backgroundColor: '#E9ECEF99' },
  range: {
    paddingTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  rangeLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rangeText: { fontSize: 12, lineHeight: 16, color: '#4A4A4A' },
  rangeValue: { fontSize: 12, lineHeight: 16, color: '#1A1A1A' },
});
