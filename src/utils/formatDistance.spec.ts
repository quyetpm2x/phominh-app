import { formatDistance } from './formatDistance';

describe('formatDistance', () => {
  it('dưới 1000m → hiện phút đi bộ (80m/phút, làm tròn, tối thiểu 1 phút)', () => {
    expect(formatDistance(80)).toBe('~1 phút đi bộ');
    expect(formatDistance(400)).toBe('~5 phút đi bộ');
    expect(formatDistance(30)).toBe('~1 phút đi bộ');
  });

  it('từ 1000m trở lên → hiện km với 1 chữ số thập phân', () => {
    expect(formatDistance(1000)).toBe('1.0 km');
    expect(formatDistance(2538)).toBe('2.5 km');
  });
});
