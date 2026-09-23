import { useState } from 'react';
import { router } from 'expo-router';
import type { FeedPost } from '../home/types';
import { POSTS } from '../home/data';
import { usePostInteractions } from '../home/postInteractions';
import { PostActionSheet } from '../post/PostActionSheet';
import { getPostMenuItems } from '../post/postMenu';
import { PostShareSheet } from '../share/PostShareSheet';

export function ResidentPostMenu({ post, onClose }: { post: FeedPost | null; onClose: () => void }) {
  const [sharing, setSharing] = useState<FeedPost | null>(null);
  const saved = usePostInteractions((state) => state.saved);
  const selected = post ?? POSTS[0];
  return (
    <>
      <PostActionSheet
        visible={post !== null}
        onClose={onClose}
        post={selected}
        items={getPostMenuItems({
          saved: Boolean(saved[selected.id]),
          onSave: () =>
            usePostInteractions
              .getState()
              .setSaved((state) => ({ ...state, [selected.id]: !state[selected.id] })),
          onShare: () => setSharing(selected),
          onHide: () =>
            usePostInteractions.getState().setHidden((ids) => [...new Set([...ids, selected.id])]),
          onReport: () => router.push({ pathname: '/report', params: { postId: selected.id } }),
        })}
      />
      <PostShareSheet post={sharing} onClose={() => setSharing(null)} />
    </>
  );
}
