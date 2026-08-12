import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CommentComposer } from '../../src/components/CommentComposer';
import { CommentList, type Comment } from '../../src/components/CommentList';
import { PostDetailHeader } from '../../src/components/PostDetailHeader';
import { useComments } from '../../src/hooks/useComments';
import { usePost } from '../../src/hooks/usePost';
import { useRealtimeComments } from '../../src/hooks/useRealtimeComments';
import { formatFreshness } from '../../src/utils/formatFreshness';

function toDisplayComment(c: { id: string; authorDisplayName: string; content: string; createdAt: string }): Comment {
  return {
    id: c.id,
    authorName: c.authorDisplayName,
    initial: c.authorDisplayName.charAt(0).toUpperCase(),
    color: '#1f6f52',
    content: c.content,
    timeAgo: formatFreshness(c.createdAt),
  };
}

// isDetail — chi tiết một bài đăng: nội dung, vị trí GPS, vote, bình luận thật (Tầng 2 task 11).
export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: post, isLoading: postLoading } = usePost(id);
  const { data: comments, isLoading: commentsLoading } = useComments(id);
  const [voted, setVoted] = useState(false);
  const queryClient = useQueryClient();
  const onNewComment = useCallback(() => {
    // Không tự chèn payload thô (thiếu authorDisplayName, không qua kiểm tra visibility/quyền) —
    // refetch lại đúng bằng GET đã có sẵn logic public/private, đơn giản và luôn đúng. Invalidate
    // cả ['post', id] vì post.commentCount hiện ở header, không tự cập nhật nếu chỉ refetch comments.
    void queryClient.invalidateQueries({ queryKey: ['comments', id] });
    void queryClient.invalidateQueries({ queryKey: ['post', id] });
  }, [queryClient, id]);
  useRealtimeComments(id, onNewComment);

  if (postLoading || !post) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  const votes = post.voteCount + (voted ? 1 : 0);
  const visibleComments = (comments ?? []).map(toDisplayComment);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-sm text-ink">Bài đăng</Text>
        <View className="flex-1" />
        <Pressable
          onPress={() => router.push('/report/post')}
          className="h-[30px] rounded-lg border border-border bg-white px-2.5 items-center justify-center"
        >
          <Text className="text-xs text-muted">Báo cáo</Text>
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
        <ScrollView contentContainerClassName="pb-6" keyboardShouldPersistTaps="handled">
          <PostDetailHeader post={post} voted={voted} votes={votes} onToggleVote={() => setVoted((v) => !v)} />

          <View className="h-px bg-border-soft mx-4 my-3" />

          <View className="px-4 pb-1.5 flex-row items-center justify-between">
            <Text className="font-sans-semibold text-[13.5px] text-ink">Bình luận · {post.commentCount}</Text>
            <Text className="font-mono-medium text-[10.5px] text-muted-light">chủ bài kiểm duyệt</Text>
          </View>

          <View className="px-4 pt-2.5">
            {commentsLoading ? <ActivityIndicator /> : <CommentList comments={visibleComments} />}
          </View>
        </ScrollView>

        <CommentComposer postId={id} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
