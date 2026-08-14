import { apiClient } from '../client';

interface Envelope<T> {
  data: T;
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorDisplayName: string;
  content: string;
  visibility: 'public' | 'private';
  isPinned: boolean;
  createdAt: string;
}

// Trước đây thiếu prefix "api/" (gọi nhầm "mobile/posts/...") — mọi route backend đều mount dưới
// /api/mobile, xem posts.ts/client.ts đã dùng đúng prefix này.
export async function fetchComments(postId: string): Promise<PostComment[]> {
  const res = await apiClient
    .get(`api/mobile/posts/${postId}/comments`)
    .json<Envelope<PostComment[]>>();
  return res.data;
}

export interface CreateCommentInput {
  content: string;
  visibility?: 'public' | 'private';
}

export async function createComment(postId: string, input: CreateCommentInput): Promise<void> {
  await apiClient.post(`api/mobile/posts/${postId}/comments`, { json: input });
}

// Sửa bình luận của chính mình (mục 34) — backend chặn nếu không phải tác giả.
export async function updateComment(postId: string, commentId: string, content: string): Promise<void> {
  await apiClient.patch(`api/mobile/posts/${postId}/comments/${commentId}`, { json: { content } });
}

// Xoá bình luận của chính mình (mục 34) — dùng chung field ẩn, hiệu ứng vĩnh viễn với người xem.
export async function deleteComment(postId: string, commentId: string): Promise<void> {
  await apiClient.delete(`api/mobile/posts/${postId}/comments/${commentId}`);
}

// Chủ bài ghim/bỏ ghim bình luận người khác trên bài của mình (mục 29).
export async function setCommentPinned(postId: string, commentId: string, isPinned: boolean): Promise<void> {
  await apiClient.patch(`api/mobile/posts/${postId}/comments/${commentId}/${isPinned ? 'pin' : 'unpin'}`);
}

// Chủ bài ẩn bình luận người khác trên bài của mình (mục 29) — vĩnh viễn, không có màn khôi phục.
export async function hideComment(postId: string, commentId: string): Promise<void> {
  await apiClient.patch(`api/mobile/posts/${postId}/comments/${commentId}/hide`);
}
