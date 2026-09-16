import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomIcon, type CustomIconProps } from '../../components/ui/CustomIcon';
import { LegalCard } from '../legal/LegalCard';
type Detail = { icon: CustomIconProps['name']; title: string; subtitle?: string; color?: string };
const features: {
  icon: CustomIconProps['name'];
  color: string;
  title: string;
  description: string;
  details?: Detail[];
}[] = [
  {
    icon: 'shopFeatureMenu',
    color: '#FF416C',
    title: 'Menu Trực Quan',
    description:
      'Tải ảnh thực đơn sắc nét, ghim đầu dòng tin và cập nhật giá bán tức thì tới mọi cư dân xung quanh.',
    details: [
      {
        icon: 'shopFeatureBest',
        title: 'Gắn Best Seller',
        subtitle: 'Nổi bật món đặc trưng',
        color: '#FF416C',
      },
      {
        icon: 'shopFeatureSync',
        title: 'Đồng bộ giá tức thì',
        subtitle: 'Thay đổi trong 1 chạm',
        color: '#00BC7D',
      },
    ],
  },
  {
    icon: 'shopFeatureGps',
    color: '#FF4B2B',
    title: 'Phân Phối Tự Động Theo GPS Thực',
    description:
      'Bán kính tiếp cận do thuật toán cộng đồng tự động quy định theo vị trí thực tế của quán, đảm bảo tin luôn tới đúng cư dân & dân văn phòng lân cận mà quán không cần cài đặt thủ công.',
  },
  {
    icon: 'shopFeatureChat',
    color: '#FE9A00',
    title: 'Khách Đặt & Nhắn Tin Nhanh',
    description:
      'Khách hàng xem bài có thể bấm gọi, gửi tin nhắn riêng thoại/ảnh hoặc mở ngay Google Maps chỉ đường tới cửa hàng mà không qua trung gian.',
    details: [
      { icon: 'shopFeatureDirections', title: 'Chỉ đường 1-chạm' },
      { icon: 'shopFeaturePhone', title: 'Gọi hotline quán' },
    ],
  },
  {
    icon: 'shopFeatureReport',
    color: '#00A6F4',
    title: 'Báo Cáo Tiếp Cận & Uy Tín Quán',
    description:
      'Xem rõ lượt xem thực tế, số cư dân đã lưu quán và phản hồi của người dân xung quanh để nâng cao chất lượng dịch vụ.',
  },
];
export function ShopFeatureCards() {
  return (
    <>
      {features.map((feature) => (
        <LegalCard key={feature.title} style={styles.card}>
          <View style={styles.heading}>
            <LinearGradient
              colors={[`${feature.color}33`, `${feature.color}0D`]}
              style={[styles.icon, { borderColor: `${feature.color}40` }]}
            >
              <CustomIcon name={feature.icon} size={24} />
            </LinearGradient>
            <View style={styles.copy}>
              <Text className="font-sans-black" style={styles.title}>
                {feature.title}
              </Text>
              <Text className="font-sans" style={styles.description}>
                {feature.description}
              </Text>
            </View>
          </View>
          {feature.details ? (
            <View style={styles.details}>
              {feature.details.map((detail) => (
                <View key={detail.title} style={styles.detail}>
                  {detail.subtitle ? (
                    <View style={[styles.smallIcon, { backgroundColor: `${detail.color}1A` }]}>
                      <CustomIcon name={detail.icon} size={12} />
                    </View>
                  ) : (
                    <CustomIcon name={detail.icon} size={16} />
                  )}
                  <View style={styles.detailCopy}>
                    <Text className="font-sans-bold" style={styles.detailTitle}>
                      {detail.title}
                    </Text>
                    {detail.subtitle ? (
                      <Text className="font-sans" style={styles.detailSubtitle}>
                        {detail.subtitle}
                      </Text>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          ) : null}
        </LegalCard>
      ))}
    </>
  );
}
const styles = StyleSheet.create({
  card: { padding: 16, gap: 14, borderColor: '#E9ECEFCC' },
  heading: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12.222,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 4 },
  title: { fontSize: 15, lineHeight: 22.5, color: '#1A1A1A' },
  description: { fontSize: 12, lineHeight: 19.5, color: '#4A4A4A' },
  details: { flexDirection: 'row', gap: 8 },
  detail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E9ECEFB3',
    backgroundColor: '#F1F3F599',
  },
  smallIcon: { width: 20, height: 20, borderRadius: 5.556, alignItems: 'center', justifyContent: 'center' },
  detailCopy: { flex: 1, gap: 2 },
  detailTitle: { fontSize: 11.5, lineHeight: 14.375, color: '#1A1A1A' },
  detailSubtitle: { fontSize: 10, lineHeight: 15, color: '#4A4A4A' },
});
