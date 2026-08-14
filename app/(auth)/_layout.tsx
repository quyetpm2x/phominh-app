import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="phone-input" />
      <Stack.Screen name="otp-verify" />
      <Stack.Screen name="terms" />
      <Stack.Screen name="permissions" />
      <Stack.Screen name="area-home" />
      <Stack.Screen name="area-work" />
      <Stack.Screen name="done" />
    </Stack>
  );
}
