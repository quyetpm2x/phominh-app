import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';

import { colors } from '../constants/design-tokens';
import type { UIPost } from '../mocks/phoMinh';
import { Avatar } from './ui/Avatar';
import { Chip } from './ui/Chip';
import { FreshnessBorder } from './FreshnessBorder';
import { PhotoPlaceholder } from './ui/PhotoPlaceholder';

const TAG_COLOR: Record<UIPost['tagColor'], 'green' | 'gold' | 'red' | 'gray'> = {
  green: 'green',
  gold: 'gold',
  red: 'red',
  gray: 'gray',
};

const STRIP_COLOR: Record<UIPost['tagColor'], string> = {
  green: colors.primary.DEFAULT,
  gold: colors.accent[300],
  red: colors.danger.DEFAULT,
  gray: colors.border.strong,
};

interface PostCardProps {
  post: UIPost;
  onVote?: () => void;
  onConfirmUrgent?: () => void;
}

export function PostCard({ post, onVote, onConfirmUrgent }: PostCardProps) {
  const open = () => router.push(`/post/${post.id}`);

  if (post.variant === 'compact') {
    return (
      <Pressable onPress={open} className="rounded-2xl border border-border bg-white p-3 flex-row gap-3">
        <PhotoPlaceholder style={{ width: 86, height: 86, borderRadius: 12 }} />
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="font-sans-semibold text-[13.5px] text-ink">{post.author}</Text>
            <Chip label={post.tag} color={TAG_COLOR[post.tagColor]} />
          </View>
          <Text numberOfLines={2} className="mt-1 text-[13px] leading-[19px] text-ink/85">
            {post.text}
          </Text>
          <Text className="mt-1.5 font-mono-medium text-[11px] text-muted">
            {post.distance} · {post.timeAgo}
          </Text>
        </View>
      </Pressable>
    );
  }

  const cardBody = (
    <View className="overflow-hidden rounded-2xl flex-row">
      <View style={{ width: 3.5, backgroundColor: STRIP_COLOR[post.tagColor] }} />
      <View className="flex-1">
      <View className="p-3.5 pb-0 flex-row items-center gap-2.5">
        <Avatar initial={post.initial} color={post.avatarColor} size={38} radius={12} />
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="font-sans-bold text-[15.5px] text-ink">{post.author}</Text>
            {post.badge ? <Chip label={post.badge} color={post.isShop ? 'gold' : 'green'} /> : null}
            {post.isFaved ? <Chip label="★ Người quen" color="green" /> : null}
          </View>
          <Text className="mt-0.5 font-mono-medium text-[11px] text-muted">
            {post.distance} · {post.timeAgo}
          </Text>
        </View>
        <Chip label={post.tag} color={TAG_COLOR[post.tagColor]} />
        <Ionicons name="ellipsis-horizontal" size={16} color={colors.muted.DEFAULT} />
      </View>

      <Pressable onPress={open}>
        <Text className="px-3.5 pt-2.5 pb-3 text-[14.5px] leading-[22px] text-ink/85">{post.text}</Text>
      </Pressable>

      {post.hasVoice ? (
        <View className="mx-3.5 mb-3 flex-row items-center gap-2.5 rounded-xl bg-cream-dark border border-border-soft px-3 py-2.5">
          <View className="w-8 h-8 rounded-full bg-ink items-center justify-center">
            <Ionicons name="play" size={13} color="#fff" />
          </View>
          <Waveform />
          <Text className="font-mono-medium text-[11px] text-muted">{post.voiceLen}</Text>
        </View>
      ) : null}

      <PostPhotos count={post.photos} hasVideo={post.hasVideo} imageUrl={post.imageUrl} />

      {post.isUrgent ? (
        <View className="mx-3.5 mb-3 flex-row items-center gap-2.5 rounded-[11px] bg-danger-50 border border-danger-100 px-3 py-2.5">
          <Text className="flex-1 text-xs leading-[18px] text-danger-text">
            {post.confirmCount} người đã xác nhận · bấm nếu bạn cũng thấy đúng vậy
          </Text>
          <Pressable onPress={onConfirmUrgent} className="h-[30px] rounded-lg bg-danger px-2.5 items-center justify-center">
            <Text className="font-sans-semibold text-xs text-white">Tôi cũng thấy</Text>
          </Pressable>
        </View>
      ) : null}

      <View className="px-3.5 pb-2 flex-row items-center gap-2">
        <View className="w-[18px] h-[18px] rounded-full bg-primary items-center justify-center">
          <Text className="text-white text-[9px]">▲</Text>
        </View>
        <Text className="flex-1 text-xs text-muted">{post.votes} người thấy hữu ích</Text>
        <Text className="text-xs text-muted">{post.comments} bình luận</Text>
      </View>

      <View className="border-t border-border-soft flex-row items-center px-1.5 py-1">
        <Pressable onPress={onVote} className="flex-1 h-10 items-center justify-center flex-row gap-1.5">
          <Text className={post.hasVoted ? 'text-primary' : 'text-muted'}>▲</Text>
          <Text className={`font-sans-semibold text-[13.5px] ${post.hasVoted ? 'text-primary' : 'text-muted'}`}>
            Hữu ích
          </Text>
        </Pressable>
        <Pressable onPress={open} className="flex-1 h-10 items-center justify-center">
          <Text className="font-sans-semibold text-[13.5px] text-muted">Bình luận</Text>
        </Pressable>
      </View>

      <Text className="px-3.5 pb-2.5 font-mono-medium text-[10.5px] text-muted-light">
        {post.expiry} · {post.mediaNote}
      </Text>
      </View>
    </View>
  );

  if (post.createdAt && post.expiresAt) {
    return (
      <FreshnessBorder createdAt={post.createdAt} expiresAt={post.expiresAt}>
        {cardBody}
      </FreshnessBorder>
    );
  }
  return <View className="rounded-2xl border border-border bg-white overflow-hidden">{cardBody}</View>;
}

function PostPhotos({ count, hasVideo, imageUrl }: { count: number; hasVideo?: boolean; imageUrl?: string | null }) {
  if (count === 0) return null;
  if (count === 1) {
    return (
      <View className="px-3.5 pb-3">
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={{ height: 200, borderRadius: 12 }} resizeMode="cover" />
        ) : (
          <PhotoPlaceholder icon={hasVideo ? 'video' : 'photo'} style={{ height: 200, borderRadius: 12 }} />
        )}
      </View>
    );
  }
  const shown = Math.min(count, 3);
  const extra = count - 3;
  return (
    <View className="px-3.5 pb-3 flex-row gap-1.5">
      {Array.from({ length: shown }).map((_, i) => (
        <View key={i} className="flex-1 h-24 rounded-[10px] overflow-hidden">
          <PhotoPlaceholder style={{ flex: 1 }} label={i === shown - 1 && extra > 0 ? `+${extra}` : undefined} />
        </View>
      ))}
    </View>
  );
}

function Waveform() {
  const bars = [6, 12, 18, 10, 16, 8, 14, 9, 17, 11];
  return (
    <View className="flex-1 flex-row items-center gap-0.5 h-[22px]">
      {bars.map((h, i) => (
        <View key={i} style={{ width: 2, height: h, borderRadius: 1, backgroundColor: colors.muted.light }} />
      ))}
    </View>
  );
}
