import { StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { LegalCard } from '../legal/LegalCard';
const WARNINGS = [
  'Sau khi xác nhận, tài khoản sẽ vào trạng thái tạm khoá 30 ngày.',
  'Mọi số dư ví thưởng và điểm uy tín sẽ bị huỷ bỏ hoàn toàn.',
  'Bạn có thể đăng nhập lại trong 30 ngày để huỷ yêu cầu xoá.',
];
export function DeleteAccountWarning() {
  return (
    <LegalCard style={styles.card}>
      <View style={styles.heading}>
        <CustomIcon name="deleteWarning" size={16} />
        <Text className="font-sans-bold" style={styles.title}>
          Cảnh báo quan trọng:
        </Text>
      </View>
      <View style={styles.list}>
        {WARNINGS.map((text) => (
          <Text key={text} className="font-sans" style={styles.body}>
            {text}
          </Text>
        ))}
      </View>
    </LegalCard>
  );
}
const styles = StyleSheet.create({
  card: { gap: 8, backgroundColor: '#E639460D', borderColor: '#E6394633', shadowOpacity: 0, elevation: 0 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 12.5, lineHeight: 18.75, color: '#E63946' },
  list: { paddingLeft: 20, gap: 4 },
  body: { fontSize: 11.5, lineHeight: 17.25, color: '#4A4A4A' },
});
