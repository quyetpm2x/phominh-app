import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchPublicProfile, updateProfile, uploadAvatar } from '../api/endpoints/users';

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
    mutationFn: (realName: string) => updateProfile(realName),
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
