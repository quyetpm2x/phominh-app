import { apiClient } from '../client';

interface Envelope<T> {
  data: T;
}

export interface IgnoredUser {
  id: string;
  alias: string;
}

// "Không quan tâm" (mục 32, 38) — ẩn thầm lặng 1 người khỏi feed của chính mình.
export async function fetchIgnoredUsers(): Promise<IgnoredUser[]> {
  const res = await apiClient.get('api/mobile/users/me/ignored-users').json<Envelope<IgnoredUser[]>>();
  return res.data;
}

export async function ignoreUser(userId: string): Promise<void> {
  await apiClient.post(`api/mobile/users/me/ignored-users/${userId}`);
}

export async function unignoreUser(userId: string): Promise<void> {
  await apiClient.delete(`api/mobile/users/me/ignored-users/${userId}`);
}
