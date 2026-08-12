import { useEffect } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';

import { supabase } from '../lib/supabase';

// Subscribe khi mở màn hình chi tiết bài, unsubscribe khi rời màn hình (mục 2 tài liệu FE).
export function useRealtimeComments(postId: string, onInsert: (comment: unknown) => void) {
  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    channel = supabase
      .channel(`comments:${postId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` },
        (payload) => onInsert(payload.new),
      )
      .subscribe();

    return () => {
      if (channel) void supabase.removeChannel(channel);
    };
  }, [postId, onInsert]);
}
