import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  acceptTerms,
  fetchAccountStatus,
  fetchDeletionStatus,
  fetchTermsStatus,
  requestAccountDeletion,
} from '../api/endpoints/accountLifecycle';

export function useTermsStatus() {
  return useQuery({ queryKey: ['termsStatus'], queryFn: fetchTermsStatus });
}

export function useAcceptTerms() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptTerms,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['termsStatus'] }),
  });
}

export function useAccountStatus() {
  return useQuery({ queryKey: ['accountStatus'], queryFn: fetchAccountStatus });
}

export function useDeletionStatus() {
  return useQuery({ queryKey: ['deletionStatus'], queryFn: fetchDeletionStatus });
}

export function useRequestAccountDeletion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestAccountDeletion,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['deletionStatus'] }),
  });
}
