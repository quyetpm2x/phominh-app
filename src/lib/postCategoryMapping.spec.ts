import { mapCategoryToPostType } from './postCategoryMapping';

describe('mapCategoryToPostType', () => {
  it('map "Cảnh báo an ninh" sang emergency', () => {
    expect(mapCategoryToPostType('Cảnh báo an ninh')).toBe('emergency');
  });

  it('map "Mất điện/nước" sang emergency', () => {
    expect(mapCategoryToPostType('Mất điện/nước')).toBe('emergency');
  });

  it('các chip còn lại map sang life', () => {
    expect(mapCategoryToPostType('Đồ ăn còn hàng')).toBe('life');
    expect(mapCategoryToPostType('Hỏi đáp')).toBe('life');
    expect(mapCategoryToPostType('Rao vặt')).toBe('life');
    expect(mapCategoryToPostType('Khác')).toBe('life');
  });

  it('chưa chọn chip nào (chuỗi rỗng) → life', () => {
    expect(mapCategoryToPostType('')).toBe('life');
  });
});
