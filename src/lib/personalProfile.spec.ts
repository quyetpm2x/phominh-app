import {
  EMPTY_PROFILE,
  formatBirthDate,
  parseBirthDate,
  restoreProfile,
  validateProfile,
} from './personalProfile';

describe('birth date validation', () => {
  it.each(['31/02/2000', '29/02/2001', '00/01/2000', '01/13/2000', '1/1/2000', '01/01/1899', 'invalid'])(
    'rejects %s',
    (value) => expect(parseBirthDate(value)).toBeNull(),
  );
  it('accepts leap day and preserves local calendar date', () => {
    expect(formatBirthDate(parseBirthDate('29/02/2000')!)).toBe('29/02/2000');
  });
  it('rejects whitespace name and future birth date', () => {
    expect(
      validateProfile({ ...EMPTY_PROFILE, fullName: '   ', birthDate: '07/09/2026' }, new Date(2026, 8, 6)),
    ).toEqual({ fullName: 'Vui lòng nhập họ và tên.', birthDate: 'Vui lòng chọn ngày sinh hợp lệ.' });
  });
  it('accepts valid required fields without optional fields', () => {
    expect(
      validateProfile(
        { ...EMPTY_PROFILE, fullName: 'Nguyễn An', birthDate: '01/01/2000' },
        new Date(2026, 8, 6),
      ),
    ).toEqual({});
  });
});

describe('restoreProfile', () => {
  it.each([null, 'invalid', 'null', '2'])('falls back safely for %s', (raw) =>
    expect(restoreProfile(raw)).toEqual(EMPTY_PROFILE),
  );
  it('sanitizes saved fields and limits the biography', () => {
    const result = restoreProfile(
      JSON.stringify({
        fullName: 12,
        nickname: 'An',
        birthDate: '31/02/2000',
        gender: 'unknown',
        bio: 'a'.repeat(100),
        avatarUri: false,
      }),
    );
    expect(result).toEqual({ ...EMPTY_PROFILE, nickname: 'An', bio: 'a'.repeat(80) });
  });
});
