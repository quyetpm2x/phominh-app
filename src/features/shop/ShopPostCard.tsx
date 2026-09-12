import { Image, Pressable, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { type ShopPost } from './data';
import { ShopPostMetrics } from './ShopPostMetrics';

export function ShopPostCard({ post, onPress }: { post: ShopPost; onPress?: () => void }) {
  return (
    <View className="gap-3 rounded-[20px] border border-[#E9ECEF] bg-white p-3.5">
      <View className="flex-row gap-3">
        <Image source={post.image} accessibilityLabel={post.title} className="h-16 w-16 rounded-[14px]" />
        <View className="flex-1 gap-1.5">
          <View className="flex-row items-center justify-between gap-1">
            <Text
              className={`rounded px-1.5 py-0.5 font-sans-bold text-[9px] ${post.pinned ? 'bg-[#E9F9F3] text-[#009977]' : 'bg-[#F1F3F5] text-[#4A4A4A]'}`}
            >
              {post.pinned ? '• Đang ghim' : 'Bài thường'}
            </Text>
            <Text className="font-sans text-[10px] text-[#4A4A4A]">{post.time}</Text>
          </View>
          <Text numberOfLines={1} className="font-sans-bold text-[12px] text-[#1A1A1A]">
            {post.title}
          </Text>
          <Text numberOfLines={1} className="font-sans text-[11px] text-[#4A4A4A]">
            {post.description}
          </Text>
        </View>
      </View>
      <ShopPostMetrics post={post} pinned={post.pinned} />
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-0.5">
          <CustomIcon name="statsPin" size={12} />
          <Text className="font-sans text-[11px] text-[#4A4A4A]">
            Bán kính tiếp cận: <Text className="font-sans-bold">{post.radius}</Text>
          </Text>
        </View>
        {onPress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Chi tiết ${post.title}`}
            onPress={onPress}
            hitSlop={10}
            className="flex-row items-center gap-1 py-1"
          >
            <Text className="font-sans-bold text-[11px] text-primary">Chi tiết</Text>
            <CustomIcon name="menuChevron" size={12} color="#FF416C" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
