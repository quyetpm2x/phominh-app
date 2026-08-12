import { useQuery } from '@tanstack/react-query';

import { fetchNearbyPosts } from '../api/endpoints/posts';

// TanStack Query bọc quanh src/api — cache, tự refetch, "stale-while-revalidate" cho mạng yếu (mục 2).
export function usePosts(params: { lat: number; lng: number; radiusKm: number }) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => fetchNearbyPosts(params),
    enabled: Number.isFinite(params.lat) && Number.isFinite(params.lng),
  });
}
