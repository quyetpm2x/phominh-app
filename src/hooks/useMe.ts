import { useQuery } from '@tanstack/react-query';

import { getMe } from '../api/client';

// Hồ sơ người đang đăng nhập — dùng để so sánh quyền sở hữu (bài/bình luận của chính mình) ở nhiều
// màn khác nhau, cache qua react-query thay vì mỗi màn tự gọi getMe() + useState riêng.
export function useMe() {
  return useQuery({ queryKey: ['me'], queryFn: getMe, staleTime: 5 * 60 * 1000 });
}
