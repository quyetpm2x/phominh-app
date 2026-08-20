import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { extractErrorMessage } from '../../src/api/client';
import type { PostComment } from '../../src/api/endpoints/comments';
import { CommentComposer } from '../../src/components/CommentComposer';
import { CommentList, type Comment } from '../../src/components/CommentList';
import { PostDetailHeader } from '../../src/components/PostDetailHeader';
import { ActionSheetMenu, type ActionSheetItem } from '../../src/components/ui/ActionSheetMenu';
import {
  useComments,
  useDeleteComment,
  useSetCommentPinned,
  useUpdateComment,
} from '../../src/hooks/useComments';
import { useIgnoreUser } from '../../src/hooks/useIgnoredUsers';
import { useMe } from '../../src/hooks/useMe';
import { useDeletePost, usePost } from '../../src/hooks/usePost';
import { useRealtimeComments } from '../../src/hooks/useRealtimeComments';
import { type RealtimeConnectionStatus } from '../../src/lib/realtimeConnectionStatus';
import { useCastCommentVote, useCastPostVote } from '../../src/hooks/useVotes';
import { formatFreshness } from '../../src/utils/formatFreshness';

function toDisplayComment(c: PostComment): Comment {
  return {
    id: c.id,
    authorId: c.authorId,
    authorName: c.authorDisplayName,
    initial: c.authorDisplayName.charAt(0).toUpperCase(),
    color: '#1f6f52',
    content: c.content,
    timeAgo: formatFreshness(c.createdAt),
    isPinned: c.isPinned,
    voteCount: c.voteCount,
    hasVoted: c.hasVoted,
    replies: c.replies.map(toDisplayComment),
  };
}

