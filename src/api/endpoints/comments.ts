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
