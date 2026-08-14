import { apiClient } from '../client';

interface Envelope<T> {
  data: T;
}

// Điều khoản (mục 67), khoá/hạn chế (mục 74), yêu cầu xoá tài khoản mềm 30 ngày (mục 69, 73).

export async function acceptTerms(): Promise<void> {
  await apiClient.post('api/mobile/users/me/terms-acceptance');
}

export async function fetchTermsStatus(): Promise<{ hasAcceptedLatest: boolean }> {
  const res = await apiClient
    .get('api/mobile/users/me/terms-acceptance')
    .json<Envelope<{ hasAcceptedLatest: boolean }>>();
  return res.data;
}

export interface AccountStatusInfo {
  status: 'active' | 'banned' | 'restricted';
  reason: string | null;
  restrictedUntil: string | null;
}

export async function fetchAccountStatus(): Promise<AccountStatusInfo> {
  const res = await apiClient
    .get('api/mobile/users/me/account-status')
    .json<Envelope<AccountStatusInfo>>();
  return res.data;
}

export async function requestAccountDeletion(): Promise<void> {
  await apiClient.post('api/mobile/users/me/deletion-request');
}

export async function fetchDeletionStatus(): Promise<{ pending: boolean; daysRemaining: number | null }> {
  const res = await apiClient
    .get('api/mobile/users/me/deletion-request')
    .json<Envelope<{ pending: boolean; daysRemaining: number | null }>>();
  return res.data;
}
