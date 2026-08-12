// Viền màu theo độ mới — bài tự ẩn sau 24 giờ (mục 2, FreshnessBorder tài liệu FE).
export type FreshnessLevel = 'new' | 'aging' | 'expiring';

export function getFreshnessLevel(createdAt: string, expiresAt: string): FreshnessLevel {
  const now = Date.now();
  const created = new Date(createdAt).getTime();
  const expires = new Date(expiresAt).getTime();
  const elapsedRatio = (now - created) / (expires - created);

  if (elapsedRatio < 0.3) return 'new';
  if (elapsedRatio < 0.85) return 'aging';
  return 'expiring';
}

export function formatFreshness(createdAt: string): string {
  const minutes = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  return `${hours} giờ trước`;
}
