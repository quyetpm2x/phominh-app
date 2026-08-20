import { toIsoDate } from './dateOfBirth';

describe('toIsoDate', () => {
  it('ghép đúng ngày hợp lệ', () => {
    expect(toIsoDate({ day: '5', month: '3', year: '1995' })).toBe('1995-03-05');
  });

  it('null nếu ngày không tồn tại (31/02)', () => {
    expect(toIsoDate({ day: '31', month: '2', year: '2000' })).toBeNull();
  });

  it('null nếu thiếu trường hoặc không phải số', () => {
    expect(toIsoDate({ day: '', month: '3', year: '1995' })).toBeNull();
    expect(toIsoDate({ day: 'ab', month: '3', year: '1995' })).toBeNull();
  });

  it('null nếu năm ngoài khoảng hợp lý', () => {
    expect(toIsoDate({ day: '1', month: '1', year: '1800' })).toBeNull();
    expect(toIsoDate({ day: '1', month: '1', year: String(new Date().getFullYear() + 1) })).toBeNull();
  });

  it('null nếu tháng/ngày ngoài khoảng 1-12/1-31', () => {
    expect(toIsoDate({ day: '15', month: '13', year: '2000' })).toBeNull();
    expect(toIsoDate({ day: '32', month: '1', year: '2000' })).toBeNull();
  });
});
