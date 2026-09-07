import type { SetStateAction } from 'react';
import { create } from 'zustand';

type Flags = Record<string, boolean>;
type Comments = Record<string, string[]>;
interface LocalReport {
  postId: string;
  reason: string;
  details: string;
}
interface PostInteractions {
  reports: Record<string, LocalReport>;
  reducedTopics: ('shops' | 'neighbors')[];
  reduceTopic: (topic: 'shops' | 'neighbors') => void;
  lastReport: LocalReport | null;
  blockedAuthors: string[];
  completeLocalReport: (report: LocalReport) => void;
  blockAuthor: (authorId: string) => void;
  unblockAuthor: (authorId: string) => void;
  restoreTopic: (topic: 'shops' | 'neighbors') => void;
  liked: Flags;
  saved: Flags;
  useful: Flags;
  comments: Comments;
  hidden: string[];
  setHidden: (update: SetStateAction<string[]>) => void;
  setLiked: (update: SetStateAction<Flags>) => void;
  setSaved: (update: SetStateAction<Flags>) => void;
  setComments: (update: SetStateAction<Comments>) => void;
  toggleUseful: (id: string) => void;
  reset: () => void;
}
// Shared local demo interactions so navigating back to the feed retains changes.
export const usePostInteractions = create<PostInteractions>((set) => ({
  reset: () =>
    set({
      liked: {},
      saved: {},
      useful: {},
      comments: {},
      hidden: [],
      lastReport: null,
      blockedAuthors: [],
      reports: {},
      reducedTopics: [],
    }),
  reports: {},
  reducedTopics: [],
  reduceTopic: (topic) =>
    set((state) => ({
      reducedTopics: state.reducedTopics.includes(topic)
        ? state.reducedTopics
        : [...state.reducedTopics, topic],
    })),
  lastReport: null,
  blockedAuthors: [],
  completeLocalReport: (report) =>
    set((state) => ({
      lastReport: report,
      reports: { ...state.reports, [report.postId]: report },
      hidden: state.hidden.includes(report.postId) ? state.hidden : [...state.hidden, report.postId],
    })),
  unblockAuthor: (authorId) =>
    set((state) => ({ blockedAuthors: state.blockedAuthors.filter((id) => id !== authorId) })),
  restoreTopic: (topic) =>
    set((state) => ({ reducedTopics: state.reducedTopics.filter((item) => item !== topic) })),
  blockAuthor: (authorId) =>
    set((state) => ({
      blockedAuthors: state.blockedAuthors.includes(authorId)
        ? state.blockedAuthors
        : [...state.blockedAuthors, authorId],
    })),
  hidden: [],
  setHidden: (update) =>
    set((state) => ({ hidden: typeof update === 'function' ? update(state.hidden) : update })),
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
