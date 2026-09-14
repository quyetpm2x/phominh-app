import { StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { LegalCard } from '../legal/LegalCard';
import { CommunityHeading } from './CommunityRuleCard';
export function CommunityEnforcement() {
  return (
    <>
      <LegalCard>
        <CommunityHeading
          title="3. Cơ chế giám sát cộng đồng"
          subtitle="Cộng đồng tự quản văn minh"
          icon="communityModeration"
          color="#E17100"
          background="#FE9A001A"
        />
        <Text className="font-sans" style={styles.body}>
          Mỗi bài đăng có tính năng báo cáo vi phạm. Khi có từ{' '}
          <Text className="font-sans-bold" style={styles.ink}>
            3 báo cáo hợp lệ
          </Text>{' '}
          từ cư dân lân cận, bài đăng sẽ tự động bị tạm ẩn để kiểm duyệt.
        </Text>
      </LegalCard>
      <LegalCard>
        <CommunityHeading
          title="4. Biện pháp chế tài"
          subtitle="Bảo vệ quyền lợi chung"
          icon="communityPenalty"
          color="#FF416C"
          background="#FF416C1A"
        />
        <View style={styles.penalties}>
          <View style={[styles.penalty, styles.first]}>
            <Text className="font-sans-bold" style={[styles.label, styles.amber]}>
              Lần 1
            </Text>
            <Text className="font-sans" style={styles.detail}>
              <Text className="font-sans-bold" style={styles.ink}>
                -10 điểm
              </Text>{' '}
              uy tín & nhắc nhở
            </Text>
          </View>
          <View style={[styles.penalty, styles.second]}>
            <Text className="font-sans-bold" style={[styles.label, styles.orange]}>
              Lần 2
            </Text>
            <Text className="font-sans" style={styles.detail}>
              <Text className="font-sans-bold" style={styles.ink}>
                Cấm phát tin
              </Text>{' '}
              7 ngày
            </Text>
          </View>
          <View style={[styles.penalty, styles.third]}>
            <Text className="font-sans-bold" style={[styles.label, styles.red]}>
              Lần 3
            </Text>
            <Text className="font-sans-bold" style={[styles.detail, styles.red]}>
              Khóa vĩnh viễn tài khoản
            </Text>
          </View>
        </View>
      </LegalCard>
      <LegalCard style={styles.feedback}>
        <View style={styles.heading}>
          <CustomIcon name="communityFeedback" size={16} />
          <Text accessibilityRole="header" className="font-sans-bold" style={styles.title}>
            Góp ý xây dựng cộng đồng
          </Text>
        </View>
        <Text className="font-sans" style={styles.body}>
          Nếu phát hiện nội dung có nguy cơ gây hại, hãy bấm "Báo cáo" ngay tại bài viết hoặc liên hệ đội ngũ
          quản trị.
        </Text>
      </LegalCard>
    </>
  );
}
const styles = StyleSheet.create({
  body: { fontSize: 12, lineHeight: 19.5, color: '#4A4A4A' },
  ink: { color: '#1A1A1A' },
  penalties: { flexDirection: 'row', gap: 8, paddingTop: 4 },
  penalty: {
    flex: 1,
    minHeight: 66,
    padding: 10,
    gap: 4,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 14,
  },
  first: { backgroundColor: '#FE9A000D', borderColor: '#FE9A0033' },
  second: { backgroundColor: '#FF69000D', borderColor: '#FF690033' },
  third: { backgroundColor: '#E639461A', borderColor: '#E639464D' },
  label: { fontSize: 10, lineHeight: 15, textAlign: 'center' },
  detail: { fontSize: 10, lineHeight: 12.5, textAlign: 'center', color: '#4A4A4A' },
  amber: { color: '#E17100' },
  orange: { color: '#F54900' },
  red: { color: '#E63946' },
  feedback: { gap: 8, shadowOpacity: 0, elevation: 0 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1, fontSize: 12, lineHeight: 16, color: '#1A1A1A' },
});
