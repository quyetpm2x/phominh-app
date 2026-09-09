import '../global.css';
import {
  BeVietnamPro_400Regular,
  BeVietnamPro_500Medium,
  BeVietnamPro_600SemiBold,
  BeVietnamPro_700Bold,
  BeVietnamPro_900Black,
} from '@expo-google-fonts/be-vietnam-pro';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
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
    BeVietnamPro_900Black,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
  });

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
          <Stack.Screen name="home" options={{ gestureEnabled: false }} />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="post/[id]" />
          <Stack.Screen name="post/statistics/[id]" />
          <Stack.Screen name="post/edit/[id]" options={{ gestureEnabled: false }} />
          <Stack.Screen name="profile" />
          <Stack.Screen name="messages" />
          <Stack.Screen name="report" />
          <Stack.Screen name="report-success" options={{ gestureEnabled: false }} />
          <Stack.Screen name="merchant" />
          <Stack.Screen name="settings" />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
