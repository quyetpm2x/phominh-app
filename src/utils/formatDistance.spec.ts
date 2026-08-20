import { formatDistance } from './formatDistance';

describe('formatDistance', () => {
  it('dưới 1000m → hiện phút đi bộ (80m/phút, làm tròn, tối thiểu 1 phút)', () => {
    expect(formatDistance(80)).toBe('~1 phút đi bộ');
    expect(formatDistance(400)).toBe('~5 phút đi bộ');
    expect(formatDistance(30)).toBe('~1 phút đi bộ');
  });

  it('từ 1000m trở lên → hiện phút xe máy (350m/phút, làm tròn), không còn hiện km', () => {
    expect(formatDistance(1000)).toBe('~3 phút xe máy');
    expect(formatDistance(3500)).toBe('~10 phút xe máy');
  });
});
