import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { Button } from '../../components/ui/Button';
export function ShopFeatureRegistration() {
  return (
    <LinearGradient colors={['#FF416C1A', '#FF4B2B1A', '#FFFFFF']} style={styles.card}>
      <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.icon}>
        <CustomIcon name="shopFeatureStore" size={24} />
      </LinearGradient>
      <View style={styles.copy}>
        <Text className="font-sans-black" style={styles.title}>
          Sẵn sàng mở rộng quán của bạn?
        </Text>
        <Text className="font-sans" style={styles.subtitle}>
          Đăng ký chỉ mất 1 phút với số điện thoại và địa chỉ quán
        </Text>
      </View>
      <View style={styles.actions}>
        <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.gradient}>
          <Button
            accessibilityRole="button"
            label="Đăng ký tài khoản Quán ngay"
            onPress={() => router.push('/shop/register')}
            style={styles.register}
            labelStyle={styles.registerText}
            trailingIcon={<CustomIcon name="shopFeatureArrow" size={16} />}
          />
        </LinearGradient>
        <Button
          accessibilityRole="button"
          label="Xem hướng dẫn chi tiết (FAQ)"
          variant="outline"
          style={styles.faq}
          labelStyle={styles.faqText}
          onPress={() => router.push('/help-faq')}
        />
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 30.667,
    borderWidth: 1,
    borderColor: '#FF416C40',
    gap: 12,
    alignItems: 'center',
  },
  icon: { width: 48, height: 48, borderRadius: 13.333, alignItems: 'center', justifyContent: 'center' },
  copy: { gap: 4, alignSelf: 'stretch' },
  title: { fontSize: 16, lineHeight: 24, textAlign: 'center', color: '#1A1A1A' },
  subtitle: { fontSize: 12, lineHeight: 18, textAlign: 'center', color: '#4A4A4A' },
  actions: { alignSelf: 'stretch', gap: 8, paddingTop: 4 },
  gradient: {
    borderRadius: 12.5,
    shadowColor: '#FF416C',
    shadowOpacity: 0.25,
    shadowRadius: 7.5,
    shadowOffset: { width: 0, height: 6 },
  },
  register: {
    height: 45,
    backgroundColor: 'transparent',
    borderRadius: 12.5,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 8,
  },
  registerText: { fontFamily: 'BeVietnamPro_900Black', fontSize: 14, lineHeight: 21 },
  faq: {
    height: 40,
    borderRadius: 11.111,
    backgroundColor: '#F1F3F5B3',
    borderColor: '#E9ECEFCC',
    paddingHorizontal: 8,
  },
  faqText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 12, lineHeight: 18 },
});
