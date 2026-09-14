import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { Button } from '../../components/ui/Button';
import { PRIVACY_EMAIL } from './data';
export function PolicyContact() {
  const contact = () =>
    void Linking.openURL(
      `mailto:${PRIVACY_EMAIL}?subject=${encodeURIComponent('Yêu cầu hỗ trợ bảo mật')}`,
    ).catch(() => Alert.alert('Không thể mở ứng dụng email', `Vui lòng gửi yêu cầu đến ${PRIVACY_EMAIL}.`));
  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <CustomIcon name="policyContact" size={16} />
        <Text accessibilityRole="header" className="font-sans-bold" style={styles.title}>
          Liên hệ Ban Phụ trách Bảo mật
        </Text>
      </View>
      <Text className="font-sans" style={styles.body}>
        Mọi câu hỏi hoặc khiếu nại về an toàn dữ liệu cá nhân, vui lòng liên hệ:{' '}
        <Text className="font-sans-bold">{PRIVACY_EMAIL}</Text>
      </Text>
      <Button
        accessibilityRole="button"
        label="Gửi thư yêu cầu hỗ trợ bảo mật"
        variant="soft"
        leadingIcon={<CustomIcon name="policyMail" size={12} />}
        labelStyle={styles.buttonText}
        style={styles.button}
        onPress={contact}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 19.556,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1, fontSize: 13, lineHeight: 19.5, color: '#1A1A1A' },
  body: { fontSize: 11.5, lineHeight: 18.688, color: '#4A4A4A' },
  button: {
    minHeight: 36,
    height: 'auto',
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 6,
  },
  buttonText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 12,
    lineHeight: 18,
    flexShrink: 1,
    textAlign: 'center',
  },
});
