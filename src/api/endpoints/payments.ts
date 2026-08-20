import { apiClient } from '../client';

interface Envelope<T> {
  data: T;
}

// ===== Tài khoản ngân hàng (mục 53/54) =====

export interface BankAccount {
  id: string;
  bankCode: string;
  accountHolderName: string;
  verifiedAt: string | null;
  createdAt: string;
}

export interface LinkBankAccountInput {
  bankCode: string;
  accountNumber: string;
  accountHolderName: string;
}

export async function linkBankAccount(input: LinkBankAccountInput): Promise<BankAccount> {
  const res = await apiClient
    .post('api/mobile/users/me/bank-accounts', { json: input })
    .json<Envelope<BankAccount>>();
  return res.data;
}

export async function fetchMyBankAccounts(): Promise<BankAccount[]> {
  const res = await apiClient
    .get('api/mobile/users/me/bank-accounts')
    .json<Envelope<BankAccount[]>>();
  return res.data;
}

// Gỡ tài khoản (mục 54) — không sửa tại chỗ, xem lý do trong PaymentsService.unlinkBankAccount.
export async function unlinkBankAccount(id: string): Promise<void> {
  await apiClient.delete(`api/mobile/users/me/bank-accounts/${id}`);
}

// ===== Rút thưởng (mục 59/60) =====

export type PayoutStatus = 'pending' | 'processing' | 'success' | 'failed';
export type PayoutSource = 'leaderboard' | 'referral';

export interface PayoutRequest {
  id: string;
  amount: number;
  source: PayoutSource;
  status: PayoutStatus;
  providerTransactionId: string | null;
  createdAt: string;
}

export interface RequestPayoutInput {
  bankAccountId: string;
  amount: number;
  source: PayoutSource;
}

export interface RequestPayoutResult {
  payoutRequest: PayoutRequest;
  taxWithheld: number;
  netAmount: number;
  requiresManualApproval: boolean;
}

export async function requestPayout(input: RequestPayoutInput): Promise<RequestPayoutResult> {
  const res = await apiClient
    .post('api/mobile/payouts', { json: input })
    .json<Envelope<RequestPayoutResult>>();
  return res.data;
}

export async function fetchMyPayoutRequests(): Promise<PayoutRequest[]> {
  const res = await apiClient.get('api/mobile/payouts').json<Envelope<PayoutRequest[]>>();
  return res.data;
}
