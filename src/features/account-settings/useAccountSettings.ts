import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { EMPTY_PROFILE, PROFILE_STORAGE_KEY, restoreProfile } from '../../lib/personalProfile';
import { useAccountLogout } from './useAccountLogout';
export function useAccountSettings() {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { loggingOut, logout } = useAccountLogout();
  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setProfile(restoreProfile(await SecureStore.getItemAsync(PROFILE_STORAGE_KEY)));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );
  return { profile, loading, error, retry: load, loggingOut, logout };
}
