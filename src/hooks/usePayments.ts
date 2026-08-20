import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  fetchMyBankAccounts,
  fetchMyPayoutRequests,
  linkBankAccount,
  requestPayout,
  unlinkBankAccount,
  type LinkBankAccountInput,
  type RequestPayoutInput,
} from '../api/endpoints/payments';

export function useMyBankAccounts() {
  return useQuery({ queryKey: ['payments', 'bankAccounts'], queryFn: fetchMyBankAccounts });
}

export function useLinkBankAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LinkBankAccountInput) => linkBankAccount(input),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['payments', 'bankAccounts'] }),
  });
}

export function useUnlinkBankAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unlinkBankAccount(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['payments', 'bankAccounts'] }),
  });
}

export function useMyPayoutRequests() {
  return useQuery({ queryKey: ['payments', 'payoutRequests'], queryFn: fetchMyPayoutRequests });
}

export function useRequestPayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RequestPayoutInput) => requestPayout(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['payments', 'payoutRequests'] });
      void queryClient.invalidateQueries({ queryKey: ['rewards', 'wallet'] });
    },
  });
}
