import { useQuery } from '@tanstack/react-query';

import { fetchPost } from '../api/endpoints/posts';

export function usePost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
  });
}
