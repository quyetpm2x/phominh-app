import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Button, GradientButton } from '../../components/ui/Button';
import { colors } from '../../constants/design-tokens';

export function ShopRegistrationBanner() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <View className="flex-row items-center gap-2 rounded-[20px] border border-primary/15 bg-[#FFF4F7] p-3">
        <LinearGradient colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]} style={styles.icon}>
          <Ionicons name="storefront-outline" size={20} color="white" />
        </LinearGradient>
        <View className="flex-1 gap-0.5">
          <View className="flex-row items-center gap-1">
            <Text className="font-sans-bold text-xs text-[#1A1A1A]">Bạn có dịch vụ gần đây?</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Thông tin tính năng quán"
              hitSlop={8}
              onPress={() => setOpen(true)}
            >
              <Ionicons name="information-circle-outline" size={14} color={colors.primary.DEFAULT} />
            </Pressable>
          </View>
          <Text className="font-sans text-[10px] leading-[14px] text-[#4A4A4A]">
            Mở khoá tính năng quán, thống kê và tiếp cận cư dân gần
          </Text>
        </View>
        <GradientButton label="Đăng ký ›" compact onPress={() => router.push('/shop/register')} />
      </View>
      <BottomSheet visible={open} onClose={() => setOpen(false)} variant="actions">
        <View className="gap-4 py-4">
          <Text accessibilityRole="header" className="font-sans-bold text-lg text-ink">
            Đăng ký Chủ quán
          </Text>
          <Text className="font-sans text-sm leading-6 text-muted">
            Ghim bài ưu tiên, đăng khuyến mãi và theo dõi hiệu quả tiếp cận của quán.
          </Text>
          <Button label="Đóng" variant="outline" onPress={() => setOpen(false)} />
        </View>
      </BottomSheet>
    </>
  );
}
const styles = StyleSheet.create({
  icon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
