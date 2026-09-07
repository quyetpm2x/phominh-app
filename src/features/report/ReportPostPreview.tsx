import { Image, Text, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import type { FeedPost } from '../home/types';

export function ReportPostPreview({ post }: { post: FeedPost }) {
  return (
    <View className="flex-row items-center gap-3 rounded-[20px] border border-[#E9ECEF]/80 bg-white p-[15px]">
      <Avatar
        initial={post.name.charAt(0)}
        size={48}
        radius={13}
        imageUrl={Image.resolveAssetSource(post.photos[0] ?? post.avatar).uri}
      />
      <View className="flex-1 gap-0.5">
        <View className="flex-row items-center gap-1.5">
          <Text numberOfLines={1} className="shrink font-sans-bold text-xs leading-[18px] text-[#1A1A1A]">
            {post.name}
          </Text>
          <Text numberOfLines={1} className="font-sans text-[10px] text-[#4A4A4A]">
            • {post.time}
          </Text>
        </View>
        <Text numberOfLines={1} className="font-sans text-[11px] leading-[16.5px] text-[#4A4A4A]">
          “{post.text.replace(/==/g, '')}”
        </Text>
      </View>
    </View>
  );
}
