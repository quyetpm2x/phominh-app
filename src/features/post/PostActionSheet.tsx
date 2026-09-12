import { Alert, View } from 'react-native';
import { useState } from 'react';
import { PostExtensionSheet } from '../post-extension/PostExtensionSheet';
import { router } from 'expo-router';
import { ActionSheetMenu, type ActionSheetItem } from '../../components/ui/ActionSheetMenu';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { LOCAL_USER_ID } from '../../lib/personalProfile';
import type { FeedPost } from '../home/types';
import { useRemainingPostHours } from '../post-extension/useRemainingPostHours';

interface PostActionSheetProps {
  visible: boolean;
  onClose: () => void;
  post: FeedPost;
  items: ActionSheetItem[];
  currentUserId?: string | null;
}

// Both screens select the owner menu by identity, never by display name.
export function PostActionSheet({
  visible,
  onClose,
  post,
  items,
  currentUserId = LOCAL_USER_ID,
}: PostActionSheetProps) {
  const ownPost = Boolean(currentUserId && post.authorId === currentUserId);
  const remainingHours = useRemainingPostHours(post, visible);
  const [extendingPost, setExtendingPost] = useState<FeedPost | null>(null);
  const stats = `${post.views === undefined ? '' : `${post.views} lượt xem · `}${post.likes} lượt thả tim · ${post.comments} bình luận`;
  const ownerItems: ActionSheetItem[] = [
    {
      label: 'Xem thống kê',
      description: stats,
      icon: (
        <View className="h-9 w-9 items-center justify-center rounded-lg bg-[#00BC7D]/10">
          <CustomIcon name="menuStats" size={18} />
        </View>
      ),
      onPress: () => router.push({ pathname: '/post/statistics/[id]', params: { id: post.id } }),
      deferUntilDismiss: true,
    },
    {
      label: 'Chỉnh sửa nội dung & Ảnh',
      description: 'Cập nhật thông tin bổ sung cho khu phố',
      icon: (
        <View className="h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <CustomIcon name="menuEdit" size={18} />
        </View>
      ),
      onPress: () => router.push({ pathname: '/post/edit/[id]', params: { id: post.id } }),
      deferUntilDismiss: true,
    },
    {
      label: 'Gia hạn thời gian hiển thị',
      description: 'Thêm 24h hoặc 48h trên bảng tin khu vực',
      icon: (
        <View className="h-9 w-9 items-center justify-center rounded-lg bg-[#FE9A00]/10">
          <CustomIcon name="menuExtend" size={18} />
        </View>
      ),
      onPress: () => setExtendingPost(post),
      deferUntilDismiss: true,
    },
    {
      label: 'Gỡ / Xoá bài đăng',
      description: 'Bài viết sẽ ngừng hiển thị ngay lập tức',
      icon: (
        <View className="h-9 w-9 items-center justify-center rounded-lg bg-danger/15">
          <CustomIcon name="menuDelete" size={18} />
        </View>
      ),
      destructive: true,
      onPress: () =>
        Alert.alert('Gỡ / Xoá bài đăng', 'Chức năng xoá bài đăng chưa được kết nối. Bài viết chưa bị xoá.'),
      deferUntilDismiss: true,
    },
  ];
  return (
    <>
      <ActionSheetMenu
        visible={visible}
        onClose={onClose}
        title={ownPost ? 'Quản lý bài của bạn' : 'Tuỳ chọn bài viết'}
        subtitle={
          ownPost
            ? `Đã đăng ${post.time}${remainingHours === undefined ? '' : ` · Còn hiệu lực ${remainingHours}h`}`
            : `Bài đăng của ${post.name}`
        }
        headerIcon={ownPost ? <CustomIcon name="menuOwner" size={18} /> : undefined}
        items={ownPost ? ownerItems : items}
      />
      <PostExtensionSheet
        post={extendingPost}
        onClose={() => setExtendingPost(null)}
        onViewPost={(id) => router.push({ pathname: '/post/[id]', params: { id } })}
      />
    </>
  );
}
