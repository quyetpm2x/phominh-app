import { useQuery } from '@tanstack/react-query';

import { fetchMyPosts, fetchPostsByAuthor } from '../api/endpoints/posts';

export function useMyPosts() {
  return useQuery({ queryKey: ['posts', 'mine'], queryFn: fetchMyPosts });
}

export function usePostsByAuthor(userId: string) {
  return useQuery({
    queryKey: ['posts', 'byUser', userId],
    queryFn: () => fetchPostsByAuthor(userId),
    enabled: !!userId,
  });
}
