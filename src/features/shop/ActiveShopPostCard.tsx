import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/design-tokens';
import { ACTIVE_SHOP_POST } from './data';
import { ShopPostMetrics } from './ShopPostMetrics';

export function ActiveShopPostCard() {
  const post = ACTIVE_SHOP_POST;
  return (
    <View className="overflow-hidden rounded-[20px] border border-[#E9ECEF] bg-white">
      <LinearGradient colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]} style={styles.banner}>
        <Ionicons name="radio-outline" size={13} color="white" />
        <Text className="flex-1 font-sans-black text-[10px] text-white">TIN ĐANG GHIM HÔM NAY</Text>
        <View className="flex-row items-center gap-1 rounded-full bg-black/15 px-2 py-0.5">
          <Ionicons name="stopwatch-outline" size={12} color="white" />
          <Text className="font-sans-bold text-[10px] text-white">Còn {post.remainingTime}</Text>
        </View>
      </LinearGradient>
      <View className="flex-row items-start gap-3 p-3.5">
        <Image
          source={post.image}
          accessibilityLabel="Bún chả và nước vối tươi"
          className="h-16 w-16 rounded-[14px]"
        />
        <View className="flex-1 gap-1">
          <Text numberOfLines={1} className="font-sans-bold text-[14px] text-[#1A1A1A]">
            {post.title}
          </Text>
          <Text className="font-sans text-[11px] text-[#4A4A4A]">Tiếp cận cư dân bán kính 2km</Text>
          <ShopPostMetrics post={post} compact />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { paddingHorizontal: 14, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', gap: 6 },
});
