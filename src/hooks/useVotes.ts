import { useMutation, useQueryClient } from '@tanstack/react-query';

import { castVote } from '../api/endpoints/votes';

// Vote bài (mục 28) — dùng chung cho cả feed (PostCard) và màn chi tiết (PostDetailHeader), nên
// invalidate cả 2 query key thay vì chỉ 1 như useCommentAction (postId cố định).
export function useCastPostVote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => castVote({ targetType: 'post', targetId: postId }),
    onSuccess: (_data, postId) => {
      void queryClient.invalidateQueries({ queryKey: ['posts'] });
      void queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}

export function useCastCommentVote(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => castVote({ targetType: 'comment', targetId: commentId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
}
