import { Stack } from 'expo-router';

// Dọn sạch 2026-08-29 — chỉ còn giữ 3 màn Splash/Welcome/Phone-input (xem tai-lieu-chuc-nang.md),
// các màn onboarding tiếp theo (OTP/điều khoản/quyền/khu vực/thông tin cá nhân/done) đã bị xoá,
// sẽ xây lại từ đầu sau này.
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="phone-input" />
    </Stack>
  );
}
