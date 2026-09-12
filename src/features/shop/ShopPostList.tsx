import { Pressable, Text, View } from 'react-native';
import { SHOP_POSTS, type ShopPost } from './data';
import { ShopPostCard } from './ShopPostCard';

export function ShopPostList({
  onSelect,
  onViewAll,
}: {
  onSelect: (post: ShopPost) => void;
  onViewAll?: () => void;
}) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-2">
        <Text accessibilityRole="header" className="font-sans-bold text-[14px] text-[#1A1A1A]">
          Hiệu quả từng bài đăng
        </Text>
        <Text className="rounded-full bg-primary/10 px-2 py-0.5 font-sans-bold text-[9px] text-primary">
          3 bài đang chạy
        </Text>
        {onViewAll ? (
          <Pressable accessibilityRole="button" onPress={onViewAll} hitSlop={8} className="ml-auto py-1">
            <Text className="font-sans-bold text-[11px] text-primary">Xem tất cả</Text>
          </Pressable>
        ) : null}
      </View>
      {SHOP_POSTS.map((post) => (
        <ShopPostCard key={post.id} post={post} onPress={() => onSelect(post)} />
      ))}
    </View>
  );
}
