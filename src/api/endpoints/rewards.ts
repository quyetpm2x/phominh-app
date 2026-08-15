import { apiClient } from '../client';

interface Envelope<T> {
  data: T;
}

// ===== Công tắc kiếm tiền (bussiness §5.1a, mục 51/52/63) =====

export interface EarnSettings {
  earnViaPostsEnabled: boolean;
  affiliateEnabled: boolean;
  earnEnabledAt: string | null;
}

export async function fetchEarnSettings(): Promise<EarnSettings> {
  const res = await apiClient
    .get('api/mobile/rewards/earn-settings')
    .json<Envelope<EarnSettings>>();
  return res.data;
}

export async function updateEarnSettings(
  input: Partial<Pick<EarnSettings, 'earnViaPostsEnabled' | 'affiliateEnabled'>>,
): Promise<EarnSettings> {
  const res = await apiClient
    .patch('api/mobile/rewards/earn-settings', { json: input })
    .json<Envelope<EarnSettings>>();
  return res.data;
}

// ===== Ví thưởng (mục 58) =====

export interface RewardLedgerEntry {
  id: string;
  amount: number;
  type: 'leaderboard' | 'referral' | 'redeemed_voucher' | 'payout';
  referenceId: string | null;
  createdAt: string;
}

export interface Wallet {
  balance: number;
  recentLedger: RewardLedgerEntry[];
}

export async function fetchWallet(): Promise<Wallet> {
  const res = await apiClient.get('api/mobile/rewards/wallet').json<Envelope<Wallet>>();
  return res.data;
}

// ===== Mã giới thiệu (mục 55) =====

export async function fetchReferralCode(): Promise<{ code: string }> {
  const res = await apiClient
    .get('api/mobile/rewards/referral-code')
    .json<Envelope<{ code: string }>>();
  return res.data;
}

// ===== Bảng xếp hạng (mục 57) =====

export interface LeaderboardEntry {
  userId: string;
  alias: string;
  avatarUrl: string | null;
  rank: number;
  score: number;
}

export interface LeaderboardHistoryEntry extends LeaderboardEntry {
  rewardAmount: number | null;
}

// Bảng SỐNG trong tháng — chỉ tham khảo, chưa phải kết quả cuối cùng (xem fetchLeaderboardHistory).
export async function fetchLiveLeaderboard(tier: number): Promise<LeaderboardEntry[]> {
  const res = await apiClient
    .get('api/mobile/rewards/leaderboard', { searchParams: { tier } })
    .json<Envelope<LeaderboardEntry[]>>();
  return res.data;
}

// Kết quả CHÍNH THỨC đã chốt (kèm rewardAmount) — mặc định kỳ vừa kết thúc nếu không truyền period.
export async function fetchLeaderboardHistory(
  tier: number,
  period?: string,
): Promise<LeaderboardHistoryEntry[]> {
  const searchParams = period ? { tier, period } : { tier };
  const res = await apiClient
    .get('api/mobile/rewards/leaderboard/history', { searchParams })
    .json<Envelope<LeaderboardHistoryEntry[]>>();
  return res.data;
}
