import { useEffect, useState } from 'react';
import { usePostInteractions } from '../home/postInteractions';
import type { FeedPost } from '../home/types';

export function useRemainingPostHours(post: FeedPost | null, visible: boolean) {
  const expiry = usePostInteractions((state) => (post ? state.extensions[post.id]?.expiresAt : undefined));
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (!visible) return;
    const refresh = () => setNow(Date.now());
    const initial = setTimeout(refresh, 0);
    const interval = setInterval(refresh, 60_000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [visible, post?.id, expiry]);
  return expiry === undefined ? post?.remainingHours : Math.max(0, Math.ceil((expiry - now) / 3_600_000));
}
