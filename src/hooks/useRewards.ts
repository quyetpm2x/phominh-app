import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  fetchEarnSettings,
  fetchLeaderboardHistory,
  fetchLiveLeaderboard,
  fetchMyReferrals,
  fetchReferralCode,
  fetchWallet,
  redeemReferralCode,
  updateEarnSettings,
  type EarnSettings,
} from '../api/endpoints/rewards';

export function useEarnSettings() {
  return useQuery({ queryKey: ['rewards', 'earnSettings'], queryFn: fetchEarnSettings });
}

export function useUpdateEarnSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<Pick<EarnSettings, 'earnViaPostsEnabled' | 'affiliateEnabled'>>) =>
      updateEarnSettings(input),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['rewards', 'earnSettings'] }),
  });
}

export function useWallet() {
  return useQuery({ queryKey: ['rewards', 'wallet'], queryFn: fetchWallet });
}

export function useReferralCode() {
  return useQuery({ queryKey: ['rewards', 'referralCode'], queryFn: fetchReferralCode });
}

export function useRedeemReferralCode() {
  return useMutation({ mutationFn: (code: string) => redeemReferralCode(code) });
}

export function useMyReferrals() {
  return useQuery({ queryKey: ['rewards', 'myReferrals'], queryFn: fetchMyReferrals });
}

// enabled: false khi chưa biết tier (VD đang chờ useMe load) — tránh gọi API với tier=NaN.
export function useLiveLeaderboard(tier: number | undefined) {
  return useQuery({
    queryKey: ['rewards', 'leaderboard', 'live', tier],
    queryFn: () => fetchLiveLeaderboard(tier as number),
    enabled: tier !== undefined,
  });
}

export function useLeaderboardHistory(tier: number | undefined, period?: string) {
  return useQuery({
    queryKey: ['rewards', 'leaderboard', 'history', tier, period ?? 'latest'],
    queryFn: () => fetchLeaderboardHistory(tier as number, period),
    enabled: tier !== undefined,
  });
}
