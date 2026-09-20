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
          <Stack.Screen name="edit-area" />
          <Stack.Screen name="profile" options={{ gestureEnabled: false }} />
          <Stack.Screen name="invite" />
          <Stack.Screen name="wallet" />
          <Stack.Screen name="balance-history" />
          <Stack.Screen name="monetization-settings" />
          <Stack.Screen name="reward-ranking" />
          <Stack.Screen name="bank-accounts" />
          <Stack.Screen name="withdrawal" />
          <Stack.Screen name="messages" />
          <Stack.Screen name="report" />
          <Stack.Screen name="report-success" options={{ gestureEnabled: false }} />
          <Stack.Screen name="merchant" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="about" />
          <Stack.Screen name="privacy-policy" />
          <Stack.Screen name="community-policy" />
          <Stack.Screen name="help-faq" />
          <Stack.Screen name="account-settings" />
          <Stack.Screen name="delete-account" />
          <Stack.Screen name="delete-account-sent" />
          <Stack.Screen name="hidden-items" />
          <Stack.Screen name="privacy-settings" />
          <Stack.Screen name="priority-neighbors" />
          <Stack.Screen name="app-permissions" />
          <Stack.Screen name="notification-settings" />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
