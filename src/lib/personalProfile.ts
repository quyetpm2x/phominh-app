export const PROFILE_STORAGE_KEY = 'pho_minh_personal_profile';
// Local onboarding session for the agreed OTP demo. This is not an API access token.
export const LOCAL_SIGN_IN_KEY = 'pho_minh_local_signed_in';
export type Gender = 'male' | 'female' | 'other';
export interface PersonalProfile {
  fullName: string;
  nickname: string;
  birthDate: string;
  gender: Gender;
  bio: string;
  avatarUri: string | null;
}
export const EMPTY_PROFILE: PersonalProfile = {
  fullName: '',
  nickname: '',
  birthDate: '',
  gender: 'male',
  bio: '',
  avatarUri: null,
};

export function parseBirthDate(value: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return null;
  const [, day, month, year] = match.map(Number);
  if (year < 1900) return null;
  const result = new Date(year, month - 1, day);
  return result.getFullYear() === year && result.getMonth() === month - 1 && result.getDate() === day
    ? result
    : null;
}
export function formatBirthDate(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}
export function validateProfile(profile: PersonalProfile, today = new Date()) {
  const errors: { fullName?: string; birthDate?: string } = {};
  if (!profile.fullName.trim()) errors.fullName = 'Vui lòng nhập họ và tên.';
  const birthday = parseBirthDate(profile.birthDate);
  if (!birthday || birthday > today) errors.birthDate = 'Vui lòng chọn ngày sinh hợp lệ.';
  return errors;
}
export function restoreProfile(raw: string | null): PersonalProfile {
  try {
    const p = JSON.parse(raw ?? 'null');
    if (!p || typeof p !== 'object') return { ...EMPTY_PROFILE };
    return {
      fullName: typeof p.fullName === 'string' ? p.fullName.slice(0, 100) : '',
      nickname: typeof p.nickname === 'string' ? p.nickname.slice(0, 50) : '',
      birthDate: typeof p.birthDate === 'string' && parseBirthDate(p.birthDate) ? p.birthDate : '',
      gender: ['male', 'female', 'other'].includes(p.gender) ? p.gender : 'male',
      bio: typeof p.bio === 'string' ? p.bio.slice(0, 80) : '',
      avatarUri: typeof p.avatarUri === 'string' ? p.avatarUri : null,
    };
  } catch {
    return { ...EMPTY_PROFILE };
  }
}
