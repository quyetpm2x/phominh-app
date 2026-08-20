import { isProfileComplete } from './profileCompleteness';

const COMPLETE = {
  realName: 'Nguyễn Văn A',
  avatarUrl: 'https://example.com/a.jpg',
  dateOfBirth: '1990-01-01',
  gender: 'male',
};

describe('isProfileComplete', () => {
  it('true khi đủ cả 4 trường', () => {
    expect(isProfileComplete(COMPLETE)).toBe(true);
  });

  it.each(['realName', 'avatarUrl', 'dateOfBirth', 'gender'] as const)(
    'false khi thiếu %s',
    (field) => {
      expect(isProfileComplete({ ...COMPLETE, [field]: null })).toBe(false);
    },
  );

  it('false khi realName chỉ toàn khoảng trắng', () => {
    expect(isProfileComplete({ ...COMPLETE, realName: '   ' })).toBe(false);
  });
});
