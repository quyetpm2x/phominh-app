import type { SetStateAction } from 'react';
import { create } from 'zustand';

type Flags = Record<string, boolean>;
type Comments = Record<string, string[]>;
interface PostInteractions {
  liked: Flags;
  saved: Flags;
  useful: Flags;
  comments: Comments;
  setLiked: (update: SetStateAction<Flags>) => void;
  setSaved: (update: SetStateAction<Flags>) => void;
  setComments: (update: SetStateAction<Comments>) => void;
  toggleUseful: (id: string) => void;
  reset: () => void;
}
// Shared local demo interactions so navigating back to the feed retains changes.
export const usePostInteractions = create<PostInteractions>((set) => ({
  reset: () => set({ liked: {}, saved: {}, useful: {}, comments: {} }),
  liked: {},
  saved: {},
  useful: {},
  comments: {},
  setLiked: (update) =>
    set((state) => ({ liked: typeof update === 'function' ? update(state.liked) : update })),
  setSaved: (update) =>
    set((state) => ({ saved: typeof update === 'function' ? update(state.saved) : update })),
  setComments: (update) =>
    set((state) => ({ comments: typeof update === 'function' ? update(state.comments) : update })),
  toggleUseful: (id) => set((state) => ({ useful: { ...state.useful, [id]: !state.useful[id] } })),
}));
