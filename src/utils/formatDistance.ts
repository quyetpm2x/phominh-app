// Khoảng cách hiện theo kiểu dễ hình dung — "~5 phút đi bộ"/"~8 phút xe máy" thay vì số km khô khan
// (mục 2 tài liệu FE, mục 16 tai-lieu-chuc-nang.md). Dưới 1km đi bộ hợp lý hơn, từ 1km trở lên đổi
// sang mốc thời gian xe máy — tốc độ trung bình trong nội đô đông đúc (~21km/h), không phải tốc độ
// tối đa cho phép.
const WALK_METERS_PER_MINUTE = 80;
const MOTORBIKE_METERS_PER_MINUTE = 350;

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    const minutes = Math.max(1, Math.round(meters / WALK_METERS_PER_MINUTE));
    return `~${minutes} phút đi bộ`;
  }
  const minutes = Math.round(meters / MOTORBIKE_METERS_PER_MINUTE);
  return `~${minutes} phút xe máy`;
}
