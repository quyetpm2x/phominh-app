import { Stack } from 'expo-router';

// Luồng onboarding: Welcome → số điện thoại → OTP → cấp quyền thiết bị.
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="terms-of-use" />
      <Stack.Screen name="phone-input" />
      <Stack.Screen name="otp-verify" />
      <Stack.Screen name="permissions" />
      <Stack.Screen name="home-area" />
      <Stack.Screen name="work-info" />
      <Stack.Screen name="onboarding-complete" />
    </Stack>
  );
}
