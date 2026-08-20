export type RealtimeConnectionStatus = 'connecting' | 'live' | 'offline';

// Map trạng thái channel Supabase Realtime (REALTIME_SUBSCRIBE_STATES: SUBSCRIBED/TIMED_OUT/CLOSED/
// CHANNEL_ERROR) sang nhãn UI đơn giản (mục 25). Tách khỏi useRealtimeComments.ts (không import
// '../lib/supabase') để test được bằng Jest thường — file đó tạo Supabase client ngay lúc import
// module, cần biến môi trường thật nên không load được trong môi trường test.
export function toConnectionStatus(channelStatus: string): RealtimeConnectionStatus {
  return channelStatus === 'SUBSCRIBED' ? 'live' : 'offline';
}