// isDetail — chi tiết một bài đăng: nội dung, vị trí GPS, vote, bình luận thật (Tầng 2 task 11).
export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: post,
    isLoading: postLoading,
    isRefetching: postRefetching,
    refetch: refetchPost,
  } = usePost(id);
  const {
    data: comments,
    isLoading: commentsLoading,
    isRefetching: commentsRefetching,
    refetch: refetchComments,
  } = useComments(id);
  const refreshing = postRefetching || commentsRefetching;
  const onRefresh = () => {
    void refetchPost();
    void refetchComments();
  };
  const { data: me } = useMe();
  const [menuOpen, setMenuOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; authorName: string } | null>(
    null,
  );
  const queryClient = useQueryClient();

  const deletePost = useDeletePost(id);
  const ignoreUser = useIgnoreUser();
  const updateComment = useUpdateComment(id);
  const deleteComment = useDeleteComment(id);
  const setCommentPinned = useSetCommentPinned(id);
  const castPostVote = useCastPostVote();
  const castCommentVote = useCastCommentVote(id);

  const onNewComment = useCallback(() => {
    // Không tự chèn payload thô (thiếu authorDisplayName, không qua kiểm tra visibility/quyền) —
    // refetch lại đúng bằng GET đã có sẵn logic public/private, đơn giản và luôn đúng. Invalidate
    // cả ['post', id] vì post.commentCount hiện ở header, không tự cập nhật nếu chỉ refetch comments.
    void queryClient.invalidateQueries({ queryKey: ['comments', id] });
    void queryClient.invalidateQueries({ queryKey: ['post', id] });
  }, [queryClient, id]);
  const realtimeStatus = useRealtimeComments(id, onNewComment);

  if (postLoading || !post) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  const visibleComments = (comments ?? []).map(toDisplayComment);
  const isOwnPost = post.authorId === me?.id;

  const onVotePost = () => {
    void castPostVote.mutateAsync(post.id).catch(async (err) => {
      Alert.alert('Không vote được', await extractErrorMessage(err));
    });
  };

  const onVoteComment = (commentId: string) => {
    void castCommentVote.mutateAsync(commentId).catch(async (err) => {
      Alert.alert('Không vote được', await extractErrorMessage(err));
    });
  };

  const onConfirmDeletePost = () => {
    Alert.alert('Xoá bài đăng?', 'Bài đăng sẽ không còn hiện với ai nữa. Không thể hoàn tác.', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: () =>
          void deletePost.mutateAsync().then(
            () => router.replace('/(main)/feed'),
            async (err) => Alert.alert('Không xoá được', await extractErrorMessage(err)),
          ),
      },
    ]);
  };

  const onIgnoreAuthor = () => {
    Alert.alert('Không quan tâm người này?', 'Bài của họ sẽ không hiện ở Dòng tin của bạn nữa.', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xác nhận',
        onPress: () =>
          void ignoreUser.mutateAsync(post.authorId).then(() => router.replace('/(main)/feed')),
      },
    ]);
  };

  const headerMenuItems: ActionSheetItem[] = isOwnPost
    ? [
        { label: 'Sửa bài đăng', onPress: () => router.push(`/post/edit/${id}`) },
        { label: 'Xoá bài đăng', destructive: true, onPress: onConfirmDeletePost },
      ]
    : [
        { label: 'Báo cáo bài đăng', onPress: () => router.push({ pathname: '/report/post', params: { postId: id } }) },
        ...(post.postType === 'merchant'
          ? [
              {
                label: 'Báo cáo nghi ngờ bán chuyên nghiệp trá hình',
                onPress: () =>
                  router.push({
                    pathname: '/report/post',
                    params: { postId: id, suspiciousMerchantAuthorId: post.authorId },
                  }),
              },
            ]
          : []),
        { label: 'Không quan tâm người này', destructive: true, onPress: onIgnoreAuthor },
      ];

  const onDeleteComment = (commentId: string) => {
    Alert.alert('Xoá bình luận?', 'Không thể hoàn tác.', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: () => void deleteComment.mutateAsync(commentId) },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-sm text-ink">Bài đăng</Text>
        <View className="flex-1" />
        <Pressable
          onPress={() => setMenuOpen(true)}
          className="h-[30px] w-[30px] items-center justify-center"
        >
          <Text className="text-base text-muted">•••</Text>
        </Pressable>
      </View>

      {/* Không có KeyboardAvoidingView, bàn phím sẽ đè thẳng lên CommentComposer ở dưới (che mất
          input đang gõ) — 'padding' trên iOS, 'height' trên Android là cặp behavior chuẩn cho
          layout "ScrollView + composer cố định đáy" này. */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={46} // = chiều cao header cố định phía trên (mục đo bằng h-[46px])
      >
        <ScrollView
          contentContainerClassName="pb-6"
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <PostDetailHeader post={post} canVote={!isOwnPost} onVote={onVotePost} />

          <View className="h-px bg-border-soft mx-4 my-3" />

          <View className="px-4 pb-1.5 flex-row items-center justify-between">
            <Text className="font-sans-semibold text-[13.5px] text-ink">Bình luận · {post.commentCount}</Text>
            <View className="flex-row items-center gap-2.5">
              <RealtimeIndicator status={realtimeStatus} />
              <Text className="font-mono-medium text-[10.5px] text-muted-light">chủ bài kiểm duyệt</Text>
            </View>
          </View>

          <View className="px-4 pt-2.5">
            {commentsLoading ? (
              <ActivityIndicator />
            ) : (
              <CommentList
                comments={visibleComments}
                currentUserId={me?.id}
                postAuthorId={post.authorId}
                onEdit={(commentId, content) => void updateComment.mutateAsync({ commentId, content })}
                onDelete={onDeleteComment}
                onTogglePin={(commentId, isPinned) => void setCommentPinned.mutateAsync({ commentId, isPinned })}
                onReport={(commentId, content) =>
                  router.push({
                    pathname: '/report/comment',
                    params: { postId: id, commentId, content, postAuthorId: post.authorId },
                  })
                }
                onVote={onVoteComment}
                onReply={(commentId, authorName) => setReplyingTo({ commentId, authorName })}
              />
            )}
          </View>
        </ScrollView>

        <CommentComposer
          postId={id}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
        />
      </KeyboardAvoidingView>

      <ActionSheetMenu visible={menuOpen} onClose={() => setMenuOpen(false)} items={headerMenuItems} />
    </SafeAreaView>
  );
}

const REALTIME_INDICATOR: Record<RealtimeConnectionStatus, { dotColor: string; label: string }> = {
  live: { dotColor: 'bg-primary', label: 'Đang cập nhật' },
  connecting: { dotColor: 'bg-accent', label: 'Đang kết nối…' },
  offline: { dotColor: 'bg-muted-light', label: 'Ngoại tuyến' },
};

// Chỉ báo trạng thái kênh bình luận real-time (mục 25) — Supabase tự thử kết nối lại khi rớt mạng,
// đây chỉ phản ánh lại trạng thái hiện tại, không tự viết logic retry riêng.
function RealtimeIndicator({ status }: { status: RealtimeConnectionStatus }) {
  const { dotColor, label } = REALTIME_INDICATOR[status];
  return (
    <View className="flex-row items-center gap-1">
      <View className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <Text className="font-mono-medium text-[10px] text-muted-light">{label}</Text>
    </View>
  );
}
