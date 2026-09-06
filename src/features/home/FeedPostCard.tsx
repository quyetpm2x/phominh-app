import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { HighlightedText } from '../../components/ui/HighlightedText';
import { colors } from '../../constants/design-tokens';
import { PostMedia } from './PostMedia';
import type { FeedPost } from './types';
interface Props {
  post: FeedPost;
  liked: boolean;
  commentCount: number;
  onOpenPost: () => void;
  onLike: () => void;
  onMenu: () => void;
  onComments: () => void;
  onShare: () => void;
  onDetails: () => void;
  onOpenGallery: () => void;
}
export function FeedPostCard({
  post,
  liked,
  commentCount,
  onOpenPost,
  onLike,
  onMenu,
  onComments,
  onShare,
  onDetails,
  onOpenGallery,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Xem bài đăng của ${post.name}`}
      onPress={onOpenPost}
      style={[styles.post, { borderColor: post.color }]}
    >
      <View className="flex-row items-start gap-3 px-4 pt-4 pb-3">
        <View style={{ borderColor: post.color }} className="rounded-full border p-0.5">
          <Avatar
            initial={post.name.charAt(0)}
            imageUrl={Image.resolveAssetSource(post.avatar).uri}
            size={38}
            radius={19}
          />
          <View
            style={{ backgroundColor: post.color }}
            className="absolute -bottom-0.5 -right-0.5 h-4 w-4 items-center justify-center rounded-full"
          >
            {post.merchant ? (
              <Text className="text-[9px] text-white">★</Text>
            ) : (
              <CustomIcon name="feedShield" size={9} color="white" />
            )}
          </View>
        </View>
        <View className="flex-1 gap-1">
          <View className="flex-row flex-wrap items-center gap-x-2 gap-y-1">
            <Text className="font-sans-bold text-[15px] leading-[22.5px] text-primary-darker">
              {post.name}
            </Text>
            <View
              style={{ borderColor: `${post.color}33`, backgroundColor: `${post.color}1A` }}
              className="rounded-full border px-2 py-0.5"
            >
              <Text style={{ color: post.color }} className="font-sans-black text-[9px] tracking-[0.3px]">
                {post.badge}
              </Text>
            </View>
          </View>
          <View className="flex-row flex-wrap items-center gap-1.5">
            <CustomIcon name={post.merchant ? 'feedRank' : 'feedConfirm'} size={12} />
            <Text style={{ color: post.color }} className="font-sans-bold text-[10px]">
              {post.rank}
            </Text>
            <Text className="text-[10px] text-[#4A4A4A]">•</Text>
            <CustomIcon name={post.merchant ? 'feedTimer' : 'feedClock'} size={11} />
            <Text
              style={post.merchant ? styles.expiryText : styles.metaText}
              className="font-sans-medium text-[10px]"
            >
              {post.time}
            </Text>
            <Text className="text-[10px] text-[#4A4A4A]">•</Text>
            <CustomIcon name={post.merchant ? 'feedDistance' : 'feedDistanceAlt'} size={10} />
            <Text className="font-sans-bold text-[10px] text-primary-darker">{post.distance}</Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Tuỳ chọn bài của ${post.name}`}
          hitSlop={10}
          onPress={onMenu}
        >
          <CustomIcon name="feedMore" size={16} />
        </Pressable>
      </View>
      <HighlightedText
        text={post.text}
        highlightColor={post.color}
        highlightBackground={`${post.color}1A`}
        className="px-4 pb-3 font-sans text-[14px] leading-[22.75px] text-primary-darker"
      />
      <PostMedia post={post} onOpenGallery={onOpenGallery} />
      <View className="flex-row flex-wrap items-center justify-between border-t border-border/80 bg-cream-surface/40 px-3 py-2">
        <View className="flex-row items-center gap-1">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Thích bài viết"
            accessibilityState={{ selected: liked }}
            onPress={onLike}
            className="min-h-9 flex-row items-center gap-1.5 px-2"
          >
            {liked ? (
              <Ionicons name="heart" size={17} color={colors.primary.DEFAULT} />
            ) : (
              <CustomIcon name={post.merchant ? 'feedHeart' : 'feedHeartOutline'} size={17} />
            )}
            <Text
              className={
                post.merchant || liked
                  ? 'font-sans-bold text-xs text-primary'
                  : 'font-sans-bold text-xs text-primary-darker'
              }
            >
              {post.likes + (liked ? 1 : 0)}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Xem bình luận"
            onPress={onComments}
            className="min-h-9 flex-row items-center gap-1.5 px-2"
          >
            <CustomIcon name="feedComment" size={17} />
            <Text className="font-sans-semibold text-xs text-[#4A4A4A]">{post.comments + commentCount}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Chia sẻ bài viết"
            onPress={onShare}
            className="min-h-9 justify-center px-2"
          >
            <CustomIcon name="feedShare" size={17} />
          </Pressable>
        </View>
        <Pressable accessibilityRole="button" onPress={onDetails}>
          {post.merchant ? (
            <LinearGradient colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]} style={styles.contact}>
              <CustomIcon name="feedPhone" size={13} color="white" />
              <Text className="font-sans-bold text-xs text-white">Liên hệ quán</Text>
            </LinearGradient>
          ) : (
            <View className="flex-row items-center gap-1.5 rounded-[9px] border border-border bg-white px-3 py-2">
              <CustomIcon name="feedArrow" size={12} />
              <Text className="font-sans-bold text-xs text-primary-darker">Xem chi tiết</Text>
            </View>
          )}
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  expiryText: { color: '#FFB900' },

  metaText: { color: '#4A4A4A' },

  post: { backgroundColor: '#fff', borderWidth: 1, borderLeftWidth: 5, borderRadius: 20, overflow: 'hidden' },

  contact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
