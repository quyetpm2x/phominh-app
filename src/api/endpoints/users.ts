import { apiClient } from '../client';

interface Envelope<T> {
  data: T;
}

// Hồ sơ công khai người khác (mục 36) — KHÔNG có realName (backend cố tình không trả, xem
// UserPublicProfileDto).
export interface UserPublicProfile {
  id: string;
  alias: string;
  avatarUrl: string | null;
  trustBadgeLabel: string;
  postCount: number;
  createdAt: string;
  // Chỉ có giá trị nếu đây là tài khoản merchant — dùng để gửi report "bán chuyên nghiệp trá hình"
  // (mục 31, targetType='merchant_suspicious' cần targetId là merchantId, không phải userId).
  merchantId: string | null;
}

export async function fetchPublicProfile(userId: string): Promise<UserPublicProfile> {
  const res = await apiClient.get(`api/mobile/users/${userId}`).json<Envelope<UserPublicProfile>>();
  return res.data;
}

export interface UpdateProfileInput {
  realName?: string;
  // ISO YYYY-MM-DD.
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}

export async function updateProfile(input: UpdateProfileInput): Promise<void> {
  await apiClient.patch('api/mobile/users/me', { json: input });
}

// multipart/form-data — cùng cách dựng FormData như uploadPostImage (api/endpoints/posts.ts), React
// Native nhận object { uri, name, type } trực tiếp.
export async function uploadAvatar(uri: string): Promise<string> {
  const formData = new FormData();
  const extensionMatch = /\.(\w+)$/.exec(uri);
  const extension = extensionMatch?.[1] ?? 'jpg';
  formData.append('file', {
    uri,
    name: `avatar.${extension}`,
    type: `image/${extension === 'jpg' ? 'jpeg' : extension}`,
  } as unknown as Blob);

  const res = await apiClient
    .post('api/mobile/users/me/avatar', { body: formData })
    .json<Envelope<{ avatarUrl: string }>>();
  return res.data.avatarUrl;
}

// Lịch sử điểm uy tín đầy đủ (mục 62) — cả tăng E1 (vote) lẫn giảm E2 (vi phạm đã xác nhận).
export interface TrustHistoryItem {
  id: string;
  delta: number;
  sourceType: 'vote' | 'violation_confirmed' | 'appeal_reversal';
  severity: 'light' | 'medium' | 'severe' | null;
  createdAt: string;
  appealStatus: 'pending' | 'approved' | 'rejected' | null;
}

export async function fetchTrustHistory(): Promise<TrustHistoryItem[]> {
  const res = await apiClient
    .get('api/mobile/users/me/trust-history')
    .json<Envelope<TrustHistoryItem[]>>();
  return res.data;
}

// Khiếu nại phạt oan (mục 61) — mỗi lần bị trừ điểm (violation_confirmed) chỉ khiếu nại được 1 lần.
export async function createPenaltyAppeal(
  trustScoreHistoryId: string,
  explanation: string,
): Promise<void> {
  await apiClient.post('api/mobile/penalty-appeals', { json: { trustScoreHistoryId, explanation } });
}
