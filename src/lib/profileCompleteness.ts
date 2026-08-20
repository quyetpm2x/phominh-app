interface ProfileFields {
  realName: string | null;
  avatarUrl: string | null;
  dateOfBirth: string | null;
  gender: string | null;
}

// Bắt buộc đủ 4 trường lúc onboarding (bổ sung ngoài 117 mục gốc, quyết định 2026-08-20) — không
// có cờ onboardingCompleted riêng ở backend, tính runtime từ chính dữ liệu hồ sơ (user CŨ tạo
// trước khi có yêu cầu này sẽ thiếu ít nhất 1 trường, cũng bị chặn cho tới khi bổ sung).
export function isProfileComplete(profile: ProfileFields): boolean {
  return (
    profile.realName !== null &&
    profile.realName.trim().length > 0 &&
    profile.avatarUrl !== null &&
    profile.dateOfBirth !== null &&
    profile.gender !== null
  );
}
