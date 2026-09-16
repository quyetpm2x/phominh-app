import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomIcon } from '../../components/ui/CustomIcon';
export function ShopFeatureHero() {
  return (
    <View style={styles.card}>
      <View style={styles.image}>
        <Image
          source={require('../../../assets/images/shop-features/hero.png')}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <LinearGradient colors={['#00000000', '#00000066', '#000000E6']} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.badge}>
          <CustomIcon name="shopFeatureBadge" size={11} />
          <Text className="font-sans-black" style={styles.badgeText}>
            Dành riêng cho Chủ quán
          </Text>
        </LinearGradient>
        <View style={styles.copy}>
          <Text className="font-sans-black" style={styles.title}>
            Bùng nổ đơn hàng tại khu vực lân cận
          </Text>
          <Text numberOfLines={1} className="font-sans" style={styles.subtitle}>
            Biến cư dân và nhân viên văn phòng xung quanh thành khách quen
          </Text>
        </View>
      </View>
      <View style={styles.stats}>
        {[
          ['1.5 - 5km', 'BÁN KÍNH QUÉT', '#FF416C'],
          ['10.000+', 'CƯ DÂN TIẾP CẬN', '#1A1A1A'],
          ['0 VNĐ', 'PHÍ HOA HỒNG', '#00BC7D'],
        ].map(([value, label, color], i) => (
          <View key={label} style={[styles.stat, i < 2 && styles.divider]}>
            <Text className="font-sans-black" style={[styles.value, { color }]}>
              {value}
            </Text>
            <Text className="font-sans-semibold" style={styles.label}>
              {label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    borderRadius: 30.667,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E9ECEFCC',
    backgroundColor: '#FFF',
  },
  image: { height: 176 },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
  },
  badgeText: { fontSize: 11, lineHeight: 16.5, letterSpacing: 0.275, color: '#FFF' },
  copy: { position: 'absolute', left: 12, right: 12, bottom: 12, gap: 4 },
  title: { fontSize: 19, lineHeight: 23.75, color: '#FFF' },
  subtitle: { fontSize: 12, lineHeight: 18, color: '#FFFFFFCC' },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF80',
  },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  divider: { borderRightWidth: 1, borderRightColor: '#E9ECEF' },
  value: { fontSize: 16, lineHeight: 24 },
  label: { fontSize: 10, lineHeight: 15, color: '#4A4A4A' },
});
