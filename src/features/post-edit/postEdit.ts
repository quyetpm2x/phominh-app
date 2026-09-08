import type { FeedPost } from '../home/types';
export const MAX_POST_LENGTH = 500;
export interface PostEdit {
  text: string;
  commentsEnabled: boolean;
  notifyReplies: boolean;
}
export function applyPostEdit(post: FeedPost, edit?: PostEdit): FeedPost {
  return edit ? { ...post, ...edit } : post;
}
export function isValidPostEdit(edit: PostEdit) {
  return edit.text.trim().length > 0 && edit.text.length <= MAX_POST_LENGTH;
}
