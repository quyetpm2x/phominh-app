import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createComment,
  deleteComment,
  fetchComments,
  hideComment,
  setCommentPinned,
  updateComment,
  type CreateCommentInput,
} from '../api/endpoints/comments';

export function useComments(postId: string) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
  });
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCommentInput) => createComment(postId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      void queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}

// 4 hành động còn lại (mục 29, 34) đều chỉ cần invalidate lại danh sách bình luận sau khi xong —
// dùng chung 1 hook nhận mutationFn khác nhau thay vì lặp lại onSuccess 4 lần.
function useCommentAction<TVariables>(postId: string, mutationFn: (vars: TVariables) => Promise<void>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
}

export function useUpdateComment(postId: string) {
  return useCommentAction(postId, ({ commentId, content }: { commentId: string; content: string }) =>
    updateComment(postId, commentId, content),
  );
}

export function useDeleteComment(postId: string) {
  return useCommentAction(postId, (commentId: string) => deleteComment(postId, commentId));
}

export function useSetCommentPinned(postId: string) {
  return useCommentAction(postId, ({ commentId, isPinned }: { commentId: string; isPinned: boolean }) =>
    setCommentPinned(postId, commentId, isPinned),
  );
}

export function useHideComment(postId: string) {
  return useCommentAction(postId, (commentId: string) => hideComment(postId, commentId));
}
