import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchIgnoredUsers, ignoreUser, unignoreUser } from '../api/endpoints/ignoredUsers';

export function useIgnoredUsers() {
  return useQuery({ queryKey: ['ignoredUsers'], queryFn: fetchIgnoredUsers });
}

export function useIgnoreUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => ignoreUser(userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ignoredUsers'] });
      void queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUnignoreUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => unignoreUser(userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ignoredUsers'] });
      void queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
