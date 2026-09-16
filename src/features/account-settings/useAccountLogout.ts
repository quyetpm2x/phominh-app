import { useRef, useState } from 'react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { LOCAL_SIGN_IN_KEY } from '../../lib/personalProfile';
import { usePostInteractions } from '../home/postInteractions';
export function useAccountLogout() {
  const [loggingOut, setLoggingOut] = useState(false);
  const busy = useRef(false);
  const logout = async () => {
    if (busy.current) return;
    busy.current = true;
    setLoggingOut(true);
    try {
      await SecureStore.deleteItemAsync(LOCAL_SIGN_IN_KEY);
      usePostInteractions.getState().reset();
      router.replace('/(auth)/welcome');
    } catch {
      Alert.alert('Chưa đăng xuất được', 'Vui lòng thử lại.');
    } finally {
      busy.current = false;
      setLoggingOut(false);
    }
  };
  return { loggingOut, logout };
}
