import { create } from 'zustand';

import type { PostFontSize } from '../constants/post-style-presets';

// Bài đang đăng (chưa có id thật từ server) — hiện thẻ "Đang đăng…" đầu Dòng tin kiểu Facebook,
// sống độc lập với postDraftStore vì phải tồn tại sau khi draft đã reset() và màn hình đã đổi.
export interface PendingPost {
  localId: string;
  photoUri: string;
  content: string;
  postType: 'life' | 'emergency';
  lat: number;
  lng: number;
  isMockLocation: boolean;
  isLibraryPhoto: boolean;
  displayMode: 'alias' | 'real_name';
  authorDisplayName: string;
  status: 'uploading' | 'error';
  errorMessage?: string;
  textColor: string | null;
  backgroundColor: string | null;
  fontSize: PostFontSize | null;
}

interface PendingPostState {
  pendingPosts: PendingPost[];
  addPending: (post: PendingPost) => void;
  markUploading: (localId: string) => void;
  markError: (localId: string, errorMessage: string) => void;
  removePending: (localId: string) => void;
}

export const usePendingPostStore = create<PendingPostState>((set) => ({
  pendingPosts: [],
  addPending: (post) => set((s) => ({ pendingPosts: [post, ...s.pendingPosts] })),
  markUploading: (localId) =>
    set((s) => ({
      pendingPosts: s.pendingPosts.map((p) =>
        p.localId === localId ? { ...p, status: 'uploading', errorMessage: undefined } : p,
      ),
    })),
  markError: (localId, errorMessage) =>
    set((s) => ({
      pendingPosts: s.pendingPosts.map((p) => (p.localId === localId ? { ...p, status: 'error', errorMessage } : p)),
    })),
  removePending: (localId) => set((s) => ({ pendingPosts: s.pendingPosts.filter((p) => p.localId !== localId) })),
}));
