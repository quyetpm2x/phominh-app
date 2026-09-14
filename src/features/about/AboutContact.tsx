import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { SettingsSection } from '../settings/SettingsSection';
import { aboutStyles } from './styles';
export const ABOUT_WEBSITE = 'https://bantinbankinh.vn';
const SOCIALS = [
  { icon: 'aboutFacebook', label: 'Facebook' },
  { icon: 'aboutInstagram', label: 'Instagram' },
  { icon: 'aboutSocial', label: 'Kênh cộng đồng' },
  { icon: 'aboutYoutube', label: 'YouTube' },
] as const;
export function AboutContact({ onUnavailable }: { onUnavailable: (title: string) => void }) {
  const open = (url: string) =>
    void Linking.openURL(url).catch(() => Alert.alert('Chưa mở được liên kết', 'Vui lòng thử lại sau.'));
  return (
    <SettingsSection
      title="KÊNH LIÊN HỆ & HỖ TRỢ"
      gap={12}
      titleStyle={aboutStyles.heading}
      cardStyle={styles.card}
    >
      <View style={styles.row}>
        <Text className="font-sans" style={styles.label}>
          Đơn vị phát triển
        </Text>
        <Text className="font-sans-bold" style={styles.value}>
          Radius Social Team
        </Text>
      </View>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Email hỗ trợ hotro@bantinbankinh.vn"
        onPress={() => open('mailto:hotro@bantinbankinh.vn')}
        style={styles.row}
      >
        <Text className="font-sans" style={styles.label}>
          Email hỗ trợ
        </Text>
        <Text className="font-sans-bold" style={[styles.value, styles.email]}>
          hotro@bantinbankinh.vn
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Website chính thức bantinbankinh.vn"
        onPress={() => open(ABOUT_WEBSITE)}
        style={styles.row}
      >
        <Text className="font-sans" style={styles.label}>
          Website chính thức
        </Text>
        <Text className="font-sans-bold" style={styles.value}>
          bantinbankinh.vn
        </Text>
      </Pressable>
      <View style={styles.socials}>
        {SOCIALS.map((item) => (
          <Pressable
            key={item.icon}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            onPress={() => onUnavailable(item.label)}
            style={styles.social}
          >
            <CustomIcon name={item.icon} size={20} />
          </Pressable>
        ))}
      </View>
    </SettingsSection>
  );
}
const styles = StyleSheet.create({
  card: { padding: 16, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  label: { fontSize: 12.5, lineHeight: 18.75, color: '#4A4A4A', flexShrink: 1 },
  value: { fontSize: 12.5, lineHeight: 18.75, color: '#1A1A1A', textAlign: 'right', flexShrink: 1 },
  email: { color: '#FF416C' },
  socials: {
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  social: {
    width: 40,
    height: 40,
    borderRadius: 11.111,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
});
