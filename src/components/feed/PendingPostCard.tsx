import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';

import { colors } from '../../constants/design-tokens';
import { submitPendingPost } from '../../lib/submitPendingPost';
import { usePendingPostStore, type PendingPost } from '../../stores/pendingPostStore';
import { Avatar } from '../ui/Avatar';

// Thẻ "Đang đăng…" kiểu Facebook — hiện ngay đầu Dòng tin trong lúc upload ảnh + tạo bài chạy nền
// (submitPendingPost), thay bằng bài thật hoặc báo lỗi kèm nút thử lại, không bắt user chờ màn hình.
export function PendingPostCard({ post }: { post: PendingPost }) {
  const queryClient = useQueryClient();
  const removePending = usePendingPostStore((s) => s.removePending);
  const isError = post.status === 'error';

  return (
    <View className="rounded-2xl border border-border bg-white overflow-hidden flex-row">
      <View style={{ width: 3.5, backgroundColor: isError ? colors.danger.DEFAULT : colors.primary.DEFAULT }} />
      <View className="flex-1">
        <View className="p-3.5 pb-2.5 flex-row items-center gap-2.5">
          <Avatar initial={post.authorDisplayName.charAt(0).toUpperCase()} size={38} radius={12} />
          <View className="flex-1">
            <Text className="font-sans-bold text-[15.5px] text-ink" numberOfLines={1}>
              {post.authorDisplayName}
            </Text>
            <Text className="mt-0.5 font-mono-medium text-[11px] text-muted">
              {isError ? 'Đăng thất bại' : 'Đang đăng…'}
            </Text>
          </View>
          {isError ? null : <ActivityIndicator size="small" color={colors.primary.DEFAULT} />}
        </View>

        {post.content ? (
          <Text className="px-3.5 pb-3 text-[14.5px] leading-[22px] text-ink/85">{post.content}</Text>
        ) : null}

        <Image
          source={{ uri: post.photoUri }}
          style={{ height: 220, width: '100%', opacity: isError ? 1 : 0.55 }}
          resizeMode="cover"
        />

        {isError ? (
          <View className="px-3.5 py-2.5 flex-row items-center gap-2.5 border-t border-border-soft">
            <Ionicons name="alert-circle" size={15} color={colors.danger.DEFAULT} />
            <Text className="flex-1 text-xs text-danger" numberOfLines={2}>
              {post.errorMessage ?? 'Có lỗi xảy ra'}
            </Text>
            <Pressable
              onPress={() => void submitPendingPost(queryClient, post)}
              className="px-2.5 py-1.5 rounded-lg bg-ink"
            >
              <Text className="text-white text-xs font-sans-semibold">Thử lại</Text>
            </Pressable>
            <Pressable onPress={() => removePending(post.localId)} className="px-1.5 py-1.5">
              <Ionicons name="close" size={16} color={colors.muted.DEFAULT} />
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
}
