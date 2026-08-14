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
}

export async function fetchPublicProfile(userId: string): Promise<UserPublicProfile> {
  const res = await apiClient.get(`api/mobile/users/${userId}`).json<Envelope<UserPublicProfile>>();
  return res.data;
}

export async function updateProfile(realName: string): Promise<void> {
  await apiClient.patch('api/mobile/users/me', { json: { realName } });
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
