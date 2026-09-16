import { StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { LegalCard } from '../legal/LegalCard';
// This screen is a design preview until an authenticated deletion receipt exists.
// The sample date is copied from Figma, not computed from the device clock.
export function DeletionSentDetails() {
  return (
    <View style={styles.cards}>
      <LegalCard style={styles.deadline}>
        <View style={styles.heading}>
          <CustomIcon name="deletionSentClock" size={17.891} />
          <Text className="font-sans-black" style={styles.headingText}>
            THỜI HẠN TỰ HUỶ DỮ LIỆU
          </Text>
          <Text className="font-sans-black" style={styles.remaining}>
            30 ngày còn lại
          </Text>
        </View>
        <View
          accessibilityRole="progressbar"
          accessibilityLabel="Thời hạn xoá minh hoạ"
          accessibilityValue={{ min: 0, max: 30, now: 30, text: '30 ngày còn lại, dữ liệu minh hoạ' }}
          style={styles.progress}
        />
        <Text className="font-sans" style={styles.deadlineBody}>
          Hạn chót:{' '}
          <Text className="font-sans-bold" style={styles.ink}>
            23:59 - 28/04/2025
          </Text>
          . Sau thời điểm này, toàn bộ số dư ví thưởng, lịch sử đăng bài và uy tín khu vực sẽ bị xoá sạch
          không thể phục hồi.
        </Text>
      </LegalCard>
      <LegalCard>
        <View style={styles.restoreHeading}>
          <View style={styles.restoreIcon}>
            <CustomIcon name="deletionSentRestore" size={14} />
          </View>
          <Text className="font-sans-bold" style={styles.restoreTitle}>
            Bạn đổi ý muốn giữ lại tài khoản?
          </Text>
        </View>
        <Text className="font-sans" style={styles.restoreBody}>
          Trong vòng{' '}
          <Text className="font-sans-bold" style={styles.ink}>
            30 ngày
          </Text>{' '}
          này, bạn chỉ cần{' '}
          <Text className="font-sans-semibold" style={styles.pink}>
            đăng nhập lại vào ứng dụng
          </Text>{' '}
          và chọn Huỷ yêu cầu xoá để tiếp tục sử dụng bình thường.
        </Text>
      </LegalCard>
    </View>
  );
}
const styles = StyleSheet.create({
  cards: { gap: 24 },
  deadline: {
    borderWidth: 2,
    borderColor: '#E639464D',
    backgroundColor: '#E639460D',
    gap: 12,
    shadowOpacity: 0,
    elevation: 0,
  },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headingText: { flex: 1, fontSize: 13, lineHeight: 19.5, letterSpacing: 0.65, color: '#E63946' },
  remaining: { width: 87, fontSize: 13, lineHeight: 19.5, color: '#E63946' },
  progress: { height: 8, borderRadius: 20, backgroundColor: '#E63946' },
  deadlineBody: { fontSize: 11.5, lineHeight: 18.688, color: '#4A4A4A' },
  ink: { color: '#1A1A1A' },
  restoreHeading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  restoreIcon: {
    width: 24,
    height: 24,
    borderRadius: 5.667,
    backgroundColor: '#00BC7D1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restoreTitle: { flex: 1, fontSize: 13, lineHeight: 19.5, color: '#1A1A1A' },
  restoreBody: { fontSize: 12, lineHeight: 19.5, color: '#4A4A4A' },
  pink: { color: '#FF416C' },
});
