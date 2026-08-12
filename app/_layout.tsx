import '../global.css';
import {
  BeVietnamPro_400Regular,
  BeVietnamPro_500Medium,
  BeVietnamPro_600SemiBold,
  BeVietnamPro_700Bold,
} from '@expo-google-fonts/be-vietnam-pro';
import { JetBrainsMono_400Regular, JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient();
const FONT_LOAD_TIMEOUT_MS = 4000;

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BeVietnamPro_400Regular,
    BeVietnamPro_500Medium,
    BeVietnamPro_600SemiBold,
    BeVietnamPro_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
  });

  // useFonts đôi khi không bao giờ resolve thành true LẪN không báo lỗi trên 1 số máy thật (gặp
  // trên thiết bị thật nhiều hơn simulator) — nếu chỉ chờ fontsLoaded/fontError, màn hình có thể
  // kẹt trắng vô hạn. Đặt trần thời gian chờ cứng: hết giờ vẫn render app, chữ chỉ tạm dùng font hệ
  // thống thay vì Be Vietnam Pro/JetBrains Mono.
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), FONT_LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

  if (fontError) {
    console.error('[fonts] load failed:', fontError);
  }

  if (!fontsLoaded && !fontError && !timedOut) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 bg-background" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
          <Stack.Screen name="post" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="messages" />
          <Stack.Screen name="report" />
          <Stack.Screen name="merchant" />
          <Stack.Screen name="settings" />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
