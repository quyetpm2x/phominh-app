import { sanitizeSpacing } from './sanitizeSpacing';

describe('sanitizeSpacing', () => {
  it('bỏ dấu cách ở đầu chuỗi', () => {
    expect(sanitizeSpacing('   Nguyễn Văn A')).toBe('Nguyễn Văn A');
  });

  it('gộp nhiều dấu cách liên tiếp ở giữa thành 1', () => {
    expect(sanitizeSpacing('Nguyễn    Văn A')).toBe('Nguyễn Văn A');
  });

  it('giữ nguyên 1 dấu cách cuối chuỗi (đang gõ dở từ tiếp theo)', () => {
    expect(sanitizeSpacing('Nguyễn ')).toBe('Nguyễn ');
  });

  it('không đổi chuỗi đã hợp lệ', () => {
    expect(sanitizeSpacing('Nguyễn Văn A')).toBe('Nguyễn Văn A');
  });

  it('chuỗi toàn dấu cách trở thành rỗng', () => {
    expect(sanitizeSpacing('     ')).toBe('');
  });

  it('chuỗi rỗng giữ nguyên', () => {
    expect(sanitizeSpacing('')).toBe('');
  });
});
