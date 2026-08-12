import { getFreshnessLevel, formatFreshness } from './formatFreshness';

describe('getFreshnessLevel', () => {
  const createdAt = '2026-01-01T00:00:00.000Z';
  const expiresAt = '2026-01-03T00:00:00.000Z'; // 48h sau

  it('mới đăng (<30% thời gian đã trôi) → new', () => {
    const now = new Date('2026-01-01T10:00:00.000Z'); // ~20.8%
    jest.useFakeTimers().setSystemTime(now);
    expect(getFreshnessLevel(createdAt, expiresAt)).toBe('new');
    jest.useRealTimers();
  });

  it('giữa chừng (30%-85%) → aging', () => {
    const now = new Date('2026-01-02T00:00:00.000Z'); // 50%
    jest.useFakeTimers().setSystemTime(now);
    expect(getFreshnessLevel(createdAt, expiresAt)).toBe('aging');
    jest.useRealTimers();
  });

  it('sắp hết hạn (>=85%) → expiring', () => {
    const now = new Date('2026-01-02T22:00:00.000Z'); // ~91.7%
    jest.useFakeTimers().setSystemTime(now);
    expect(getFreshnessLevel(createdAt, expiresAt)).toBe('expiring');
    jest.useRealTimers();
  });
});

describe('formatFreshness', () => {
  it('dưới 60 phút → hiện phút', () => {
    const now = new Date('2026-01-01T00:30:00.000Z');
    jest.useFakeTimers().setSystemTime(now);
    expect(formatFreshness('2026-01-01T00:00:00.000Z')).toBe('30 phút trước');
    jest.useRealTimers();
  });

  it('từ 60 phút trở lên → hiện giờ', () => {
    const now = new Date('2026-01-01T05:00:00.000Z');
    jest.useFakeTimers().setSystemTime(now);
    expect(formatFreshness('2026-01-01T00:00:00.000Z')).toBe('5 giờ trước');
    jest.useRealTimers();
  });
});
