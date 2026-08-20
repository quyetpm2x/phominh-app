import { useEffect, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';

import { toConnectionStatus, type RealtimeConnectionStatus } from '../lib/realtimeConnectionStatus';
import { supabase } from '../lib/supabase';

// Subscribe khi mở màn hình chi tiết bài, unsubscribe khi rời màn hình (mục 2 tài liệu FE). Trả về
// trạng thái kết nối để UI hiện chỉ báo "đang cập nhật/ngoại tuyến" (mục 25) — Supabase tự động thử
// kết nối lại khi rớt mạng, hook chỉ phản ánh lại trạng thái đó, không tự viết logic retry riêng.
export function useRealtimeComments(
  postId: string,
  onInsert: (comment: unknown) => void,
): RealtimeConnectionStatus {
  const [status, setStatus] = useState<RealtimeConnectionStatus>('connecting');

  useEffect(() => {
    setStatus('connecting');
    let channel: RealtimeChannel | null = null;

    channel = supabase
      .channel(`comments:${postId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` },
        (payload) => onInsert(payload.new),
      )
      .subscribe((channelStatus) => setStatus(toConnectionStatus(channelStatus)));

    return () => {
      if (channel) void supabase.removeChannel(channel);
    };
  }, [postId, onInsert]);

  return status;
}
