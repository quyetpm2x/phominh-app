import { apiClient } from '../client';

interface Envelope<T> {
  data: T;
}

// Ghi nhận phiên mở/đóng app THẬT (bổ sung ngoài 117 mục gốc, thảo luận 2026-08-17) — trước đây
// KHÔNG route nào gọi tới, khiến hệ số hoạt động vote/Bắc Đẩu/điều kiện thưởng giới thiệu luôn nhận
// dữ liệu rỗng dù đọc từ bảng app_sessions. Xem src/hooks/useAppSessionTracking.ts.
export async function startAppSession(): Promise<string> {
  const res = await apiClient.post('api/mobile/app-sessions').json<Envelope<{ id: string }>>();
  return res.data.id;
}

export async function closeAppSession(id: string): Promise<void> {
  await apiClient.patch(`api/mobile/app-sessions/${id}/close`);
}
