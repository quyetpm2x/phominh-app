import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createPost, fetchNearbyPosts, type CreatePostInput } from '../api/endpoints/posts';

// TanStack Query bọc quanh src/api — cache, tự refetch, "stale-while-revalidate" cho mạng yếu (mục 2).
export function usePosts(params: { lat: number; lng: number; radiusKm: number }) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => fetchNearbyPosts(params),
    enabled: Number.isFinite(params.lat) && Number.isFinite(params.lng),
  });
}

// Tạo bài KHÔNG qua flow ảnh nền (khác submitPendingPost — dùng cho nơi cần await kết quả ngay,
// vd cập nhật nhanh merchant mục 41, không có ảnh đính kèm bắt buộc).
export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePostInput) => createPost(input),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
}
