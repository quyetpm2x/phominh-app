import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  fetchMerchantDashboard,
  fetchMerchantStats,
  fetchMyMerchantProfile,
  registerMerchant,
  updatePhoneVisibility,
  type RegisterMerchantInput,
  type UpdatePhoneVisibilityInput,
} from '../api/endpoints/merchants';

export function useMyMerchantProfile() {
  return useQuery({ queryKey: ['merchant', 'me'], queryFn: fetchMyMerchantProfile, retry: false });
}

export function useMerchantDashboard() {
  return useQuery({ queryKey: ['merchant', 'dashboard'], queryFn: fetchMerchantDashboard });
}

export function useMerchantStats() {
  return useQuery({ queryKey: ['merchant', 'stats'], queryFn: fetchMerchantStats });
}

export function useRegisterMerchant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterMerchantInput) => registerMerchant(input),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['merchant'] }),
  });
}

export function useUpdatePhoneVisibility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePhoneVisibilityInput) => updatePhoneVisibility(input),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['merchant'] }),
  });
}
