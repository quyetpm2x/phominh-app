import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { SettingsRow, SettingsSection } from '../settings/SettingsSection';
import { aboutStyles } from './styles';
export function AboutLegal({ onUnavailable }: { onUnavailable: (title: string) => void }) {
  return (
    <SettingsSection title="THÔNG TIN & PHÁP LÝ" gap={12} titleStyle={aboutStyles.heading}>
      <SettingsRow
        variant="about"
        icon="aboutCommunity"
        title="Chính sách cộng đồng"
        trailing={
          <Text className="font-sans-bold" style={styles.badge}>
            Quy chuẩn
          </Text>
        }
        onPress={() => router.push('/community-policy')}
      />
      <SettingsRow
        variant="about"
        icon="aboutTerms"
        title="Điều khoản dịch vụ"
        onPress={() => router.push('/(auth)/terms-of-use')}
      />
      <SettingsRow
        variant="about"
        icon="aboutPrivacy"
        title="Chính sách bảo mật"
        onPress={() => router.push('/privacy-policy')}
      />
      <SettingsRow
        variant="about"
        icon="aboutUpdates"
        title="Nhật ký cập nhật phiên bản"
        trailing={
          <Text className="font-sans-bold" style={styles.latest}>
            Mới nhất
          </Text>
        }
        hideChevron
        onPress={() => onUnavailable('Nhật ký cập nhật phiên bản')}
      />
      <SettingsRow
        variant="about"
        icon="aboutStar"
        title="Đánh giá ứng dụng trên App Store / Play Store"
        hideChevron
        last
        onPress={() => onUnavailable('Đánh giá ứng dụng')}
      />
    </SettingsSection>
  );
}
const styles = StyleSheet.create({
  badge: {
    fontSize: 10,
    lineHeight: 15,
    color: '#FF416C',
    backgroundColor: '#FF416C1A',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  latest: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
});
