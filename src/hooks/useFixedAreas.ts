import { useQuery } from '@tanstack/react-query';

import { getFixedAreas } from '../api/client';

// Đọc 2 khu vực cố định Nhà/Chỗ làm đã lưu — dùng ở hồ sơ (mục 35) để hiện đúng địa chỉ/bán kính
// thật thay vì mock, khớp dữ liệu với màn sửa khu vực (mục 37, useEditAreaLocation.ts).
export function useFixedAreas() {
  return useQuery({ queryKey: ['fixedAreas'], queryFn: getFixedAreas });
}
