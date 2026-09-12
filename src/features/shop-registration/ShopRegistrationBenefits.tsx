import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/design-tokens';

export function ShopRegistrationIntro() {
  return (
    <LinearGradient colors={['#FBE1E5', '#F8F9FA']} style={styles.intro}>
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary">
        <Ionicons name="storefront-outline" size={26} color="white" />
      </View>
      <View className="flex-1 gap-1">
        <Text className="font-sans-black text-sm text-ink">Trở thành Quán Đối tác</Text>
        <Text className="font-sans text-xs leading-[18px] text-muted">
          Ghim bài ưu tiên, đăng khuyến mãi theo giờ vàng và quản trị bảng tin riêng của quán.
        </Text>
      </View>
    </LinearGradient>
  );
}
export function ShopRegistrationBenefits() {
  return (
    <View className="gap-3">
      <Text className="font-sans-black text-sm text-ink">
        <Ionicons name="sparkles-outline" size={15} color={colors.primary.DEFAULT} /> ĐẶC QUYỀN CHỦ QUÁN
      </Text>
      <View className="flex-row gap-3">
        {(
          [
            {
              icon: 'pin-outline',
              title: 'Ghim tin tức 24/7',
              detail: 'Ưu tiên đầu bảng tin xóm',
              color: '#FF416C',
              background: '#FFF0F4',
            },
            {
              icon: 'checkmark-circle-outline',
              title: 'Tích xanh xác thực',
              detail: 'Tăng 300% độ tin tưởng',
              color: '#009977',
              background: '#E9F9F3',
            },
          ] as const
        ).map((item) => (
          <View key={item.title} className="flex-1 gap-2 rounded-2xl border border-[#E9ECEF] bg-white p-3">
            <View
              className="h-7 w-7 items-center justify-center rounded-lg"
              style={{ backgroundColor: item.background }}
            >
              <Ionicons name={item.icon} size={17} color={item.color} />
            </View>
            <Text className="font-sans-bold text-xs text-ink">{item.title}</Text>
            <Text className="font-sans text-[11px] leading-4 text-muted">{item.detail}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  intro: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#F2CBD7',
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
});
