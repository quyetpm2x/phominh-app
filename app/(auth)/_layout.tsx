import { Stack } from 'expo-router';

// Luồng auth hiện giữ các màn nền tảng để đi tiếp onboarding: Welcome, nhập số điện thoại và bước
// OTP placeholder để route tiếp theo luôn tồn tại trong lúc hoàn thiện xác thực thật.
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="terms-of-use" />
      <Stack.Screen name="phone-input" />
      <Stack.Screen name="otp-verify" />
    </Stack>
  );
}
