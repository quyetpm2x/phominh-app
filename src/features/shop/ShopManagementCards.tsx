import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { colors } from '../../constants/design-tokens';
import { SHOP, type ShopAction } from './data';

export function ShopManagementCards({ onAction }: { onAction: (action: ShopAction) => void }) {
  return (
    <View className="rounded-[20px] border border-[#E9ECEF] bg-white px-4">
      <Pressable
        accessibilityRole="button"
        onPress={() => onAction('menu')}
        className="flex-row items-center gap-3 border-b border-[#F1F3F5] py-4"
      >
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/5">
          <CustomIcon name="feedPhotos" size={20} color={colors.primary.DEFAULT} />
        </View>
        <View className="flex-1 gap-1">
          <Text className="font-sans-bold text-sm text-[#1A1A1A]">Quản lý ảnh Menu</Text>
          <Text className="font-sans text-xs text-[#4A4A4A]">
            {SHOP.menuPhotoCount} ảnh thực đơn đã tải lên
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={17} color="#A0A0A0" />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => onAction('payments')}
        className="flex-row items-center gap-3 py-4"
      >
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/5">
          <Ionicons name="receipt-outline" size={20} color={colors.accent.DEFAULT} />
        </View>
        <View className="flex-1 gap-1">
          <Text className="font-sans-bold text-sm text-[#1A1A1A]">Lịch sử thanh toán gói</Text>
          <Text className="font-sans text-xs text-[#4A4A4A]">Gói hiển thị ưu tiên</Text>
        </View>
        <Ionicons name="chevron-forward" size={17} color="#A0A0A0" />
      </Pressable>
    </View>
  );
}
