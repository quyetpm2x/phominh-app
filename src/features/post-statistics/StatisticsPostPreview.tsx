import { Image, Text, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import type { FeedPost } from '../home/types';
import type { PostAnalytics } from './data';

export function StatisticsPostPreview({ post, analytics }: { post: FeedPost; analytics?: PostAnalytics }) {
  return (
    <View className="flex-row items-center gap-3 rounded-[20px] border border-[#E9ECEF]/80 bg-white p-3.5">
      <Avatar
        initial={post.name.charAt(0)}
        size={56}
        radius={14}
        imageUrl={Image.resolveAssetSource(post.photos[0] ?? post.avatar).uri}
      />
      <View className="flex-1 gap-0.5">
        <View className="flex-row flex-wrap items-center gap-1.5">
          <Text className="rounded-md bg-primary/10 px-1.5 py-0.5 font-sans-bold text-[10px] text-primary">
            Đã đăng {post.time}
          </Text>
          {analytics ? (
            <Text className="font-sans text-[10px] text-[#4A4A4A]">• Bán kính {analytics.radius}</Text>
          ) : null}
        </View>
        <Text numberOfLines={1} className="font-sans-bold text-[12.5px] leading-[19px] text-[#1A1A1A]">
          {post.text.replace(/==/g, '')}
        </Text>
        <Text className="font-sans text-[11px] leading-[17px] text-[#4A4A4A]">
          {analytics?.area ?? 'Khu vực của bạn'}
        </Text>
      </View>
    </View>
  );
}
