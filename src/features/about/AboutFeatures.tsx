import { StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { SettingsSection } from '../settings/SettingsSection';
import { aboutStyles } from './styles';
const FEATURES = [
  {
    icon: 'aboutRadius',
    color: '#FF416C1A',
    title: 'Tin tức theo bán kính',
    body: 'Cập nhật chính xác chuyện khu phố quanh bạn 500m - 5km',
  },
  {
    icon: 'aboutReputation',
    color: '#FE9A001A',
    title: 'Điểm uy tín cư dân',
    body: 'Xác minh tin thật, bảo vệ không gian sống văn minh',
  },
  {
    icon: 'aboutShop',
    color: '#00BC7D1A',
    title: 'Kết nối quán địa\nphương',
    body: 'Hỗ trợ hàng quán xóm phố tiếp cận khách hàng thực',
  },
  {
    icon: 'aboutWallet',
    color: '#2B7FFF1A',
    title: 'Ví thưởng cộng đồng',
    body: 'Đóng góp tin tốt nhận thưởng và rút tiền về ngân hàng',
  },
] as const;
export function AboutFeatures() {
  return (
    <SettingsSection
      title="SỨ MỆNH & TÍNH NĂNG NỔI BẬT"
      gap={12}
      titleStyle={aboutStyles.heading}
      cardStyle={styles.grid}
    >
      {FEATURES.map((item) => (
        <View key={item.icon} style={styles.card}>
          <View style={[styles.icon, { backgroundColor: item.color }]}>
            <CustomIcon name={item.icon} size={18} />
          </View>
          <Text className="font-sans-bold" style={styles.title}>
            {item.title}
          </Text>
          <Text className="font-sans" style={styles.body}>
            {item.body}
          </Text>
        </View>
      ))}
    </SettingsSection>
  );
}
const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: 'transparent',
    borderWidth: 0,
    shadowOpacity: 0,
  },
  card: {
    flexBasis: '45%',
    flexGrow: 1,
    padding: 14,
    minHeight: 149.125,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 19.556,
    backgroundColor: '#FFF',
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  icon: { width: 32, height: 32, borderRadius: 8.889, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 13, lineHeight: 19.5, color: '#1A1A1A' },
  body: { fontSize: 11, lineHeight: 17.875, color: '#4A4A4A' },
});
