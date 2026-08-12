import { useAuthStore } from '../store/useAuthStore';

// Điểm uy tín tích lũy dần theo vote của hàng xóm — logic tính thật nằm ở backend (mục 1 tài liệu FE).
export function useTrustScore() {
  const user = useAuthStore((s) => s.user);
  return user?.trustScore ?? 0;
}
