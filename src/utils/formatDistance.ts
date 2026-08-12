// Khoảng cách hiện theo kiểu dễ hình dung — "~5 phút đi bộ" thay vì số km khô khan (mục 2 tài liệu FE).
const WALK_METERS_PER_MINUTE = 80;

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    const minutes = Math.max(1, Math.round(meters / WALK_METERS_PER_MINUTE));
    return `~${minutes} phút đi bộ`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}
