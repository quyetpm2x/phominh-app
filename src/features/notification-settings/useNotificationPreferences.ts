import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { DEFAULT_PREFERENCES, restorePreferences, type NotificationPreferences } from './preferences';

const STORAGE_KEY = 'pho-minh.notification-preferences.v1';
// Local preferences, ready for the notification delivery service to consume.
// There is no push delivery/scheduling service wired into the app yet.
export function useNotificationPreferences() {
  const [preferences, setPreferences] = useState({ ...DEFAULT_PREFERENCES });
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const busy = useRef(false);
  const current = useRef(preferences);
  useEffect(() => {
    let active = true;
    SecureStore.getItemAsync(STORAGE_KEY)
      .then((raw) => {
        if (!active) return;
        current.current = restorePreferences(raw);
        setPreferences(current.current);
        setReady(true);
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  const update = async (patch: Partial<NotificationPreferences>) => {
    if (!ready || busy.current) return false;
    busy.current = true;
    setSaving(true);
    const next = { ...current.current, ...patch };
    try {
      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(next));
      current.current = next;
      setPreferences(next);
      return true;
    } catch {
      Alert.alert('Chưa lưu được cài đặt', 'Vui lòng thử lại.');
      return false;
    } finally {
      busy.current = false;
      setSaving(false);
    }
  };
  return {
    preferences,
    ready,
    saving,
    update,
    loadError,
    retry: () => {
      setLoadError(false);
      setAttempt((value) => value + 1);
    },
  };
}
