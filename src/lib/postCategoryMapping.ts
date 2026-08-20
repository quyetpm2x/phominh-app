import type { PostTypeFilter } from './postListFilters';

// Map nhãn chip UI (composeTypeChips, caption.tsx) → postType thật của backend (mục 19 phát hiện:
// trước đây submitPendingPost.ts luôn gửi cứng 'life' bất kể chip đã chọn, nên KHÔNG có cách nào
// tạo bài 'emergency' qua luồng đăng bài chính). Chỉ 2 chip mang tính an toàn khẩn cấp mới map sang
// 'emergency' — 'merchant' cố tình không xuất hiện ở đây, vì bài merchant luôn đi qua luồng riêng
// (merchant/quick-update.tsx tự set postType='merchant', có TTL 24h khác hẳn).
const EMERGENCY_CATEGORIES = new Set(['Cảnh báo an ninh', 'Mất điện/nước']);

export function mapCategoryToPostType(category: string): Exclude<PostTypeFilter, 'merchant'> {
  return EMERGENCY_CATEGORIES.has(category) ? 'emergency' : 'life';
}
