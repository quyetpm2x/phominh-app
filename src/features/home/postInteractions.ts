import type { SetStateAction } from 'react';
import { create } from 'zustand';
import type { ExtensionResult } from '../post-extension/extensionResult';
import { isValidPostEdit, type PostEdit } from '../post-edit/postEdit';
import { findPost } from '../post/findPost';
import { LOCAL_USER_ID } from '../../lib/personalProfile';

type Flags = Record<string, boolean>;
type Comments = Record<string, string[]>;
interface LocalReport {
  postId: string;
  reason: string;
  details: string;
}
interface PostInteractions {
  dismissedHiddenPreviews: string[];
  dismissHiddenPreview: (id: string) => void;
  clearHiddenItems: (previewIds: string[]) => void;
  edits: Record<string, PostEdit>;
  savePostEdit: (postId: string, edit: PostEdit) => boolean;
  extensions: Record<string, ExtensionResult>;
  completeExtension: (result: ExtensionResult) => void;
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
  dismissedHiddenPreviews: [],
  edits: {},
  dismissHiddenPreview: (id) =>
    set((state) => ({ dismissedHiddenPreviews: [...new Set([...state.dismissedHiddenPreviews, id])] })),
  clearHiddenItems: (previewIds) =>
    set({ hidden: [], blockedAuthors: [], reducedTopics: [], dismissedHiddenPreviews: previewIds }),
  savePostEdit: (postId, edit) => {
    if (findPost(postId)?.authorId !== LOCAL_USER_ID || !isValidPostEdit(edit)) return false;
    const clean = {
      text: edit.text.trim(),
      commentsEnabled: edit.commentsEnabled,
      notifyReplies: edit.notifyReplies,
    };
    set((state) => ({ edits: { ...state.edits, [postId]: clean } }));
    return true;
  },
  extensions: {},
  completeExtension: (result) =>
    set((state) => ({ extensions: { ...state.extensions, [result.postId]: result } })),
  reset: () =>
    set({
      dismissedHiddenPreviews: [],
      edits: {},
      extensions: {},
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
