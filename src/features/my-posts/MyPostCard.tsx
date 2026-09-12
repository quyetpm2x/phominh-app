import { Image, Pressable, Text, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { MyPostPerformance } from './MyPostPerformance';
import { postStatus, type MyPost } from './data';

export function MyPostCard({
  post,
  onMenu,
  onExtend,
  onOpen,
  personal = false,
}: {
  post: MyPost;
  onMenu?: () => void;
  onExtend?: () => void;
  onOpen?: () => void;
  personal?: boolean;
}) {
  const hours = post.remainingHours ?? 0;
  const status = postStatus(hours);
  return (
    <View
      className={`gap-3.5 overflow-hidden rounded-[30px] border bg-white p-4 ${post.photos.length ? 'border-primary/30 border-l-[3px]' : 'border-[#E9ECEF]'}`}
    >
      <View className="flex-row items-center gap-2.5">
        <Avatar initial="Q" imageUrl={Image.resolveAssetSource(post.avatar).uri} size={40} radius={20} />
        <View className="flex-1 gap-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="font-sans-bold text-[14px] text-[#1A1A1A]">{post.name}</Text>
            <Text
              className={`rounded px-1.5 py-0.5 font-sans-bold text-[9px] ${status === 'active' ? 'bg-[#E9F9F3] text-[#009977]' : status === 'expiring' ? 'bg-[#FFF3DF] text-[#B66D00]' : 'bg-[#F1F3F5] text-[#4A4A4A]'}`}
            >
              {status === 'active' ? 'Đang hiển thị' : status === 'expiring' ? 'Sắp hết hạn' : 'Đã hết hạn'}
            </Text>
          </View>
          <Text className="font-sans text-[11px] text-[#4A4A4A]">
            {hours > 0 ? `Hết hạn sau ${hours} giờ` : 'Đã hết hạn'} • {post.area} ({post.radius})
          </Text>
        </View>
        {onMenu ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Tuỳ chọn bài của ${post.name}`}
            hitSlop={10}
            onPress={onMenu}
          >
            <View className="rotate-90 p-1 bg-[#f1f3f5a0] rounded-full">
              <CustomIcon name="feedMore" size={16} />
            </View>
          </Pressable>
        ) : null}
      </View>
      <Text onPress={onOpen} className="font-sans text-[13px] leading-[22px] text-[#1A1A1A]">
        {post.text}
      </Text>
      {post.photos.length ? (
        <View className={personal ? 'w-[66%] flex-row flex-wrap gap-2' : 'flex-row gap-2'}>
          {post.photos.map((photo, index) => (
            <Pressable
              key={index}
              accessibilityRole="button"
              accessibilityLabel={`Xem ảnh ${index + 1}`}
              onPress={onOpen}
              disabled={!onOpen}
              className={
                personal
                  ? 'h-[136px] w-[47%] overflow-hidden rounded-[18px]'
                  : 'h-[148px] flex-1 overflow-hidden rounded-[18px]'
              }
            >
              <Image source={photo} className="h-full w-full" resizeMode="cover" />
            </Pressable>
          ))}
        </View>
      ) : null}
      <MyPostPerformance post={post} />
      <View className="flex-row items-center justify-between pt-1">
        <View className="flex-row items-center gap-1.5">
          <CustomIcon name="statsRadius" size={14} />
          <Text className="font-sans text-[11px] text-[#4A4A4A]">
            Bán kính quét: <Text className="font-sans-bold">{post.radius}</Text>
          </Text>
        </View>
        {onExtend ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Gia hạn: ${post.text}`}
            onPress={onExtend}
            hitSlop={6}
            className="rounded-full bg-primary/10 px-3.5 py-2"
          >
            <Text className="font-sans-bold text-[11px] text-primary">Gia hạn</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
