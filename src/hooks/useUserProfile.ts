import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createPenaltyAppeal,
  fetchPublicProfile,
  fetchTrustHistory,
  updateProfile,
  uploadAvatar,
  type UpdateProfileInput,
} from '../api/endpoints/users';

export function usePublicProfile(userId: string) {
  return useQuery({
    queryKey: ['publicProfile', userId],
    queryFn: () => fetchPublicProfile(userId),
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfile(input),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['me'] }),
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uri: string) => uploadAvatar(uri),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['me'] }),
  });
}

export function useTrustHistory() {
  return useQuery({ queryKey: ['trustHistory'], queryFn: fetchTrustHistory });
}

export function useCreatePenaltyAppeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ historyId, explanation }: { historyId: string; explanation: string }) =>
      createPenaltyAppeal(historyId, explanation),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['trustHistory'] }),
  });
}
