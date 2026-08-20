import { router } from 'expo-router';
import { Image, Linking, Pressable, Text, View } from 'react-native';

import type { PostDetail } from '../api/endpoints/posts';
import { fontSizeToStyle } from '../constants/post-style-presets';
import { formatDistance } from '../utils/formatDistance';
import { formatFreshness } from '../utils/formatFreshness';
import { Avatar } from './ui/Avatar';
import { Chip } from './ui/Chip';

interface PostDetailHeaderProps {
  post: PostDetail;
  canVote: boolean;
  onVote: () => void;
}

export function PostDetailHeader({ post, canVote, onVote }: PostDetailHeaderProps) {
  const voted = post.hasVoted;
  const merchantContact = post.merchantContact;
  return (
    <>
      <Pressable
        onPress={() => router.push(`/profile/${post.authorId}`)}
        className="px-4 pt-3.5 flex-row items-center gap-2.5"
      >
        <Avatar initial={post.authorDisplayName.charAt(0).toUpperCase()} size={40} radius={13} />
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="font-sans-semibold text-[14.5px] text-ink">{post.authorDisplayName}</Text>
            <Chip label={post.authorBadge} color="green" />
          </View>
          <Text className="text-[11.5px] text-muted mt-0.5">
            {formatFreshness(post.createdAt)} · {post.displayMode === 'real_name' ? 'Tên thật' : 'Bí danh'}
          </Text>
        </View>
      </Pressable>

      <Text
        className="px-4 pt-3 pb-3.5 text-ink/85"
        style={[
          { color: post.textColor ?? undefined, backgroundColor: post.backgroundColor ?? undefined },
          fontSizeToStyle(post.fontSize),
        ]}
      >
        {post.content}
      </Text>

      {post.imageUrl ? (
        <Image source={{ uri: post.imageUrl }} style={{ height: 230, width: '100%' }} resizeMode="cover" />
      ) : null}

      <View className="mx-4 mt-3.5 flex-row items-center gap-2.5 rounded-xl border border-border bg-cream px-3.5 py-2.5">
        <View className="w-11 h-11 rounded-[9px] bg-map items-center justify-center">
          <View className="w-[9px] h-[9px] rounded-full bg-primary border-2 border-white" />
        </View>
        <View className="flex-1">
          <Text className="text-[11.5px] text-muted mt-0.5">
            Vị trí GPS lúc đăng · {formatDistance(0)} từ bạn
          </Text>
        </View>
      </View>

      <View className="px-4 pt-3.5 pb-2 flex-row gap-2">
        <Pressable
          onPress={onVote}
          disabled={voted || !canVote}
          className={`h-9 rounded-[10px] px-3.5 flex-row items-center gap-1.5 ${
            voted ? 'bg-primary' : 'border border-border bg-white'
          } ${!canVote ? 'opacity-50' : ''}`}
        >
          <Text className={voted ? 'text-white' : 'text-ink'}>▲</Text>
          <Text className={`font-sans-semibold text-[13px] ${voted ? 'text-white' : 'text-ink'}`}>
            Hữu ích · {post.voteCount}
          </Text>
        </Pressable>
        {merchantContact ? (
          <>
            <Pressable
              onPress={() => void Linking.openURL(`tel:${merchantContact.phoneNumber}`)}
              className="h-9 rounded-[10px] px-3.5 flex-row items-center gap-1.5 bg-primary"
            >
              <Text className="font-sans-semibold text-[13px] text-white">
                Gọi {merchantContact.phoneNumber}
              </Text>
            </Pressable>
            {merchantContact.zaloEnabled ? (
              <Pressable
                onPress={() =>
                  void Linking.openURL(`https://zalo.me/${merchantContact.phoneNumber.replace(/\D/g, '')}`)
                }
                className="h-9 rounded-[10px] px-3.5 flex-row items-center gap-1.5 border border-border bg-white"
              >
                <Text className="font-sans-semibold text-[13px] text-ink">Nhắn Zalo</Text>
              </Pressable>
            ) : null}
          </>
        ) : null}
      </View>
    </>
  );
}
